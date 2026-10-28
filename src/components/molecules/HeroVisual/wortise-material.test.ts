import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import {
	copyMaterialJson, freshMaterial, materialControls, loadMaterial, saveMaterial, serializeMaterial, parseMaterialJson, validateMaterial,
} from './wortise-material.ts';
import { createMaterialRenderer } from './wortise-material-renderer.ts';
import { createWortiseMarkGeometry } from './wortise-mark-geometry.ts';

test('complete JSON round-trips, includes inactive fields, and normalizes sRGB hex', () => {
	const config = freshMaterial();
	config.color.frente = '#AA0033';
	config.transparencia.transmision = 0.72;
	config.reflexion.metalizado = 0.4;
	const restored = parseMaterialJson(serializeMaterial(config));
	assert.equal(restored.color.frente, '#aa0033');
	assert.equal(restored.transparencia.transmision, 0.72);
	assert.equal(restored.reflexion.metalizado, 0.4);
	assert.deepEqual(parseMaterialJson(serializeMaterial(restored)), restored);
	assert.equal(freshMaterial().color.frente, '#d10e4e');
});

test('every numeric control accepts its limits and rejects invalid values atomically', () => {
	const original = freshMaterial();
	for (const group of materialControls) for (const field of group.fields) {
		if (field.kind !== 'number') continue;
		for (const value of [field.min, field.max]) {
			const candidate = structuredClone(original);
			(candidate[group.key] as Record<string, number | string>)[field.key] = value;
			assert.doesNotThrow(() => validateMaterial(candidate));
		}
		for (const value of [field.min - 1, field.max + 1, NaN, Infinity, '0.5', null]) {
			const candidate = structuredClone(original);
			(candidate[group.key] as Record<string, unknown>)[field.key] = value;
			assert.throws(() => validateMaterial(candidate), new RegExp(`${group.key}.${field.key}`));
		}
	}
	assert.deepEqual(original, freshMaterial());
});

test('rejects incomplete, unknown, malformed, or incompatible configurations', () => {
	for (const input of ['{', 'null', '[]', '{}']) assert.throws(() => parseMaterialJson(input));
	assert.throws(() => validateMaterial({ ...freshMaterial(), version: 2 }), /version/);
	assert.throws(() => validateMaterial({ ...freshMaterial(), extra: true }), /extra/);
	const badColor = freshMaterial();
	badColor.color.frente = 'red';
	assert.throws(() => validateMaterial(badColor), /color.frente/);
	assert.throws(() => validateMaterial({ ...freshMaterial(), sombras: { color: '#000000', intensidad: 0.5 } }), /sombras.suavidad/);
	assert.throws(() => validateMaterial({ ...freshMaterial(), transparencia: { ...freshMaterial().transparencia, modo: 'metal' } }), /transparencia.modo/);
	assert.throws(() => parseMaterialJson(serializeMaterial(freshMaterial()).replace('"version": 1', '"__proto__": {}, "version": 1')), /__proto__/);
});

test('storage restores settings and handles malformed or inaccessible storage', () => {
	let saved = '';
	const storage = { getItem: () => saved || null, setItem: (_key: string, value: string) => { saved = value; } };
	const config = freshMaterial();
	config.transparencia.modo = 'vidrio';
	assert.equal(saveMaterial(storage, config), undefined);
	assert.deepEqual(loadMaterial(storage).config, config);
	saved = '{';
	assert.deepEqual(loadMaterial(storage).config, freshMaterial());
	assert.ok(loadMaterial(storage).message);
	assert.ok(loadMaterial({ getItem: () => { throw new Error('denied'); } }).message);
	assert.ok(saveMaterial({ setItem: () => { throw new Error('denied'); } }, config));
});

test('material conversion uses linear colors, real thickness, and keeps metal when leaving glass', () => {
	const controller = createMaterialRenderer(THREE);
	const solids = createWortiseMarkGeometry(THREE);
	const face = controller.createFace(solids[0].outline, solids[0].geometry);
	const config = freshMaterial();
	config.color.frente = '#aa2244';
	config.reflexion.metalizado = 0.6;
	controller.apply(config);
	assert.ok(Math.abs(face.color.r - new THREE.Color('#aa2244').r) < 1e-10);
	assert.equal(face.metalness, 0.6);
	for (const property of ['metalness', 'roughness', 'clearcoat', 'clearcoatRoughness', 'envMapIntensity'] as const) {
		assert.equal(controller.sides[property], face[property], `${property} matches across front and sides`);
	}
	assert.equal(controller.sides.color.getHexString(), config.color.laterales.slice(1));
	config.transparencia.modo = 'vidrio';
	controller.apply(config);
	assert.equal(face.metalness, 0);
	assert.equal(controller.sides.metalness, 0);
	assert.equal(face.transmission, config.transparencia.transmision);
	assert.equal(face.opacity, 1);
	assert.equal(face.transparent, false);
	assert.ok(Math.abs(face.thickness - 0.65) < 1e-6);
	assert.equal(face.attenuationColor.getHexString(), 'aa2244');
	config.transparencia.modo = 'solido';
	controller.apply(config);
	assert.equal(face.metalness, 0.6);
	assert.equal(face.transmission, 0);
	controller.dispose();
	solids.forEach(({ geometry }) => geometry.dispose());
});

test('clipboard export is complete and reports rejection for manual-copy fallback', async () => {
	let text = '';
	assert.equal(await copyMaterialJson(freshMaterial(), async (value) => { text = value; }), true);
	assert.deepEqual(parseMaterialJson(text), freshMaterial());
	assert.equal(await copyMaterialJson(freshMaterial(), async () => { throw new Error('clipboard denied'); }), false);
});

test('older v1 JSON gains border width without losing custom settings', () => {
	const original = freshMaterial();
	original.reflexion.metalizado = 0.29;
	original.reflexion.anchoHalo = 0.0335;
	const legacy = JSON.parse(serializeMaterial(original));
	delete legacy.reflexion.anchoBorde;
	assert.deepEqual(parseMaterialJson(JSON.stringify(legacy)), original);
	const saved = loadMaterial({ getItem: () => JSON.stringify(legacy) });
	assert.equal(saved.message, undefined);
	assert.deepEqual(saved.config, original);
	assert.equal(JSON.parse(serializeMaterial(saved.config)).reflexion.anchoBorde, 0.25);
});
