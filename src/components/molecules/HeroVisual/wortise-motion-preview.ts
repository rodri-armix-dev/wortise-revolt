export const entrancePreviews = [
	['zoom-spin', 'Entrada: crecer + 360° con inercia'],
	['fade', 'Entrada: aparecer'], ['rise', 'Entrada: subir'], ['turn', 'Entrada: giro'],
	['spin-y', 'Entrada: 360° horizontal'], ['spin-y-reverse', 'Entrada: 360° inverso'],
	['spin-x', 'Entrada: 360° vertical'], ['spin-z', 'Entrada: 360° frontal'], ['spin-mix', 'Entrada: giro combinado'],
] as const;
export const idlePreviews = [
	['float', 'Idle: flotar'], ['sway', 'Idle: balanceo'], ['breathe', 'Idle: respirar'], ['none', 'Idle: quieto'],
	['rotate-y', 'Idle: 360° horizontal'], ['rotate-y-reverse', 'Idle: 360° inverso'],
	['rotate-x', 'Idle: 360° vertical'], ['rotate-z', 'Idle: 360° frontal'], ['tumble', 'Idle: giro combinado'],
] as const;
export type EntrancePreview = typeof entrancePreviews[number][0];
export type IdlePreview = typeof idlePreviews[number][0];
export const defaultMotion = { entrance: 'zoom-spin' as EntrancePreview, idle: 'sway' as IdlePreview, swayIntensity: 1.1 };

export function entranceDuration(entrance?: EntrancePreview) {
	return entrance === 'zoom-spin' ? 1.5 : entrance?.startsWith('spin-') ? 2.4 : 1.2;
}

export function sampleMotionPreview(entrance: EntrancePreview | undefined, idle: IdlePreview, entranceTime: number, idleTime: number, swayIntensity = 1.1) {
	const duration = entranceDuration(entrance);
	const progress = Math.min(1, Math.max(0, entranceTime / duration));
	const remaining = (1 - progress) ** 3;
	const entering = Boolean(entrance) && progress < 1;
	const idleWeight = entrance ? 1 - remaining : 1;
	const turn = Math.PI * 2;
	// Full spins use a smooth acceleration and deceleration and land at zero rotation.
	const spin = -turn * (1 - progress * progress * (3 - 2 * progress));
	// A fast initial turn followed by a small, smoothly settling overshoot.
	const back = (amount: number) => 1 + (amount + 1) * (progress - 1) ** 3 + amount * (progress - 1) ** 2;
	const zoomSpin = entrance === 'zoom-spin';
	const arrival = progress === 0 ? 0 : progress === 1 ? 1 : back(0.8);
	const growth = progress === 0 ? 0.12 : progress === 1 ? 1 : 0.12 + 0.88 * back(1.1);
	const orbit = idleTime * turn / 8;
	const yaw = idle === 'float' ? Math.sin(idleTime * 0.55) * 0.055
		: idle === 'sway' ? Math.sin(idleTime * 0.8) * 0.18 * swayIntensity
		: idle === 'rotate-y' || idle === 'tumble' ? orbit
		: idle === 'rotate-y-reverse' ? -orbit : 0;
	const pitch = idle === 'sway' ? Math.sin(idleTime * 0.6) * 0.06 * swayIntensity
		: idle === 'rotate-x' ? orbit : idle === 'tumble' ? orbit * 0.6 : 0;
	const roll = idle === 'sway' ? Math.sin(idleTime * 0.7) * 0.025 * swayIntensity : idle === 'rotate-z' ? orbit : 0;
	// Leave room for diagonal orientations during frontal and combined turns.
	const fit = idle === 'rotate-z' || idle === 'tumble' ? 0.82 : 1;
	return {
		yaw: yaw * idleWeight + (zoomSpin ? -turn * (1 - arrival) : entrance === 'turn' ? -0.8 * remaining
			: entrance === 'spin-y' || entrance === 'spin-mix' ? spin : entrance === 'spin-y-reverse' ? -spin : 0),
		pitch: pitch * idleWeight + (entrance === 'spin-x' || entrance === 'spin-mix' ? spin : 0),
		roll: roll * idleWeight + (entrance === 'spin-z' ? spin : 0),
		y: (idle === 'float' ? Math.sin(idleTime * 0.9) * 0.035 * idleWeight : 0) - (entrance === 'rise' ? 0.25 * remaining : 0),
		scale: fit * (1 + (idle === 'breathe' ? Math.sin(idleTime * 1.1) * 0.025 * idleWeight : 0))
			* (zoomSpin ? growth : entrance === 'turn' ? 1 - remaining * 0.15 : entrance === 'spin-z' || entrance === 'spin-mix' ? 1 - Math.sin(progress * Math.PI) * 0.18 : 1),
		opacity: entering ? (zoomSpin ? Math.min(1, progress / 0.08) : entrance?.startsWith('spin-') ? Math.min(1, progress / 0.15) : 1 - remaining) : 1,
	};
}

export function createMotionPreview(initial?: { entrance: EntrancePreview; idle: IdlePreview; swayIntensity: number }) {
	let entrance: EntrancePreview | undefined = initial?.entrance;
	let idle: IdlePreview = initial?.idle ?? 'float';
	let entranceTime = initial ? 0 : 1.2;
	let idleTime = 0;
	return {
		enter: (value: EntrancePreview) => { entrance = value; entranceTime = 0; idleTime = 0; },
		idle: (value: IdlePreview) => { idle = value; entrance = undefined; entranceTime = 1.2; idleTime = 0; },
		reset: () => { entrance = undefined; entranceTime = 1.2; idleTime = 0; },
		sample: (delta: number) => {
			entranceTime += delta;
			idleTime += delta;
			return sampleMotionPreview(entrance, idle, entranceTime, idleTime, initial?.swayIntensity ?? 1.1);
		},
	};
}
