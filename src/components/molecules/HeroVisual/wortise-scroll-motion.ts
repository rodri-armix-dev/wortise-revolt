// Sustain X-axis rotation while scroll events arrive or a touch is held.
// Releasing input brakes, then restores the original orientation by the shortest turn.
export function createScrollMotion(position = 0, _time = 0) {
	let previousPosition = position;
	let direction = 1;
	let angle = 0;
	let speed = 0;
	let activityRemaining = 0;
	let touching = false;
	let touchY = 0;
	let returnAngle: number | undefined;
	return {
		update(nextPosition: number, _nextTime: number) {
			const movement = nextPosition - previousPosition;
			previousPosition = nextPosition;
			if (movement === 0) return false;
			direction = Math.sign(movement);
			activityRemaining = 0.16;
			returnAngle = undefined;
			return true;
		},
		startTouch(y: number) { touching = true; touchY = y; returnAngle = undefined; },
		moveTouch(y: number) {
			if (!touching) return;
			const movement = touchY - y;
			if (Math.abs(movement) < 2) return;
			direction = Math.sign(movement);
			touchY = y;
		},
		endTouch() { touching = false; },
		reset(nextPosition: number, _nextTime: number) {
			previousPosition = nextPosition;
			direction = 1;
			angle = speed = activityRemaining = 0;
			touching = false;
			returnAngle = undefined;
		},
		sample(delta: number) {
			const dt = Math.max(0, Math.min(0.05, delta));
			const active = touching || activityRemaining > 0;
			if (active) {
				const previousSpeed = speed;
				speed += (direction * Math.PI * 0.5 - speed) * (1 - Math.exp(-dt * 8));
				angle += (previousSpeed + speed) * 0.5 * dt;
			} else {
				const frequency = 3.8;
				// Carry the current angular velocity into a critically damped return.
				// Unlike switching to an angle lerp after braking, this has no velocity jump.
				returnAngle ??= Math.round((angle + speed * 0.12) / (Math.PI * 2)) * Math.PI * 2;
				const error = angle - returnAngle;
				const spring = speed + frequency * error;
				const decay = Math.exp(-frequency * dt);
				angle = returnAngle + (error + spring * dt) * decay;
				speed = (speed - frequency * spring * dt) * decay;
				if (Math.abs(returnAngle - angle) < 1e-4 && Math.abs(speed) < 1e-4) {
					angle = returnAngle;
					speed = 0;
				}
			}
			activityRemaining = Math.max(0, activityRemaining - dt);
			return angle;
		},
	};
}
