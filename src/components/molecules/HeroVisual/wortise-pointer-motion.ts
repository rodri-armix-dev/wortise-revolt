interface Rotation {
	yaw: number;
	pitch: number;
	roll: number;
}

const nearestAngle = (target: number, current: number) => current + Math.atan2(Math.sin(target - current), Math.cos(target - current));

export function createPointerMotion() {
	let mode: 'idle' | 'spin' | 'follow' | 'return' = 'idle';
	let rotation: Rotation = { yaw: 0, pitch: 0, roll: 0 };
	let start: Rotation = { ...rotation };
	let elapsed = 0;
	let followAfterSpin = true;
	return {
		enter(current: Rotation) {
			if (mode === 'spin' || mode === 'follow') return;
			rotation = { ...current };
			mode = 'follow';
		},
		spin(current: Rotation, follow = true) {
			if (mode === 'spin') return;
			rotation = { ...current };
			start = { ...current };
			followAfterSpin = follow;
			elapsed = 0;
			mode = 'spin';
		},
		leave() {
			if (mode !== 'idle') mode = 'return';
		},
		reset() { mode = 'idle'; elapsed = 0; },
		sample(delta: number, idle: Rotation, x: number, y: number): Rotation | undefined {
			if (mode === 'idle') return undefined;
			const damping = 1 - Math.exp(-Math.max(0, delta) * 9);
			if (mode === 'spin') {
				elapsed += Math.max(0, delta);
				const t = Math.min(1, elapsed / 1.05);
				const eased = t === 0 ? 0 : t === 1 ? 1 : 1 + 1.65 * (t - 1) ** 3 + 0.65 * (t - 1) ** 2;
				rotation = {
					yaw: start.yaw + Math.PI * 2 * eased,
					pitch: start.pitch * (1 - t),
					roll: start.roll * (1 - t),
				};
				if (t === 1) mode = followAfterSpin ? 'follow' : 'return';
			} else {
				const target = mode === 'follow' ? { yaw: Math.max(-1, Math.min(1, x)) * 0.32, pitch: Math.max(-1, Math.min(1, y)) * 0.22, roll: 0 } : idle;
				let error = 0;
				for (const axis of ['yaw', 'pitch', 'roll'] as const) {
					const angle = nearestAngle(target[axis], rotation[axis]);
					rotation[axis] += (angle - rotation[axis]) * damping;
					error += Math.abs(angle - rotation[axis]);
				}
				if (mode === 'return' && error < 0.001) mode = 'idle';
			}
			return { ...rotation };
		},
	};
}
