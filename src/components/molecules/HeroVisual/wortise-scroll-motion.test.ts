import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createScrollMotion } from './wortise-scroll-motion.ts';

test('scroll sustains vertical rotation at half the previous speed', () => {
	const motion = createScrollMotion(0, 0);
	let angle = 0;
	for (let i = 1; i <= 360; i++) {
		motion.update(i * 2, i * 1000 / 60);
		angle = motion.sample(1 / 60);
	}
	assert.ok(angle > Math.PI * 2 && angle < Math.PI * 3);
	const before = angle;
	motion.update(719, 6100);
	for (let i = 0; i < 5; i++) motion.sample(1 / 60);
	const reversed = motion.sample(1 / 60);
	motion.update(718, 6200);
	for (let i = 0; i < 5; i++) motion.sample(1 / 60);
	assert.ok(motion.sample(1 / 60) < reversed);
	assert.ok(Number.isFinite(before));
});

test('rotation brakes and returns to the original orientation after scroll stops', () => {
	const motion = createScrollMotion(0, 0);
	motion.update(30, 50);
	for (let i = 0; i < 360; i++) motion.sample(1 / 60);
	const stopped = motion.sample(1 / 60);
	assert.equal(motion.sample(1 / 60), stopped);
	assert.equal(stopped, 0);
	motion.reset(30, 5000);
	assert.equal(motion.sample(1 / 60), 0);
});

test('holding touch sustains rotation, dragging changes direction, release brakes', () => {
	const motion = createScrollMotion();
	motion.startTouch(100);
	let angle = 0;
	for (let i = 0; i < 300; i++) angle = motion.sample(1 / 60);
	assert.ok(angle > Math.PI * 2 && angle < Math.PI * 3);
	motion.moveTouch(200);
	for (let i = 0; i < 60; i++) motion.sample(1 / 60);
	const reversed = motion.sample(1 / 60);
	assert.ok(motion.sample(1 / 60) < reversed);
	motion.endTouch();
	for (let i = 0; i < 360; i++) motion.sample(1 / 60);
	const stopped = motion.sample(1 / 60);
	assert.equal(motion.sample(1 / 60), stopped);
	assert.ok(Math.abs(Math.sin(stopped / 2)) < 1e-10);
	motion.startTouch(0);
	motion.reset(0, 1000);
	assert.equal(motion.sample(0.016), 0);
});

test('resuming scroll during the return continues without snapping to rest', () => {
	const motion = createScrollMotion();
	motion.update(50, 50);
	for (let i = 0; i < 35; i++) motion.sample(1 / 60);
	const before = motion.sample(0);
	motion.update(100, 650);
	assert.equal(motion.sample(0), before);
	assert.ok(Math.abs(motion.sample(1 / 60) - before) < 0.1);
	let resumed = before;
	for (let i = 1; i <= 30; i++) {
		motion.update(100 + i * 2, 650 + i * 1000 / 60);
		resumed = motion.sample(1 / 60);
	}
	assert.ok(resumed > before);
	for (let i = 0; i < 360; i++) motion.sample(1 / 60);
	assert.ok(Math.abs(Math.sin(motion.sample(0) / 2)) < 1e-10);
});

test('releasing touch preserves angular velocity while the return smoothly brakes it', () => {
	const motion = createScrollMotion();
	motion.startTouch(0);
	let previous = 0;
	let angle = 0;
	for (let i = 0; i < 50; i++) { previous = angle; angle = motion.sample(1 / 60); }
	const beforeSpeed = (angle - previous) * 60;
	motion.endTouch();
	assert.equal(motion.sample(0), angle);
	const next = motion.sample(1 / 60);
	const afterSpeed = (next - angle) * 60;
	assert.ok(afterSpeed > 0, 'release must not instantly reverse rotation');
	assert.ok(Math.abs(afterSpeed - beforeSpeed) < 1, 'no sudden acceleration at the transition');
	for (let i = 0; i < 360; i++) motion.sample(1 / 60);
	assert.ok(Math.abs(Math.sin(motion.sample(0) / 2)) < 1e-10);
});
