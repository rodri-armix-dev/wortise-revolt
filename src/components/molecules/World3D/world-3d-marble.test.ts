import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Color } from 'three';
import { applyMarbleUniforms, createAtmosphereMaterial, createMarbleUniforms } from './world-3d-marble.ts';
import { defaultMarbleEffects, freshWorldConfig, isWorldControlVisible, marblePresets, pointsPresets, savedWorldPreset, parseWorldConfig, serializeWorldConfig, validateWorldConfig } from './world-3d-config.ts';

test('earlier previews retain their camera and receive neutral effects', () => {
	const previous: Record<string, unknown> = { ...freshWorldConfig(), zoom: 1.4, lockRotationZ: true };
	for (const key of Object.keys(defaultMarbleEffects)) delete previous[key];
	const migrated = validateWorldConfig(previous);
	assert.equal(migrated.zoom, 1.4);
	assert.equal(migrated.lockRotationZ, true);
	for (const [key, value] of Object.entries(defaultMarbleEffects)) assert.equal(migrated[key as keyof typeof migrated], value);
});

test('every preset round-trips, preserves framing and reaches the material uniforms', () => {
	const original = { ...freshWorldConfig(), pitch: -50, zoom: 1.3, lockRotationX: true };
	const uniforms = createMarbleUniforms(original);
	for (const preset of marblePresets) {
		const config = parseWorldConfig(serializeWorldConfig({ ...original, ...preset.values }));
		assert.equal(config.zoom, original.zoom);
		assert.equal(config.pitch, original.pitch);
		assert.equal(config.lockRotationX, true);
		applyMarbleUniforms(uniforms, config);
		assert.equal(uniforms.uDuotone.value, config.duotoneAmount);
		assert.equal(uniforms.uGlowStrength.value, config.glowStrength);
		assert.equal(uniforms.uGamma.value, config.textureGamma);
		assert.equal(uniforms.uLightIntensity.value, config.lightIntensity);
		assert.ok(uniforms.uTint.value.equals(new Color(config.tintColor)));
		const atmosphere = createAtmosphereMaterial(config);
		assert.equal(atmosphere.depthWrite, false);
		assert.equal(atmosphere.uniforms.uStrength.value, config.atmosphereStrength);
		atmosphere.dispose();
	}
});

test('image effects are Marble-only, atmosphere is shared, and unsafe values are rejected', () => {
	for (const key of Object.keys(defaultMarbleEffects)) {
		assert.equal(isWorldControlVisible(key as keyof typeof defaultMarbleEffects, 'points'), key.startsWith('atmosphere'));
		assert.equal(isWorldControlVisible(key as keyof typeof defaultMarbleEffects, 'blackmarble'), true);
	}
	for (const values of [{ textureGamma: 0 }, { glowStrength: Infinity }, { tintColor: 'red' }, { atmosphereWidth: -1 }, { preserveLights: 'true' }]) {
		assert.throws(() => validateWorldConfig({ ...freshWorldConfig(), ...values }));
	}
});

test('saved preset restores framing and atmosphere glow is independently adjustable', () => {
	const config = validateWorldConfig(savedWorldPreset.values);
	assert.equal(config.zoom, 1.33);
	assert.equal(config.pitch, -91.99414579674296);
	assert.equal(config.textureExposure, 2.75);
	const glow = createAtmosphereMaterial(config, true);
	assert.equal(glow.uniforms.uSoft.value, true);
	assert.equal(glow.uniforms.uStrength.value, config.atmosphereStrength * config.atmosphereGlow);
	assert.ok(glow.uniforms.uInnerRadius.value < 1);
	glow.dispose();
});

test('published defaults use the approved framing and atmosphere', () => {
	const config = validateWorldConfig(freshWorldConfig());
	assert.equal(config.zoom, 1.33);
	assert.equal(config.pitch, -83.1410711489421);
	assert.equal(config.yaw, 58.3816);
	assert.equal(config.roll, 0);
	assert.equal(config.atmosphereStrength, 0.75);
	assert.equal(config.atmosphereWidth, 0.0001);
	assert.equal(config.atmosphereGlow, 1.25);
	assert.equal(config.atmosphereGlowWidth, 0.063);
});

test('luminous points preset preserves camera and supports earlier exports', () => {
	const previous: Record<string, unknown> = { ...freshWorldConfig(), zoom: 1.6 };
	delete previous.dotIntensity;
	delete previous.dotGlow;
	const migrated = validateWorldConfig(previous);
	assert.equal(migrated.dotIntensity, 1);
	assert.equal(migrated.dotGlow, 0);
	const config = validateWorldConfig({ ...migrated, ...pointsPresets[0].values });
	assert.equal(config.surface, 'points');
	assert.equal(config.zoom, 1.6);
	assert.equal(config.dotHighlight, '#f4f3ef');
	assert.ok(config.dotIntensity > 1);
	assert.ok(config.dotGlow > 0);
	for (const key of ['dotIntensity', 'dotGlow'] as const) {
		assert.equal(isWorldControlVisible(key, 'points'), true);
		assert.equal(isWorldControlVisible(key, 'blackmarble'), false);
	}
});
