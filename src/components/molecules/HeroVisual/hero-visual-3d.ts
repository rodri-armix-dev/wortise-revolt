import { createWortiseMarkGeometry } from './wortise-mark-geometry';
import { createMaterialRenderer } from './wortise-material-renderer';
import { defaultMaterial } from './wortise-material';
import { createPointerMotion } from './wortise-pointer-motion';
import { createScrollMotion } from './wortise-scroll-motion';
import { createMotionPreview, defaultMotion } from './wortise-motion-preview';

// The PNG is hidden by default and available only for manual editor comparison.
class WortiseMark3D extends HTMLElement {
	private cleanup?: () => void;
	private observer?: IntersectionObserver;
	private generation = 0;

	connectedCallback() {
		const generation = ++this.generation;
		this.observer = new IntersectionObserver((entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			this.observer?.disconnect();
			void this.mount(generation).catch(() => {
				if (generation !== this.generation) return;
				this.cleanup?.();
				this.removeAttribute('data-ready');
			});
		}, { rootMargin: '120px' });
		this.observer.observe(this);
	}

	disconnectedCallback() {
		this.generation++;
		this.observer?.disconnect();
		this.cleanup?.();
		this.cleanup = undefined;
		this.removeAttribute('data-ready');
	}

	private async mount(generation: number) {
		const [THREE, { RoomEnvironment }] = await Promise.all([
			import('three'),
			import('three/addons/environments/RoomEnvironment.js'),
		]);
		if (!this.isConnected || generation !== this.generation) return;
		const canvas = this.querySelector('canvas');
		if (!canvas) return;
		// Extra drawing space preserves the PNG's scale throughout the full rotation.
		const overscan = 0.2;
		canvas.style.setProperty('--hero-visual-canvas-overscan', `${overscan * 100}%`);
		canvas.style.opacity = String(defaultMaterial.transparencia.opacidad);

		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
		renderer.setClearColor(0x000000, 0);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.1;
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
		camera.position.set(0, 0, 7);
		const mark = new THREE.Group();
		// Match the PNG's projected corners: left edge visible, right arm receding.
		const restPose = { pitch: -0.198, yaw: 0.425, roll: 0.098, x: 0.25, y: 0.007 };
		mark.position.x = restPose.x;
		scene.add(mark);

		const geometries: InstanceType<typeof THREE.ExtrudeGeometry>[] = [];
		let environment: ReturnType<InstanceType<typeof THREE.PMREMGenerator>['fromScene']> | undefined;
		const materials = createMaterialRenderer(THREE);
		let disposePanel: (() => void) | undefined;
		let paused = false;
		let comparing = false;
		const animationPreview = createMotionPreview(defaultMotion);
		const pointerMotion = createPointerMotion();
		let materialOpacity = defaultMaterial.transparencia.opacidad;
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		let frame = 0;
		let visible = false;
		let failed = false;
		let pointerX = 0;
		let pointerY = 0;
		let yaw = restPose.yaw;
		let pitch = restPose.pitch;
		let elapsed = 0;
		let lastTime = 0;
		const visualInteraction = this.closest('.hero-visual') ?? this;
		const interaction = this.closest('.hero') ?? visualInteraction;
		const scrollMotion = createScrollMotion(window.scrollY, performance.now());
		let scrollTilt = 0;
		let activeTouch: number | undefined;
		let suppressClickUntil = 0;
		let touchStartX = 0;
		let touchStartY = 0;
		let touchStartTime = 0;
		let touchMoved = false;

		const render = (time: number) => {
			frame = 0;
			if (failed || !visible || document.hidden) return;
			const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
			lastTime = time;
			const still = motion.matches || paused;
			if (!still) elapsed += delta;
			scrollTilt = still || comparing ? 0 : scrollMotion.sample(delta);
			const preview = still ? undefined : animationPreview?.sample(delta);
			const pointerRotation = still || comparing ? undefined : pointerMotion.sample(delta, {
				yaw: preview?.yaw ?? 0, pitch: preview?.pitch ?? 0, roll: preview?.roll ?? 0,
			}, pointerX, pointerY);
			yaw = restPose.yaw + (still ? 0 : (pointerRotation?.yaw ?? preview?.yaw ?? 0));
			pitch = restPose.pitch + (still ? 0 : (pointerRotation?.pitch ?? preview?.pitch ?? 0) + scrollTilt);
			mark.rotation.set(pitch, yaw, restPose.roll + (pointerRotation?.roll ?? preview?.roll ?? 0));
			mark.scale.setScalar(preview?.scale ?? 1);
			canvas.style.opacity = String(materialOpacity * (preview?.opacity ?? 1));
			mark.position.y = restPose.y + (still ? 0 : (preview?.y ?? Math.sin(elapsed * 0.9) * 0.035));
			try {
				renderer.render(scene, camera);
				this.setAttribute('data-ready', '');
			} catch {
				failed = true;
				this.removeAttribute('data-ready');
			}
			if (visible && !document.hidden && !still && !comparing && !failed) frame = requestAnimationFrame(render);
		};
		const requestRender = () => {
			if (!frame && !failed && visible && !document.hidden) frame = requestAnimationFrame(render);
		};
		const updateScroll = () => {
			if (!visible || document.hidden || motion.matches || paused || comparing) {
				scrollMotion.reset(window.scrollY, performance.now());
				return;
			}
			if (scrollMotion.update(window.scrollY, performance.now())) {
				resetPointer();
				animationPreview.reset();
			}
			requestRender();
		};
		const resize = new ResizeObserver(() => {
			const { width, height } = this.getBoundingClientRect();
			if (!width || !height) return;
			const renderWidth = width * (1 + 2 * overscan);
			const renderHeight = height * (1 + 2 * overscan);
			renderer.setSize(renderWidth, renderHeight, false);
			camera.aspect = width / height;
			// Fit the same object at every aspect ratio without cropping the bevels.
			camera.position.z = Math.max(4.84, 3.25 / camera.aspect / (2 * Math.tan(THREE.MathUtils.degToRad(16))));
			camera.setViewOffset(width, height, -width * overscan, -height * overscan, renderWidth, renderHeight);
			scrollMotion.reset(window.scrollY, performance.now());
			requestRender();
		});
		const visibility = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			lastTime = 0;
			if (visible) requestRender();
			else {
				activeTouch = undefined;
				scrollMotion.endTouch();
				cancelAnimationFrame(frame);
				frame = 0;
			}
		});
		const onVisibility = () => {
			lastTime = 0;
			if (!document.hidden && visible) requestRender();
			else {
				activeTouch = undefined;
				scrollMotion.endTouch();
				cancelAnimationFrame(frame);
				frame = 0;
			}
		};
		const onPointer = (event: Event) => {
			if (motion.matches || paused || comparing || !(event instanceof PointerEvent) || event.pointerType === 'touch') return;
			const bounds = interaction.getBoundingClientRect();
			pointerX = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
			pointerY = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
		};
		const resetPointer = () => { pointerX = 0; pointerY = 0; pointerMotion.reset(); };
		const onPointerEnter = (event: Event) => {
			if (motion.matches || paused || comparing || !(event instanceof PointerEvent) || event.pointerType !== 'mouse') return;
			onPointer(event);
			pointerMotion.enter({ yaw: mark.rotation.y - restPose.yaw, pitch: mark.rotation.x - restPose.pitch - scrollTilt, roll: mark.rotation.z - restPose.roll });
			// Hover replaces an unfinished entrance without restarting the material fade.
			animationPreview.reset();
			requestRender();
		};
		const onPointerClick = (event: Event) => {
			if (motion.matches || paused || comparing || !(event instanceof MouseEvent) || event.button !== 0) return;
			if (performance.now() < suppressClickUntil || (event instanceof PointerEvent && event.pointerType === 'touch')) return;
			const bounds = interaction.getBoundingClientRect();
			pointerX = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
			pointerY = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
			pointerMotion.spin({ yaw: mark.rotation.y - restPose.yaw, pitch: mark.rotation.x - restPose.pitch - scrollTilt, roll: mark.rotation.z - restPose.roll });
			animationPreview.reset();
			requestRender();
		};
		const onPointerLeave = (event: Event) => {
			if (event instanceof PointerEvent && event.pointerType === 'touch') return;
			pointerX = 0;
			pointerY = 0;
			pointerMotion.leave();
			requestRender();
		};
		const onTouchStart = (event: Event) => {
			if (!(event instanceof PointerEvent) || event.pointerType !== 'touch' || activeTouch !== undefined || motion.matches || paused || comparing) return;
			activeTouch = event.pointerId;
			touchStartX = event.clientX;
			touchStartY = event.clientY;
			touchStartTime = performance.now();
			touchMoved = false;
			suppressClickUntil = performance.now() + 800;
			scrollMotion.startTouch(event.clientY);
			resetPointer();
			animationPreview.reset();
			requestRender();
		};
		const onTouchMove = (event: Event) => {
			if (!(event instanceof PointerEvent) || event.pointerId !== activeTouch) return;
			touchMoved ||= Math.hypot(event.clientX - touchStartX, event.clientY - touchStartY) > 10;
			scrollMotion.moveTouch(event.clientY);
		};
		const onTouchEnd = (event: Event) => {
			if (!(event instanceof PointerEvent) || event.pointerId !== activeTouch) return;
			activeTouch = undefined;
			suppressClickUntil = performance.now() + 800;
			scrollMotion.endTouch();
			const tapped = event.type === 'pointerup' && !touchMoved && Math.hypot(event.clientX - touchStartX, event.clientY - touchStartY) <= 10 && performance.now() - touchStartTime < 350;
			if (tapped && !motion.matches && !paused && !comparing) {
				pointerMotion.spin({ yaw: mark.rotation.y - restPose.yaw, pitch: mark.rotation.x - restPose.pitch - scrollTilt, roll: mark.rotation.z - restPose.roll }, false);
				animationPreview.reset();
			}
			requestRender();
		};
		const onMotion = () => { resetPointer(); scrollMotion.reset(window.scrollY, performance.now()); requestRender(); };
		const onContextLost = (event: Event) => {
			event.preventDefault();
			failed = true;
			cancelAnimationFrame(frame);
			frame = 0;
			this.removeAttribute('data-ready');
		};

		this.cleanup = () => {
			disposePanel?.();
			this.removeAttribute('data-preview-png');
			canvas.style.removeProperty('opacity');
			cancelAnimationFrame(frame);
			resize.disconnect();
			visibility.disconnect();
			visualInteraction.removeEventListener('pointerdown', onTouchStart);
			window.removeEventListener('pointermove', onTouchMove);
			window.removeEventListener('pointerup', onTouchEnd);
			window.removeEventListener('pointercancel', onTouchEnd);
			visualInteraction.removeEventListener('click', onPointerClick);
			interaction.removeEventListener('pointermove', onPointer);
			interaction.removeEventListener('pointerenter', onPointerEnter);
			interaction.removeEventListener('pointerleave', onPointerLeave);
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('scroll', updateScroll);
			motion.removeEventListener('change', onMotion);
			canvas.removeEventListener('webglcontextlost', onContextLost);
			geometries.forEach((geometry) => geometry.dispose());
			materials.dispose();
			environment?.dispose();
			renderer.dispose();
		};

		// Broad studio reflections, generated locally: no HDR download or third-party requests.
		const room = new RoomEnvironment();
		const generator = new THREE.PMREMGenerator(renderer);
		try {
			environment = generator.fromScene(room, 0.04);
			scene.environment = environment.texture;
		} finally {
			room.dispose();
			generator.dispose();
		}

		for (const { geometry, outline, returnDivider } of createWortiseMarkGeometry(THREE)) {
			geometries.push(geometry);
			mark.add(new THREE.Mesh(geometry, [materials.createFace(outline, geometry, returnDivider), materials.sides]));
		}

		scene.add(new THREE.HemisphereLight(0xffe8f1, 0x49071c, 0.4));
		const key = new THREE.DirectionalLight(0xfff4f7, 2);
		key.position.set(-3, 4, 5);
		scene.add(key);
		const rim = new THREE.DirectionalLight(0xff729c, 3);
		rim.position.set(3, 1, -2);
		scene.add(rim);
		const fill = new THREE.DirectionalLight(0xffd6e3, 0.6);
		fill.position.set(1, -3, 3);
		scene.add(fill);

		canvas.addEventListener('webglcontextlost', onContextLost);
		visualInteraction.addEventListener('pointerdown', onTouchStart, { passive: true });
		window.addEventListener('pointermove', onTouchMove, { passive: true });
		window.addEventListener('pointerup', onTouchEnd);
		window.addEventListener('pointercancel', onTouchEnd);
		visualInteraction.addEventListener('click', onPointerClick);
		interaction.addEventListener('pointermove', onPointer, { passive: true });
		interaction.addEventListener('pointerenter', onPointerEnter);
		interaction.addEventListener('pointerleave', onPointerLeave);
		document.addEventListener('visibilitychange', onVisibility);
		window.addEventListener('scroll', updateScroll, { passive: true });
		updateScroll();
		motion.addEventListener('change', onMotion);
		resize.observe(this);
		visibility.observe(this);
		requestRender();

		if (import.meta.env.DEV) {
			const { mountMaterialPanel } = await import('./wortise-material-panel');
			if (!this.isConnected || generation !== this.generation) return;
			disposePanel = mountMaterialPanel(this, {
				apply: (config) => {
					materials.apply(config);
					materialOpacity = config.transparencia.opacidad;
					canvas.style.opacity = String(materialOpacity);
					requestRender();
				},
				pause: (value) => {
					paused = value;
					scrollMotion.reset(window.scrollY, performance.now());
					animationPreview?.reset();
					elapsed = 0;
					lastTime = 0;
					resetPointer();
					requestRender();
				},
				enter: (name) => {
					resetPointer();
					animationPreview?.enter(name);
					lastTime = 0;
					requestRender();
				},
				idle: (name) => {
					resetPointer();
					animationPreview?.idle(name);
					elapsed = 0;
					lastTime = 0;
					requestRender();
				},
				compare: (value) => {
					comparing = value;
					scrollMotion.reset(window.scrollY, performance.now());
					resetPointer();
					lastTime = 0;
					this.toggleAttribute('data-preview-png', value);
					requestRender();
				},
			});
		}
	}
}

if (!customElements.get('wortise-mark-3d')) customElements.define('wortise-mark-3d', WortiseMark3D);

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		document.querySelectorAll<WortiseMark3D>('wortise-mark-3d').forEach((mark) => mark.disconnectedCallback());
	});
}
