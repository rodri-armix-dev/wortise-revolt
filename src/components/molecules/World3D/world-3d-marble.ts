import * as THREE from 'three';
import type { WorldConfig } from './world-3d-config';

export function createMarbleUniforms(config: WorldConfig) {
	return {
		uExposure: { value: config.textureExposure }, uContrast: { value: config.textureContrast },
		uSaturation: { value: config.textureSaturation }, uGamma: { value: config.textureGamma },
		uTint: { value: new THREE.Color(config.tintColor) }, uTintAmount: { value: config.tintAmount },
		uPreserveLights: { value: config.preserveLights }, uShadow: { value: new THREE.Color(config.duotoneShadows) },
		uHighlight: { value: new THREE.Color(config.duotoneHighlights) }, uDuotone: { value: config.duotoneAmount },
		uLightIntensity: { value: config.lightIntensity }, uLightThreshold: { value: config.lightThreshold },
		uGlowStrength: { value: config.glowStrength }, uGlowRadius: { value: config.glowRadius },
		uTexel: { value: new THREE.Vector2(1 / 8192, 1 / 4096) },
	};
}

export function applyMarbleUniforms(uniforms: ReturnType<typeof createMarbleUniforms>, config: WorldConfig) {
	uniforms.uExposure.value = config.textureExposure;
	uniforms.uContrast.value = config.textureContrast;
	uniforms.uSaturation.value = config.textureSaturation;
	uniforms.uGamma.value = config.textureGamma;
	uniforms.uTint.value.set(config.tintColor);
	uniforms.uTintAmount.value = config.tintAmount;
	uniforms.uPreserveLights.value = config.preserveLights;
	uniforms.uShadow.value.set(config.duotoneShadows);
	uniforms.uHighlight.value.set(config.duotoneHighlights);
	uniforms.uDuotone.value = config.duotoneAmount;
	uniforms.uLightIntensity.value = config.lightIntensity;
	uniforms.uLightThreshold.value = config.lightThreshold;
	uniforms.uGlowStrength.value = config.glowStrength;
	uniforms.uGlowRadius.value = config.glowRadius;
}

export const marbleShader = `
uniform float uExposure;
uniform float uContrast;
uniform float uSaturation;
uniform float uGamma;
uniform vec3 uTint;
uniform float uTintAmount;
uniform bool uPreserveLights;
uniform vec3 uShadow;
uniform vec3 uHighlight;
uniform float uDuotone;
uniform float uLightIntensity;
uniform float uLightThreshold;
uniform float uGlowStrength;
uniform float uGlowRadius;
uniform vec2 uTexel;

float marbleLuminance(vec3 color) { return dot(color, vec3(0.2126, 0.7152, 0.0722)); }

vec3 gradeMarble(vec3 original) {
	float lightMask = smoothstep(uLightThreshold, min(1.0, uLightThreshold + 0.2), marbleLuminance(original));
	vec3 color = original * exp2(uExposure) * uBrightness;
	color = mix(vec3(marbleLuminance(color)), color, uSaturation);
	// Contrast in display-like space keeps dark terrain useful at moderate values.
	color = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));
	color = max((color - 0.5) * uContrast + 0.5, vec3(0.0));
	color = pow(color, vec3(2.2 / uGamma));
	float tone = clamp(pow(max(marbleLuminance(color), 0.0), 0.5), 0.0, 1.0);
	color = mix(color, mix(uShadow, uHighlight, tone), uDuotone);
	vec3 tinted = uTint * marbleLuminance(color) / max(marbleLuminance(uTint), 0.05);
	float tintWeight = uTintAmount * (uPreserveLights ? 1.0 - lightMask : 1.0);
	color = mix(color, tinted, tintWeight);
	return max(color * mix(1.0, uLightIntensity, lightMask), vec3(0.0));
}

vec3 glowSample(vec2 uv) {
	// Horizontal wrap preserves the date-line seam; vertical clamp prevents pole wrap.
	vec3 sampleColor = texture2D(uMap, vec2(fract(uv.x), clamp(uv.y, 0.0, 1.0))).rgb;
	float mask = smoothstep(uLightThreshold, min(1.0, uLightThreshold + 0.2), marbleLuminance(sampleColor));
	return gradeMarble(sampleColor) * mask;
}

vec3 renderMarble(vec2 uv) {
	vec3 color = gradeMarble(texture2D(uMap, uv).rgb);
	if (uGlowStrength > 0.0) {
		vec2 radius = uTexel * uGlowRadius;
		// Compensate longitude convergence near the poles, with a bounded footprint.
		radius.x /= max(cos((uv.y - 0.5) * 3.14159265359), 0.2);
		vec3 glow = glowSample(uv + vec2(radius.x, 0.0)) + glowSample(uv - vec2(radius.x, 0.0));
		glow += glowSample(uv + vec2(0.0, radius.y)) + glowSample(uv - vec2(0.0, radius.y));
		glow += glowSample(uv + radius * 0.7071) + glowSample(uv - radius * 0.7071);
		glow += glowSample(uv + vec2(radius.x, -radius.y) * 0.7071) + glowSample(uv + vec2(-radius.x, radius.y) * 0.7071);
		color += glow * (uGlowStrength / 8.0);
	}
	return color;
}
`;

export function createAtmosphereMaterial(config: WorldConfig, glow = false) {
	return new THREE.ShaderMaterial({
		transparent: true, depthWrite: false, side: THREE.BackSide,
		uniforms: { uColor: { value: new THREE.Color(config.atmosphereColor) }, uStrength: { value: config.atmosphereStrength * (glow ? config.atmosphereGlow : 1) }, uSoft: { value: glow }, uInnerRadius: { value: 0.997 / (0.997 + config.atmosphereWidth + config.atmosphereGlowWidth) }, uOpacity: { value: config.oceanOpacity } },
		vertexShader: `
			varying vec3 vNormal;
			void main() {
				vNormal = normalize(normalMatrix * normal);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform vec3 uColor;
			uniform float uStrength;
			uniform float uOpacity;
			uniform bool uSoft;
			uniform float uInnerRadius;
			varying vec3 vNormal;
			void main() {
				float rim = pow(1.0 - abs(normalize(vNormal).z), 3.0);
				float radius = sqrt(max(0.0, 1.0 - pow(normalize(vNormal).z, 2.0)));
				float fade = uSoft ? 1.0 - smoothstep(uInnerRadius, 1.0, radius) : 1.0;
				gl_FragColor = vec4(uColor, clamp(rim * fade * uStrength * uOpacity, 0.0, 1.0));
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
			}
		`,
	});
}
