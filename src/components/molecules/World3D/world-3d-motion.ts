import { Quaternion, Vector2, Vector3 } from 'three';

const damping = 4.5;
const stopSpeed = 0.015;
const focusDuration = 1.1;

export function createWorldMotion(rotation: Quaternion) {
	const velocity = new Vector2();
	const axis = new Vector3();
	const step = new Quaternion();
	let lastMove = 0;
	let coasting = false;
	let focus: { from: Quaternion; to: Quaternion; elapsed: number } | undefined;
	const active = () => coasting || Boolean(focus);
	const cancel = () => { coasting = false; focus = undefined; velocity.set(0, 0); };
	return {
		active,
		cancel,
		begin(time: number) { cancel(); lastMove = time; },
		drag(horizontal: number, vertical: number, time: number) {
			const seconds = Math.max((time - lastMove) / 1000, 0.008);
			const weight = 1 - Math.exp(-seconds * 25);
			velocity.lerp(new Vector2(vertical / seconds, horizontal / seconds).clampLength(0, 3), weight);
			lastMove = time;
		},
		release(time: number, allowed: boolean) {
			// Holding still before release must not restart an old flick.
			velocity.multiplyScalar(Math.exp(-Math.max(0, time - lastMove) / 1000 * 25));
			coasting = allowed && velocity.length() > stopSpeed;
			if (!coasting) velocity.set(0, 0);
		},
		focus(target: Quaternion, reduced: boolean) {
			cancel();
			if (reduced) rotation.copy(target);
			else focus = { from: rotation.clone(), to: target.clone(), elapsed: 0 };
		},
		update(seconds: number, reduced: boolean) {
			if (reduced) {
				if (focus) rotation.copy(focus.to);
				cancel();
				return;
			}
			if (focus) {
				focus.elapsed += seconds;
				const t = Math.min(1, focus.elapsed / focusDuration);
				// Slerp takes the shortest route and avoids Euler-angle discontinuities.
				const eased = t * t * t * (t * (t * 6 - 15) + 10);
				rotation.slerpQuaternions(focus.from, focus.to, eased);
				if (t === 1) focus = undefined;
			} else if (coasting) {
				const decay = Math.exp(-damping * seconds);
				const speed = velocity.length();
				axis.set(velocity.x, velocity.y, 0).normalize();
				step.setFromAxisAngle(axis, speed * (1 - decay) / damping);
				rotation.premultiply(step).normalize();
				velocity.multiplyScalar(decay);
				if (velocity.length() <= stopSpeed) cancel();
			}
		},
	};
}
