export const scrollTimingDefaults = {
	mobile: { reference: 800, pause: 70, transition: 100, 'screen-start': 30 },
	desktop: { reference: 900, pause: 30, transition: 100, 'screen-start': 30 },
} as const;

export const scrollTimingDefaultsStyle = Object.entries(scrollTimingDefaults)
	.flatMap(([profile, timing]) => Object.entries(timing).map(([field, value]) => `--scroll-${profile}-${field}-default: ${value};`))
	.join(' ');

export function getScreenRange(index: number) {
	const end = `${index} * var(--scroll-step)`;
	return `contain calc(${end} - var(--scroll-transition) + var(--scroll-screen-offset)) contain calc(${end})`;
}
