import * as THREE from 'three';
import view from './world-3d-view.json';
import { freshWorldConfig, validateWorldConfig, type WorldConfig } from './world-3d-config';
import blackmarbleUrl from '../../../assets/world/blackmarble.jpg?url';
import { createWorldMotion } from './world-3d-motion';
import { applyMarbleUniforms, createAtmosphereMaterial, createMarbleUniforms, marbleShader } from './world-3d-marble';

// Keep the arc implementation available while connections are temporarily off.
const connections = [[0, 1]];

function toPosition(latitude: number, longitude: number) {
	const lat = THREE.MathUtils.degToRad(latitude);
	const lon = THREE.MathUtils.degToRad(longitude);
	return new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon));
}

export function createGlobe(host: HTMLElement, canvas: HTMLCanvasElement, points: number[][], locations: { id: string; latitude: number; longitude: number }[], initialConfig: WorldConfig = freshWorldConfig()) {
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
	renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(-view.width / 2, view.width / 2, view.top, view.top - view.width / view.aspect, 0.1, 20);
	camera.position.z = 4.2;
	const globe = new THREE.Group();
	const startingConfig = validateWorldConfig(initialConfig);
	globe.rotation.set(THREE.MathUtils.degToRad(startingConfig.pitch), THREE.MathUtils.degToRad(startingConfig.yaw), THREE.MathUtils.degToRad(startingConfig.roll));
	const rotationMotion = createWorldMotion(globe.quaternion);
	scene.add(globe);
	const time = { value: 0 };
	let config = startingConfig;
	let started = false;
	let disposed = false;
	let texture: THREE.Texture | undefined;
	let textureReady = false;
	let textureFailed = false;
	const canPresent = () => started && (config.surface !== 'blackmarble' || textureReady || textureFailed);
	const geometries: THREE.BufferGeometry[] = [];
	const materials: THREE.Material[] = [];
	const ownGeometry = <T extends THREE.BufferGeometry>(geometry: T) => { geometries.push(geometry); return geometry; };
	const ownMaterial = <T extends THREE.Material>(material: T) => { materials.push(material); return material; };
	const marbleUniforms = createMarbleUniforms(config);

	const ocean = ownMaterial(new THREE.ShaderMaterial({
		transparent: true,
		uniforms: { ...marbleUniforms, uTime: time, uDark: { value: new THREE.Color(config.oceanDark) }, uLight: { value: new THREE.Color(config.oceanLight) }, uRim: { value: new THREE.Color(config.rimColor) }, uRimStrength: { value: config.rimStrength }, uOpacity: { value: config.oceanOpacity }, uMap: { value: null as THREE.Texture | null }, uUseMap: { value: false }, uBrightness: { value: config.textureBrightness } },
		vertexShader: `
			varying vec3 vNormal;
			varying vec3 vPosition;
			void main() {
				vNormal = normalize(normalMatrix * normal);
				vPosition = position;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform float uTime;
			uniform vec3 uDark;
			uniform vec3 uLight;
			uniform vec3 uRim;
			uniform float uRimStrength;
			uniform float uOpacity;
			uniform sampler2D uMap;
			uniform bool uUseMap;
			uniform float uBrightness;
			${marbleShader}
			varying vec3 vNormal;
			varying vec3 vPosition;
			void main() {
				float edge = pow(1.0 - max(vNormal.z, 0.0), 2.0);
				float aurora = 0.5 + 0.5 * sin(vPosition.y * 3.0 + vPosition.x * 2.0 + uTime * 0.15);
				vec3 color = mix(uDark, uLight, aurora);
				color += edge * uRim * uRimStrength;
				if (uUseMap) {
					// Longitude zero lies at the image center; north is at the top.
					// Derive UVs from the same axes as the geographic markers.
					vec3 direction = normalize(vPosition);
					vec2 mapUv = vec2(0.5 + atan(direction.x, direction.z) / 6.28318530718, 0.5 + asin(clamp(direction.y, -1.0, 1.0)) / 3.14159265359);
					color = renderMarble(mapUv);
				}
				gl_FragColor = vec4(color, uOpacity);
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
			}
		`,
	}));
	const sphere = new THREE.Mesh(ownGeometry(new THREE.SphereGeometry(0.997, 64, 48)), ocean);
	// Draw the ocean before the transparent dots and arcs, preserving depth.
	sphere.renderOrder = -1;
	globe.add(sphere);
	const atmosphereMaterial = ownMaterial(createAtmosphereMaterial(config));
	const atmosphere = new THREE.Mesh(ownGeometry(new THREE.SphereGeometry(1, 64, 48)), atmosphereMaterial);
	atmosphere.scale.setScalar(0.997 + config.atmosphereWidth);
	atmosphere.visible = false;
	globe.add(atmosphere);
	const atmosphereGlowMaterial = ownMaterial(createAtmosphereMaterial(config, true));
	const atmosphereGlow = new THREE.Mesh(atmosphere.geometry, atmosphereGlowMaterial);
	atmosphereGlow.scale.setScalar(0.997 + config.atmosphereWidth + config.atmosphereGlowWidth);
	atmosphereGlow.visible = false;
	globe.add(atmosphereGlow);

	const dotGeometry = ownGeometry(new THREE.BufferGeometry());
	dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
	dotGeometry.setAttribute('aPhase', new THREE.Float32BufferAttribute(points.map((_, i) => (i * 0.61803398875 % 1) * Math.PI * 2), 1));
	const dots = ownMaterial(new THREE.ShaderMaterial({
		transparent: true,
		depthWrite: false,
		uniforms: { uTime: time, uPixelRatio: { value: renderer.getPixelRatio() }, uWorldPixels: { value: 1 }, uIntensity: { value: config.dotIntensity }, uGlow: { value: config.dotGlow }, uSize: { value: config.dotSize }, uTwinkle: { value: config.twinkle }, uColor: { value: new THREE.Color(config.dotColor) }, uHighlight: { value: new THREE.Color(config.dotHighlight) }, uOpacity: { value: config.dotOpacity } },
		vertexShader: `
			uniform float uTime;
			uniform float uPixelRatio;
			uniform float uWorldPixels;
			uniform float uGlow;
			uniform float uSize;
			uniform float uTwinkle;
			attribute float aPhase;
			varying float vLight;
			varying float vFacing;
			void main() {
				vec4 viewPosition = modelViewMatrix * vec4(position * 1.002, 1.0);
				vFacing = normalize(normalMatrix * position).z;
				vLight = 0.65 + 0.35 * sin(aPhase + uTime * 1.3) * uTwinkle;
				gl_PointSize = max(1.0, 0.0018 * uWorldPixels * uPixelRatio * uSize * (1.0 + uGlow));
				gl_Position = projectionMatrix * viewPosition;
			}
		`,
		fragmentShader: `
			uniform vec3 uColor;
			uniform vec3 uHighlight;
			uniform float uIntensity;
			uniform float uGlow;
			uniform float uOpacity;
			varying float vLight;
			varying float vFacing;
			void main() {
				float radius = length(gl_PointCoord - 0.5);
				if (radius > 0.5 || vFacing < 0.02) discard;
				float coreRadius = radius * (1.0 + uGlow);
				float core = 1.0 - smoothstep(0.3, 0.5, coreRadius);
				float halo = exp(-radius * radius * 18.0) * (1.0 - smoothstep(0.35, 0.5, radius)) * uGlow * 0.4;
				float alpha = clamp(core + halo, 0.0, 1.0) * smoothstep(0.0, 0.3, vFacing);
				vec3 color = mix(uColor, mix(uColor, uHighlight, vLight), core) * uIntensity;
				gl_FragColor = vec4(color, alpha * uOpacity);
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
			}
		`,
	}));
	const land = new THREE.Points(dotGeometry, dots);
	globe.add(land);

	const arcColors = [0x635bff, 0x00d4ff, 0x80e9ff, 0x9b7bff];
	const arcs = new THREE.Group();
	arcs.visible = config.arcs;
	globe.add(arcs);
	connections.forEach(([from, to], index) => {
		const start = toPosition(locations[from].latitude, locations[from].longitude);
		const end = toPosition(locations[to].latitude, locations[to].longitude);
		const angle = start.angleTo(end);
		const height = 1 + start.distanceTo(end) * 0.48;
		const along = (fraction: number) => start.clone().multiplyScalar(Math.sin((1 - fraction) * angle))
			.addScaledVector(end, Math.sin(fraction * angle)).divideScalar(Math.sin(angle)).normalize().multiplyScalar(height);
		const curve = new THREE.CubicBezierCurve3(start, along(0.25), along(0.75), end);
		const geometry = ownGeometry(new THREE.TubeGeometry(curve, 64, 0.0022, 5, false));
		const material = ownMaterial(new THREE.ShaderMaterial({
			transparent: true,
			depthWrite: false,
			uniforms: { uTime: time, uOffset: { value: index * 0.39 }, uColor: { value: new THREE.Color(arcColors[index % arcColors.length]) } },
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform float uTime;
				uniform float uOffset;
				uniform vec3 uColor;
				varying vec2 vUv;
				void main() {
					float progress = mod(uTime * 0.22 + uOffset, 1.5);
					float trail = smoothstep(progress - 0.35, progress - 0.04, vUv.x) * (1.0 - smoothstep(progress - 0.015, progress, vUv.x));
					gl_FragColor = vec4(uColor, trail * 0.95);
					#include <tonemapping_fragment>
					#include <colorspace_fragment>
				}
			`,
		}));
		arcs.add(new THREE.Mesh(geometry, material));
	});

	const projectedPosition = new THREE.Vector3();
	const cityPositions = locations.map((location) => ({ ...location, position: toPosition(location.latitude, location.longitude).multiplyScalar(1.006) }));

	let frame = 0;
	let visible = false;
	let paused = false;
	let failed = false;
	let lastTime = 0;
	let elapsed = 2;
	let activePointer: number | undefined;
	let focusedCity: string | undefined;
	const finishFocus = () => {
		if (!focusedCity) return;
		const id = focusedCity;
		focusedCity = undefined;
		host.dispatchEvent(new CustomEvent('world-3d:focusend', { bubbles: true, detail: { id } }));
	};
	let dragNotified = false;
	let pointerX = 0;
	let pointerY = 0;
	const horizontalAxis = new THREE.Vector3(0, 1, 0);
	const verticalAxis = new THREE.Vector3(1, 0, 0);
	const lockedRotation = new THREE.Euler();
	let constrainDragRotation = false;
	const preserveLockedCoordinates = () => {
		if (!constrainDragRotation) return;
		globe.rotation.set(
			config.lockRotationX ? lockedRotation.x : globe.rotation.x,
			config.lockRotationY ? lockedRotation.y : globe.rotation.y,
			config.lockRotationZ ? lockedRotation.z : globe.rotation.z,
		);
	};
	const endDrag = (release = false, time = performance.now()) => {
		const pointer = activePointer;
		activePointer = undefined;
		if (pointer !== undefined) {
			if (release) rotationMotion.release(time, !paused && !motion.matches);
			else rotationMotion.cancel();
		}
		host.removeAttribute('data-dragging');
		if (pointer !== undefined && canvas.hasPointerCapture(pointer)) canvas.releasePointerCapture(pointer);
		if (pointer !== undefined && !rotationMotion.active()) host.dispatchEvent(new CustomEvent('world-3d:viewchange'));
	};
	const motion = matchMedia('(prefers-reduced-motion: reduce)');
	const projectCities = () => {
		if (!canPresent() || failed) return;
		camera.updateMatrixWorld();
		const positions = cityPositions.map(({ id, position }) => {
			projectedPosition.copy(position).applyQuaternion(globe.quaternion);
			const facing = projectedPosition.z > 0.06;
			projectedPosition.project(camera);
			return { id, x: (projectedPosition.x + 1) / 2, y: (1 - projectedPosition.y) / 2, visible: facing && Math.abs(projectedPosition.x) < 1 && Math.abs(projectedPosition.y) < 1 };
		});
		host.dispatchEvent(new CustomEvent('world-3d:project', { bubbles: true, detail: { positions, markerColor: config.markerColor, markerSize: config.markerSize, pulse: config.pulse } }));
	};
	const render = (now: number) => {
		frame = 0;
		if (!visible || document.hidden || failed || !canPresent()) return;
		const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
		lastTime = now;
		const wasRotating = rotationMotion.active();
		rotationMotion.update(delta, motion.matches);
		preserveLockedCoordinates();
		if (wasRotating && !rotationMotion.active()) host.dispatchEvent(new CustomEvent('world-3d:viewchange'));
		const moving = !paused && !motion.matches;
		if (moving) {
			elapsed += delta * config.speed;
		}
		time.value = elapsed;
		renderer.render(scene, camera);
		projectCities();
		host.removeAttribute('data-fallback');
		host.setAttribute('data-ready', '');
		if (!rotationMotion.active()) finishFocus();
		if (moving || rotationMotion.active()) frame = requestAnimationFrame(render);
	};
	const requestRender = () => { if (!frame && visible && !document.hidden && !failed) frame = requestAnimationFrame(render); };
	const updateSurface = () => {
		const useTexture = config.surface === 'blackmarble' && textureReady;
		ocean.uniforms.uUseMap.value = useTexture;
		ocean.uniforms.uBrightness.value = config.textureBrightness;
		land.visible = !useTexture;
		atmosphere.visible = config.atmosphereStrength > 0;
		atmosphereGlow.visible = atmosphere.visible && config.atmosphereGlow > 0;
	};
	const loadTexture = () => {
		if (config.surface !== 'blackmarble' || texture || disposed) return;
		textureFailed = false;
		texture = new THREE.TextureLoader().load(blackmarbleUrl, (loaded) => {
			if (disposed) { loaded.dispose(); return; }
			loaded.colorSpace = THREE.SRGBColorSpace;
			loaded.wrapS = THREE.RepeatWrapping;
			loaded.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
			ocean.uniforms.uMap.value = loaded;
			textureReady = true;
			marbleUniforms.uTexel.value.set(1 / loaded.image.width, 1 / loaded.image.height);
			updateSurface();
			requestRender();
		}, undefined, () => {
			texture?.dispose();
			texture = undefined;
			if (disposed) return;
			textureReady = false;
			textureFailed = true;
			updateSurface();
			host.dispatchEvent(new CustomEvent('world-3d:textureerror'));
			requestRender();
		});
	};
	const stop = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; };
	const updateCamera = () => {
		const { width, height } = host.getBoundingClientRect();
		if (!width || !height) return;
		renderer.setSize(width, height, false);
		// Equal world units per pixel on both axes preserve the spherical outline.
		// The frustum is a window onto a larger sphere, cropped below and at its sides.
		const compositionWidth = Math.max(width, height * view.aspect);
		const worldWidth = view.width / config.zoom;
		dots.uniforms.uWorldPixels.value = compositionWidth / worldWidth;
		const visibleWidth = worldWidth * width / compositionWidth;
		camera.left = -visibleWidth / 2;
		camera.right = visibleWidth / 2;
		camera.top = view.top + config.offset;
		camera.bottom = camera.top - worldWidth * height / compositionWidth;
		camera.updateProjectionMatrix();
		requestRender();
	};
	const resize = new ResizeObserver(updateCamera);
	const visibility = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		if (!visible) { endDrag(); settleRotation(); }
		stop();
		if (visible) requestRender();
	});
	const settleRotation = () => {
		if (!rotationMotion.active()) return;
		if (focusedCity) {
			rotationMotion.update(0, true);
			projectCities();
			finishFocus();
		} else rotationMotion.cancel();
		host.dispatchEvent(new CustomEvent('world-3d:viewchange'));
	};
	const onVisibility = () => { if (document.hidden) { endDrag(); settleRotation(); } stop(); requestRender(); };
	const onMotion = () => {
		const wasRotating = rotationMotion.active();
		rotationMotion.update(0, motion.matches);
		if (!rotationMotion.active()) { projectCities(); finishFocus(); }
		if (wasRotating && !rotationMotion.active()) host.dispatchEvent(new CustomEvent('world-3d:viewchange'));
		stop(); requestRender();
	};
	const setPaused = (value: boolean) => {
		paused = value;
		if (paused) settleRotation();
		stop();
		requestRender();
		host.dispatchEvent(new CustomEvent('world-3d:pausechange'));
	};
	const onPointerDown = (event: PointerEvent) => {
		if (event.pointerType === 'touch') return;
		if (config.lockRotationX && config.lockRotationY && config.lockRotationZ) return;
		if (!event.isPrimary || event.button !== 0 || activePointer !== undefined || failed) return;
		activePointer = event.pointerId;
		dragNotified = false;
		focusedCity = undefined;
		rotationMotion.begin(event.timeStamp);
		lockedRotation.copy(globe.rotation);
		constrainDragRotation = true;
		pointerX = event.clientX;
		pointerY = event.clientY;
		canvas.setPointerCapture(event.pointerId);
		host.setAttribute('data-dragging', '');
	};
	const onPointerMove = (event: PointerEvent) => {
		if (event.pointerId !== activePointer) return;
		// Camera units per CSS pixel make pointer rotation track the sphere.
		const radiansPerPixel = (camera.right - camera.left) / Math.max(canvas.clientWidth, 1);
		const horizontal = (event.clientX - pointerX) * radiansPerPixel;
		const vertical = (event.clientY - pointerY) * radiansPerPixel;
		if (!dragNotified && Math.abs(horizontal) + Math.abs(vertical) > 0.002) {
			dragNotified = true;
			host.dispatchEvent(new CustomEvent('world-3d:dragstart', { bubbles: true }));
		}
		globe.rotateOnWorldAxis(horizontalAxis, horizontal);
		globe.rotateOnWorldAxis(verticalAxis, vertical);
		preserveLockedCoordinates();
		rotationMotion.drag(horizontal, vertical, event.timeStamp);
		pointerX = event.clientX;
		pointerY = event.clientY;
		// Manual rotation remains available when animations are paused or reduced.
		requestRender();
	};
	const onPointerEnd = (event: PointerEvent) => {
		if (event.pointerId !== activePointer) return;
		endDrag(event.type === 'pointerup', event.timeStamp);
		requestRender();
	};
	const onContextLost = (event: Event) => {
		event.preventDefault();
		failed = true;
		endDrag();
		settleRotation();
		stop();
		host.removeAttribute('data-ready');
		host.setAttribute('data-fallback', '');
		host.dispatchEvent(new CustomEvent('world-3d:unavailable', { bubbles: true }));
	};
	const onContextRestored = () => { failed = false; requestRender(); };
	canvas.addEventListener('pointerdown', onPointerDown);
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerup', onPointerEnd);
	canvas.addEventListener('pointercancel', onPointerEnd);
	canvas.addEventListener('lostpointercapture', onPointerEnd);
	canvas.addEventListener('webglcontextlost', onContextLost);
	canvas.addEventListener('webglcontextrestored', onContextRestored);
	document.addEventListener('visibilitychange', onVisibility);
	motion.addEventListener('change', onMotion);
	resize.observe(host);
	visibility.observe(host);
	host.toggleAttribute('data-drag-locked', config.lockRotationX && config.lockRotationY && config.lockRotationZ);
	updateSurface();
	loadTexture();
	updateCamera();

	return {
		start() { started = true; requestRender(); },
		apply(value: WorldConfig) {
			config = validateWorldConfig(value);
			endDrag();
			rotationMotion.cancel();
			focusedCity = undefined;
			constrainDragRotation = false;
			host.toggleAttribute('data-drag-locked', config.lockRotationX && config.lockRotationY && config.lockRotationZ);
			globe.rotation.set(THREE.MathUtils.degToRad(config.pitch), THREE.MathUtils.degToRad(config.yaw), THREE.MathUtils.degToRad(config.roll));
			ocean.uniforms.uDark.value.set(config.oceanDark);
			ocean.uniforms.uLight.value.set(config.oceanLight);
			ocean.uniforms.uRim.value.set(config.rimColor);
			ocean.uniforms.uRimStrength.value = config.rimStrength;
			ocean.uniforms.uOpacity.value = config.oceanOpacity;
			applyMarbleUniforms(marbleUniforms, config);
			atmosphereMaterial.uniforms.uColor.value.set(config.atmosphereColor);
			atmosphereMaterial.uniforms.uStrength.value = config.atmosphereStrength;
			atmosphereMaterial.uniforms.uOpacity.value = config.oceanOpacity;
			atmosphere.scale.setScalar(0.997 + config.atmosphereWidth);
			atmosphereGlowMaterial.uniforms.uColor.value.set(config.atmosphereColor);
			atmosphereGlowMaterial.uniforms.uStrength.value = config.atmosphereStrength * config.atmosphereGlow;
			atmosphereGlowMaterial.uniforms.uOpacity.value = config.oceanOpacity;
			atmosphereGlowMaterial.uniforms.uInnerRadius.value = 0.997 / (0.997 + config.atmosphereWidth + config.atmosphereGlowWidth);
			atmosphereGlow.scale.setScalar(0.997 + config.atmosphereWidth + config.atmosphereGlowWidth);
			dots.uniforms.uColor.value.set(config.dotColor);
			dots.uniforms.uHighlight.value.set(config.dotHighlight);
			dots.uniforms.uSize.value = config.dotSize;
			dots.uniforms.uIntensity.value = config.dotIntensity;
			dots.uniforms.uGlow.value = config.dotGlow;
			dots.uniforms.uOpacity.value = config.dotOpacity;
			dots.uniforms.uTwinkle.value = config.twinkle;
			arcs.visible = config.arcs;
			updateSurface();
			loadTexture();
			updateCamera();
			requestRender();
		},
		snapshot(): WorldConfig {
			return { ...config, pitch: THREE.MathUtils.radToDeg(globe.rotation.x), yaw: THREE.MathUtils.radToDeg(globe.rotation.y), roll: THREE.MathUtils.radToDeg(globe.rotation.z) };
		},
		pause: setPaused,
		isPaused: () => paused,
		focus(id: string, immediate = false) {
			const location = locations.find((item) => item.id === id);
			if (!location) return;
			const targetY = THREE.MathUtils.clamp((camera.top + camera.bottom) / 2, -0.95, 0.95);
			endDrag();
			constrainDragRotation = false;
			const target = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(location.latitude) - Math.asin(targetY), -THREE.MathUtils.degToRad(location.longitude), 0));
			focusedCity = id;
			rotationMotion.focus(target, immediate || motion.matches || !visible);
			projectCities();
			if (!rotationMotion.active()) finishFocus();
			requestRender();
			if (!rotationMotion.active()) host.dispatchEvent(new CustomEvent('world-3d:viewchange'));
		},
		dispose() {
			disposed = true;
			endDrag();
			rotationMotion.cancel();
			stop();
			resize.disconnect();
			visibility.disconnect();
			canvas.removeEventListener('pointerdown', onPointerDown);
			canvas.removeEventListener('pointermove', onPointerMove);
			canvas.removeEventListener('pointerup', onPointerEnd);
			canvas.removeEventListener('pointercancel', onPointerEnd);
			canvas.removeEventListener('lostpointercapture', onPointerEnd);
			canvas.removeEventListener('webglcontextlost', onContextLost);
			canvas.removeEventListener('webglcontextrestored', onContextRestored);
			document.removeEventListener('visibilitychange', onVisibility);
			motion.removeEventListener('change', onMotion);
			geometries.forEach((geometry) => geometry.dispose());
			materials.forEach((material) => material.dispose());
			texture?.dispose();
			renderer.dispose();
		},
	};
}
