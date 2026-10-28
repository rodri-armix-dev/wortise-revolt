import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createMotionPreview, defaultMotion, sampleMotionPreview, entranceDuration, entrancePreviews, idlePreviews } from './wortise-motion-preview.ts';

test('entrances end at the selected idle without altering opacity or scale permanently', () => {
	for (const [entrance] of entrancePreviews) {
		for (const [idle] of idlePreviews) {
			assert.equal(sampleMotionPreview(entrance, idle, 0, 0).opacity, 0);
			const end = entranceDuration(entrance);
			assert.deepEqual(sampleMotionPreview(entrance, idle, end, end), sampleMotionPreview(undefined, idle, end, end));
			for (let t = 0; t <= 3; t += 0.05) {
				const pose = sampleMotionPreview(entrance, idle, t, t);
				assert.ok(Object.values(pose).every(Number.isFinite));
				assert.ok(pose.opacity >= 0 && pose.opacity <= 1);
				assert.ok(pose.scale > 0);
			}
		}
	}
});

test('replaying replaces the current entrance and pause resets to the rest pose', () => {
	const preview = createMotionPreview();
	preview.idle('none');
	preview.enter('turn');
	const start = preview.sample(0);
	preview.sample(0.6);
	preview.enter('turn');
	assert.deepEqual(preview.sample(0), start);
	preview.reset();
	assert.deepEqual(preview.sample(0), { yaw: 0, pitch: 0, roll: 0, y: 0, scale: 1, opacity: 1 });
	preview.enter('rise');
	preview.idle('none');
	assert.equal(preview.sample(0).opacity, 1);
});

test('full rotations travel through a complete turn and continuous idles do not wrap', () => {
	for (const [entrance] of entrancePreviews) {
		if (!entrance.startsWith('spin-')) continue;
		const axis = entrance === 'spin-x' ? 'pitch' : entrance === 'spin-z' ? 'roll' : 'yaw';
		const initial = sampleMotionPreview(entrance, 'none', 0, 0)[axis];
		assert.equal(Math.abs(initial), Math.PI * 2);
		assert.equal(sampleMotionPreview(entrance, 'none', 2.4, 2.4)[axis], 0);
		assert.ok(Math.abs(sampleMotionPreview(entrance, 'none', 1.2, 1.2)[axis]) > 3);
	}
	for (const [idle] of idlePreviews) {
		if (!idle.startsWith('rotate-')) continue;
		const axis = idle === 'rotate-x' ? 'pitch' : idle === 'rotate-z' ? 'roll' : 'yaw';
		assert.equal(Math.abs(sampleMotionPreview(undefined, idle, 8, 8)[axis]), Math.PI * 2);
		const before = sampleMotionPreview(undefined, idle, 7.999, 7.999)[axis];
		const after = sampleMotionPreview(undefined, idle, 8.001, 8.001)[axis];
		assert.ok(Math.abs(after - before) < 0.01);
	}
});


test('zoom spin starts small, turns quickly, overshoots gently and settles', () => {
	const start = sampleMotionPreview('zoom-spin', 'none', 0, 0);
	assert.equal(start.scale, 0.12);
	assert.equal(start.yaw, -2 * Math.PI);
	const fast = sampleMotionPreview('zoom-spin', 'none', 0.75, 0.75);
	assert.ok(Math.abs(fast.yaw) < Math.PI / 3, 'most of the turn is complete in 750ms');
	const overshoot = sampleMotionPreview('zoom-spin', 'none', 1.2, 1.2);
	assert.ok(overshoot.yaw > 0 && overshoot.yaw < 0.2);
	assert.ok(overshoot.scale > 1 && overshoot.scale < 1.06);
	assert.deepEqual(sampleMotionPreview('zoom-spin', 'none', 1.5, 1.5), { yaw: 0, pitch: 0, roll: 0, y: 0, scale: 1, opacity: 1 });
	const preview = createMotionPreview();
	preview.idle('none');
	preview.enter('zoom-spin');
	preview.sample(0.8);
	preview.enter('zoom-spin');
	assert.deepEqual(preview.sample(0), start);
});

test('the published sequence starts small with a full turn, then continues with 1.1 sway', () => {
	const controller = createMotionPreview(defaultMotion);
	const start = controller.sample(0);
	assert.equal(start.scale, 0.12);
	assert.equal(start.opacity, 0);
	assert.equal(start.yaw, -2 * Math.PI);
	const after = controller.sample(1.5);
	assert.deepEqual(after, sampleMotionPreview(undefined, 'sway', 1.5, 1.5, 1.1));
	const base = sampleMotionPreview(undefined, 'sway', 2, 2, 1);
	const stronger = sampleMotionPreview(undefined, 'sway', 2, 2, 1.1);
	for (const axis of ['yaw', 'pitch', 'roll'] as const) {
		assert.ok(Math.abs(stronger[axis] - base[axis] * 1.1) < 1e-10);
	}
});
