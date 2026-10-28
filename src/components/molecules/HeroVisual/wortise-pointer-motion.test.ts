import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPointerMotion } from './wortise-pointer-motion.ts';
const rest = { yaw: 0, pitch: 0, roll: 0 };
const angleError = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

test('click turns a full circle once, then smoothly follows the current pointer', () => {
	const motion = createPointerMotion();
	motion.spin(rest);
	assert.deepEqual(motion.sample(0, rest, 1, 1), rest);
	motion.sample(0.5, rest, 1, 1);
	motion.spin(rest); // repeated clicks must not restart an active spin
	const end = motion.sample(0.55, rest, 1, 1)!;
	assert.equal(end.yaw, Math.PI * 2);
	for (let i = 0; i < 150; i++) motion.sample(1 / 60, rest, -1, 1);
	const following = motion.sample(1 / 60, rest, -1, 1)!;
	assert.ok(angleError(following.yaw, -0.32) < 0.001);
	assert.ok(Math.abs(following.pitch - 0.22) < 0.001);
});

test('leaving mid-spin cancels the turn and blends to idle without a jump', () => {
	const motion = createPointerMotion();
	motion.spin(rest);
	const spinning = motion.sample(0.4, rest, 0, 0)!;
	motion.leave();
	assert.deepEqual(motion.sample(0, rest, 0, 0), spinning);
	for (let i = 0; i < 160; i++) motion.sample(1 / 60, rest, 0, 0);
	assert.equal(motion.sample(0, rest, 0, 0), undefined);
	motion.spin(rest);
	assert.equal(motion.sample(1.05, rest, 0, 0)!.yaw, Math.PI * 2);
	motion.reset();
	assert.equal(motion.sample(0, rest, 0, 0), undefined);
});

test('entering follows the cursor without a 360 turn', () => {
	const motion = createPointerMotion();
	motion.enter(rest);
	for (let i = 0; i < 120; i++) {
		const pose = motion.sample(1 / 60, rest, 1, -1)!;
		assert.ok(Math.abs(pose.yaw) <= 0.32);
		assert.ok(Math.abs(pose.pitch) <= 0.22);
	}
	const pose = motion.sample(1 / 60, rest, 1, -1)!;
	assert.ok(Math.abs(pose.yaw - 0.32) < 0.001);
	assert.ok(Math.abs(pose.pitch + 0.22) < 0.001);
});


test('touch tap completes a full spin and returns to idle without following coordinates', () => {
	const motion = createPointerMotion();
	motion.spin(rest, false);
	assert.equal(motion.sample(1.05, rest, 1, -1)!.yaw, Math.PI * 2);
	for (let i = 0; i < 160; i++) motion.sample(1 / 60, rest, 1, -1);
	assert.equal(motion.sample(0, rest, 1, -1), undefined);
});
