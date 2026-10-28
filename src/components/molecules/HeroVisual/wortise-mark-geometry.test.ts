import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three';
import { createWortiseMarkGeometry } from './wortise-mark-geometry.ts';

test('the slash and continuous V have common front and back planes', () => {
	const solids = createWortiseMarkGeometry(THREE);
	try {
		assert.equal(solids.length, 2);
		assert.deepEqual(solids.map(({ outline }) => outline.length), [4, 6]);
		const bounds = solids.map(({ geometry }) => {
			geometry.computeBoundingBox();
			return [geometry.boundingBox!.min.z, geometry.boundingBox!.max.z];
		});
		assert.deepEqual(bounds[0], bounds[1]);
		assert.ok(bounds[0][0] < 0 && bounds[0][1] > 0);
	} finally {
		solids.forEach(({ geometry }) => geometry.dispose());
	}
});

test('each solid is closed, consistently wound, and has no degenerate triangles', () => {
	const solids = createWortiseMarkGeometry(THREE);
	try {
		for (const { geometry } of solids) {
			const positions = geometry.getAttribute('position');
			const edges = new Map<string, { count: number; winding: number }>();
			const vertex = (index: number) => new THREE.Vector3().fromBufferAttribute(positions, index);
			// Extrusion duplicates vertices at material and normal boundaries. Weld for topology checks.
			const key = (index: number) => vertex(index).toArray().map((value) => Math.round(value * 1e5)).join(',');
			let volume = 0;
			for (let index = 0; index < positions.count; index += 3) {
				const [a, b, c] = [vertex(index), vertex(index + 1), vertex(index + 2)];
				assert.ok([...a.toArray(), ...b.toArray(), ...c.toArray()].every(Number.isFinite));
				assert.ok(b.clone().sub(a).cross(c.clone().sub(a)).length() > 1e-9);
				volume += a.dot(b.clone().cross(c)) / 6;
				for (let edge = 0; edge < 3; edge++) {
					const from = key(index + edge);
					const to = key(index + (edge + 1) % 3);
					const id = [from, to].sort().join('|');
					const entry = edges.get(id) ?? { count: 0, winding: 0 };
					entry.count++;
					entry.winding += from < to ? 1 : -1;
					edges.set(id, entry);
				}
			}
			assert.ok(volume > 0, 'outward winding encloses positive volume');
			assert.ok([...edges.values()].every(({ count, winding }) => count === 2 && winding === 0), 'every welded edge has two oppositely directed incident faces');
		}
	} finally {
		solids.forEach(({ geometry }) => geometry.dispose());
	}
});

test('the central bar continues from the inner notch to the outer edge of the V', () => {
	const solids = createWortiseMarkGeometry(THREE);
	try {
		assert.equal(solids[0].returnDivider, undefined);
		const { outline, returnDivider } = solids[1];
		assert.ok(returnDivider);
		const [start, end] = returnDivider;
		assert.ok(start.distanceTo(outline[2]) < 1e-8);
		const diagonal = outline[2].clone().sub(outline[1]);
		assert.ok(Math.abs(end.clone().sub(start).cross(diagonal)) < 1e-8);
		const outerEdge = outline[5].clone().sub(outline[4]);
		assert.ok(Math.abs(end.clone().sub(outline[4]).cross(outerEdge)) < 1e-8);
		const along = end.clone().sub(outline[4]).dot(outerEdge) / outerEdge.lengthSq();
		assert.ok(along > 0 && along < 1);
		const centralPoint = outline[0].clone().lerp(outline[5], 0.5);
		const returnPoint = outline[3].clone().lerp(outline[4], 0.5);
		assert.ok(diagonal.cross(centralPoint.clone().sub(start)) < 0);
		assert.ok(diagonal.cross(returnPoint.clone().sub(start)) > 0);
	} finally {
		solids.forEach(({ geometry }) => geometry.dispose());
	}
});
