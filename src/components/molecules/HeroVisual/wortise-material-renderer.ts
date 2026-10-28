import type * as Three from 'three';
import { freshMaterial, type MaterialConfig } from './wortise-material.ts';

export function createMaterialRenderer(THREE: typeof Three) {
	const uniforms = {
		uShadowColor: { value: new THREE.Color() },
		uReturnColor: { value: new THREE.Color() },
		uShadowIntensity: { value: 0 },
		uShadowSoftness: { value: 0 },
		uEdgeColor: { value: new THREE.Color() },
		uEdgeIntensity: { value: 0 },
		uEdgeWidth: { value: 1.25 },
		uHaloColor: { value: new THREE.Color() },
		uHaloIntensity: { value: 0 },
		uHaloWidth: { value: 0.0385 },
		uDepthBounds: { value: new THREE.Vector2() },
		uSideCorners: { value: Array.from({ length: 10 }, () => new THREE.Vector2()) },
		uSideCornerCount: { value: 0 },
	};
	const declarations = `
uniform vec3 uShadowColor;
uniform vec3 uReturnColor;
uniform float uShadowIntensity;
uniform float uShadowSoftness;
uniform vec3 uEdgeColor;
uniform float uEdgeIntensity;
uniform float uEdgeWidth;
uniform vec3 uHaloColor;
uniform float uHaloIntensity;
uniform float uHaloWidth;
`;
	const sides = new THREE.MeshPhysicalMaterial();
	const faces: InstanceType<typeof THREE.MeshPhysicalMaterial>[] = [];
	let config = freshMaterial();
	let thickness = 0;

	sides.onBeforeCompile = (shader) => {
		Object.assign(shader.uniforms, uniforms);
		shader.vertexShader = `varying vec3 vSidePosition;\n${shader.vertexShader}`.replace(
			'#include <begin_vertex>',
			'#include <begin_vertex>\nvSidePosition = position;',
		);
		shader.fragmentShader = `${declarations}
varying vec3 vSidePosition;
uniform vec2 uDepthBounds;
uniform vec2 uSideCorners[10];
uniform int uSideCornerCount;
${shader.fragmentShader}`.replace('#include <opaque_fragment>', `
// The front and rear rims bound the lateral surface just as the outline
// bounds a front face. Use their distance for the same inset glow treatment.
float rimDistance = max(0.0, min(vSidePosition.z - uDepthBounds.x, uDepthBounds.y - vSidePosition.z));
// Close the lateral outline across its top and bottom ends, through the depth
// of the solid. These edges join the front and rear rims at contour corners.
for (int i = 0; i < 10; i++) {
	if (i >= uSideCornerCount) break;
	rimDistance = min(rimDistance, length(vSidePosition.xy - uSideCorners[i]));
}
float shade = smoothstep(0.0, mix(0.02, 0.3, uShadowSoftness), rimDistance) * uShadowIntensity;
outgoingLight = mix(outgoingLight, outgoingLight * uShadowColor, shade);
float luminousDistance = rimDistance * 0.5;
// Model-space radius scales with the mesh and camera, not with screen pixels.
float edgeRadius = 0.01 * uEdgeWidth;
float edgeCore = exp(-pow(luminousDistance / edgeRadius, 2.0));
float edgeGlow = exp(-luminousDistance / uHaloWidth);
outgoingLight += uEdgeColor * edgeCore * uEdgeIntensity * 3.0
	+ uHaloColor * edgeGlow * uHaloIntensity;
#include <opaque_fragment>`,
		);
	};
	sides.customProgramCacheKey = () => 'wortise-material-sides-v6';

	function apply(next: MaterialConfig) {
		config = next;
		const glass = config.transparencia.modo === 'vidrio';
		uniforms.uShadowColor.value.set(config.sombras.color);
		uniforms.uReturnColor.value.set(config.color.laterales);
		uniforms.uShadowIntensity.value = config.sombras.intensidad;
		uniforms.uShadowSoftness.value = config.sombras.suavidad;
		uniforms.uEdgeColor.value.set(config.reflexion.colorBorde);
		uniforms.uEdgeIntensity.value = config.reflexion.intensidadBorde;
		uniforms.uEdgeWidth.value = config.reflexion.anchoBorde;
		uniforms.uHaloColor.value.set(config.reflexion.colorHalo);
		uniforms.uHaloIntensity.value = config.reflexion.intensidadHalo;
		uniforms.uHaloWidth.value = config.reflexion.anchoHalo;
		for (const material of [sides, ...faces]) {
			const side = material === sides;
			const color = side ? config.color.laterales : config.color.frente;
			// Color#set interprets hexadecimal UI colors as sRGB and converts them to linear.
			material.color.set(color);
			material.attenuationColor.set(color);
			material.attenuationDistance = 1;
			material.metalness = glass ? 0 : config.reflexion.metalizado;
			material.roughness = config.reflexion.rugosidad;
			material.clearcoat = config.reflexion.barniz;
			material.clearcoatRoughness = config.reflexion.rugosidadBarniz;
			material.envMapIntensity = config.reflexion.intensidad;
			material.ior = config.transparencia.indiceRefraccion;
			material.transmission = glass ? config.transparencia.transmision : 0;
			material.thickness = glass ? thickness : 0;
			// Overall fading happens on the canvas; transmissive surfaces keep physical opacity.
			material.opacity = 1;
			material.transparent = false;
		}
	}

	function createFace(outline: InstanceType<typeof THREE.Vector2>[], geometry: InstanceType<typeof THREE.ExtrudeGeometry>, returnDivider?: [Three.Vector2, Three.Vector2]) {
		for (const corner of outline) {
			if (uniforms.uSideCornerCount.value >= uniforms.uSideCorners.value.length) {
				throw new Error('Wortise side contour exceeds the supported corner count.');
			}
			uniforms.uSideCorners.value[uniforms.uSideCornerCount.value++].copy(corner);
		}
		geometry.computeBoundingBox();
		thickness = geometry.boundingBox!.max.z - geometry.boundingBox!.min.z;
		uniforms.uDepthBounds.value.set(geometry.boundingBox!.min.z, geometry.boundingBox!.max.z);
		const face = new THREE.MeshPhysicalMaterial();
		face.onBeforeCompile = (shader) => {
			Object.assign(shader.uniforms, uniforms, {
				uOutline: { value: outline },
				uFaceInset: { value: Math.max(0, -(geometry.parameters.options.bevelOffset ?? 0)) },
				uReturnDivider: { value: returnDivider ? new THREE.Vector4(returnDivider[0].x, returnDivider[0].y, returnDivider[1].x, returnDivider[1].y) : new THREE.Vector4() },
			});
			shader.vertexShader = `varying vec2 vSurfacePosition;\n${shader.vertexShader}`.replace(
				'#include <begin_vertex>', '#include <begin_vertex>\nvSurfacePosition = position.xy;',
			);
			shader.fragmentShader = `${declarations}
varying vec2 vSurfacePosition;
uniform vec2 uOutline[${outline.length}];
uniform vec4 uReturnDivider;
uniform float uFaceInset;
${shader.fragmentShader}`.replace('#include <color_fragment>', `
#include <color_fragment>
${returnDivider ? `
vec2 returnDirection = normalize(uReturnDivider.zw - uReturnDivider.xy);
vec2 returnPosition = vSurfacePosition - uReturnDivider.xy;
float returnDistance = returnDirection.x * returnPosition.y - returnDirection.y * returnPosition.x;
float returnAA = max(fwidth(returnDistance), 0.0005);
float returnMask = smoothstep(-returnAA, returnAA, returnDistance);
diffuseColor.rgb = mix(diffuseColor.rgb, uReturnColor, returnMask);
` : ''}
`).replace('#include <opaque_fragment>', `
float outlineDistance = 10.0;
for (int i = 0; i < ${outline.length}; i++) {
	vec2 a = uOutline[i];
	vec2 ab = uOutline[(i + 1) % ${outline.length}] - a;
	float along = clamp(dot(vSurfacePosition - a, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
	outlineDistance = min(outlineDistance, length(vSurfacePosition - a - along * ab));
}
// Follow the visible inset edge of the front cap, including its continuation
// across the V. One distance drives shading, white core, and pink halo together.
float surfaceDistance = max(0.0, outlineDistance - uFaceInset);
${returnDivider ? `
vec2 seamDirection = normalize(uReturnDivider.zw - uReturnDivider.xy);
// Continue the inset upper edge in a straight line, rather than jumping back
// to the un-beveled outline at the notch.
vec2 seamInset = vec2(seamDirection.y, -seamDirection.x) * uFaceInset;
vec2 seamStart = uReturnDivider.xy + seamInset;
vec2 seamEnd = uReturnDivider.zw + seamInset;
vec2 seam = seamEnd - seamStart;
float seamAlong = clamp(dot(vSurfacePosition - seamStart, seam) / dot(seam, seam), 0.0, 1.0);
float seamDistance = length(vSurfacePosition - seamStart - seamAlong * seam);
surfaceDistance = min(surfaceDistance, seamDistance);
` : ''}
float shade = smoothstep(0.0, mix(0.02, 0.3, uShadowSoftness), surfaceDistance) * uShadowIntensity;
outgoingLight = mix(outgoingLight, outgoingLight * uShadowColor, shade);
// Use the same width on the full diagonal: its exterior and internal portions
// must not switch to different halo or core profiles at the joining point.
float luminousDistance = surfaceDistance * 0.5;
// Match the lateral radius in model space so entry/idle scaling and
// responsive sizing scale the luminous line with the geometry.
float edgeRadius = 0.01 * uEdgeWidth;
float edgeCore = exp(-pow(luminousDistance / edgeRadius, 2.0));
float edgeGlow = exp(-luminousDistance / uHaloWidth);
// Keep the narrow core bright after tone mapping, independently of the red halo.
outgoingLight += uEdgeColor * edgeCore * uEdgeIntensity * 3.0
	+ uHaloColor * edgeGlow * uHaloIntensity;
#include <opaque_fragment>`);
		};
		face.customProgramCacheKey = () => `wortise-material-face-v8-${outline.length}-${Boolean(returnDivider)}`;
		faces.push(face);
		apply(config);
		return face;
	}

	apply(config);
	return { sides, createFace, apply, dispose: () => [sides, ...faces].forEach((material) => material.dispose()) };
}
