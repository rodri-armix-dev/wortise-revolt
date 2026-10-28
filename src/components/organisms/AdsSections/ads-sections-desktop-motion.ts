import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { desktopMotionTracks } from './ads-sections-desktop-data';

gsap.registerPlugin(CustomEase);
const curves = new Map<string, string | gsap.EaseFunction>();
const easing = (css: string) => {
	if (css === 'linear') return 'none';
	if (!curves.has(css)) {
		const bezier = css === 'ease-in-out' ? '0.42,0,0.58,1' : css.replace(/^cubic-bezier\(|\)$/g, '');
		curves.set(css, CustomEase.create(`ads-desktop-${curves.size}`, bezier));
	}
	return curves.get(css)!;
};

// Each profile references the reviewed Figma layers. Extra stages reuse the last
// entrance; they do not require another position table or changes to the renderer.
export const desktopProfiles = [
	{ left: '1:7250', title: '1:7251', right: '1:7254', glow: '1:7246', screen: '', enter: 0, rest: 4, exit: 5, end: 6.815, screenStart: 0, annotations: ['1:7279', '1:7286'] },
	{ left: '1:7289', title: '1:7290', right: '1:7293', glow: '1:7248', screen: '1:7263', enter: 6.765202, rest: 9, exit: 10, end: 11.673, screenStart: 6.765202, annotations: ['1:7273', '1:7276'] },
	{ left: '1:7298', title: '', right: '1:7303', glow: '1:7247', screen: '1:7264', enter: 10.88, rest: 13, exit: 14, end: 15.673, screenStart: 10.88, annotations: ['1:7266', '1:7269'] },
];

export function appendDesktopMotion(timeline: gsap.core.Timeline, target: HTMLElement, node: string, options: {
	from: number;
	to: number;
	at: number;
	rest: number;
	scale?: number;
	properties?: string[];
	map?: (property: string, value: number) => [string, number];
}) {
	const tracks = desktopMotionTracks[node] ?? {};
	for (const [property, frames] of Object.entries(tracks)) {
		if (options.properties && !options.properties.includes(property)) continue;
		const baseline = frames.filter(([time]) => time <= options.rest).at(-1)?.[1] ?? 0;
		const mapped = (value: number): [string, number] => {
			if (options.map) return options.map(property, value);
			return [property, ['x', 'y'].includes(property) ? (value - baseline) * (options.scale ?? 1) : value];
		};
		for (let i = 1; i < frames.length; i++) {
			const [start, from, ease] = frames[i - 1];
			const [end, to] = frames[i];
			if (end <= options.from || start >= options.to || from === to) continue;
			const [key, initial] = mapped(from);
			const [, final] = mapped(to);
			timeline.fromTo(target, { [key]: initial }, {
				[key]: final, duration: end - start, ease: easing(ease), immediateRender: false,
			}, options.at + start - options.from);
		}
	}
}
