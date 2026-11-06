import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// GSAP exposes this runtime flag without declaring it in its bundled types.
export const isRefreshing = () => Boolean((ScrollTrigger as typeof ScrollTrigger & { isRefreshing?: boolean }).isRefreshing);
export const cardFadeDuration = 0.48;
export const cardFadeEase = 'sine.inOut';
export const revealProperty = (card: HTMLElement) => `--ads-sections-item-reveal-${card.dataset.adsReveal}-opacity`;

export function readElements(root: HTMLElement) {
	const scene = root.querySelector<HTMLElement>('.ads-sections__scene');
	const phoneLayout = root.querySelector<HTMLElement>('.ads-sections__phone-layout');
	const viewportMeasure = root.querySelector<HTMLElement>('.ads-sections__viewport-measure');
	const panels = [...root.querySelectorAll<HTMLElement>('.ads-sections__panel')];
	const screens = [...root.querySelectorAll<HTMLElement>('.ads-sections__screen')];
	const glows = [...root.querySelectorAll<HTMLElement>('.ads-sections__glow')];
	if (!scene || !phoneLayout || !viewportMeasure || panels.length < 2 || screens.length !== panels.length || glows.length !== panels.length) return;
	const items = panels.map((panel, index) => {
		const section = panel.querySelector<HTMLElement>('section');
		const inner = panel.querySelector<HTMLElement>('.ads-sections-item__inner');
		const intro = panel.querySelector<HTMLElement>('.ads-sections-item__intro');
		const content = panel.querySelector<HTMLElement>('.ads-sections-item__content');
		const visual = panel.querySelector<HTMLElement>('.ads-sections-item__visual');
		if (!section || !inner || !intro || !content || !visual) return;
		const cards = [...panel.querySelectorAll<HTMLElement>('[data-ads-reveal]')].sort((a, b) => Number(a.dataset.adsReveal) - Number(b.dataset.adsReveal));
		return { panel, section, inner, intro, content, visual, cards, screen: screens[index], glow: glows[index] };
	});
	if (items.some((item) => !item)) return;
	return { root, scene, phoneLayout, viewportMeasure, items: items as NonNullable<typeof items[number]>[] };
}

export type AdsElements = NonNullable<ReturnType<typeof readElements>>;

export interface Controller {
	mode: 'sticky' | 'pin';
	playback: 'scrub' | 'panels' | 'reduced';
	trigger: ScrollTrigger;
	active: () => number;
	panelScroll: (index: number) => number;
	sync: (progress?: number) => void;
	captureCards?: () => number[] | undefined;
	restoreCards?: (values: number[]) => void;
	destroy: () => void;
}

export function resetElements({ root, scene, phoneLayout, items }: AdsElements) {
	for (const attribute of ['data-enhanced', 'data-pinning', 'data-active', 'data-stack']) root.removeAttribute(attribute);
	root.removeAttribute('style');
	items.forEach(({ panel, section, content, visual, screen, glow, cards }) => {
		panel.inert = false;
		panel.removeAttribute('aria-hidden');
		visual.removeAttribute('aria-hidden');
		content.style.removeProperty('pointer-events');
		content.querySelectorAll<HTMLElement>('a, button, input, select, textarea').forEach((control) => { control.inert = false; });
		[panel, section, screen, glow].forEach((element) => element.removeAttribute('style'));
		cards.forEach((card) => {
			card.inert = false;
			card.removeAttribute('aria-hidden');
		});
	});
	// Always measure the next layout from the original, unpinned structure.
	root.append(...items.map(({ glow }) => glow), phoneLayout);
	// A reverted GSAP pin must have returned its scene directly to the root.
	if (scene.parentElement !== root) root.insertBefore(scene, phoneLayout);
}

interface MotionOptions {
	hold: number;
	step: number;
	readingOffset: number;
	finalHold: number;
	discrete: boolean;
	reduced: boolean;
	suspend: () => boolean;
	render: (frame: { time: number; index: number; moving: boolean; isActive: boolean }) => void;
}

// Shared only by the panel/screen slide. Each controller owns its reveals and trigger.
export function createPanelMotion({ root, items }: AdsElements, options: MotionOptions) {
	const { hold, step, readingOffset, finalHold, discrete, reduced } = options;
	let trigger: ScrollTrigger | undefined;
	let timeline: gsap.core.Timeline | undefined;
	let transition: gsap.core.Tween | undefined;
	let active = 0;
	let selected = -1;
	const positionFor = (index: number) => hold + index * step;
	const readingPositionFor = (index: number) => positionFor(index) + readingOffset;
	const setAccessible = (index: number) => {
		active = index;
		if (root.dataset.active === String(index)) return;
		root.dataset.active = String(index);
		items.forEach(({ panel }, i) => {
			panel.inert = i !== index;
			panel.setAttribute('aria-hidden', String(i !== index));
			panel.style.pointerEvents = i === index ? '' : 'none';
		});
	};
	const show = (index: number) => {
		setAccessible(index);
		items.forEach(({ panel, screen, glow, cards }, i) => {
			cards.forEach((card) => {
				card.inert = false;
				card.removeAttribute('aria-hidden');
			});
			gsap.set([panel, screen], { autoAlpha: i === index ? 1 : 0, yPercent: 0 });
			gsap.set(glow, { opacity: i === index ? 1 : 0 });
			panel.style.setProperty('--ads-sections-item-annotations-opacity', i === index ? '1' : '0');
		});
	};
	const update = () => {
		if (!timeline || options.suspend()) return;
		const time = timeline.time();
		const phase = Math.max(0, (time - hold) / step);
		const index = Math.min(items.length - 1, Math.floor(phase));
		const fraction = phase - index;
		const moving = fraction > (discrete ? 0 : 0.6) && index < items.length - 1;
		setAccessible(Math.min(items.length - 1, index + (fraction >= (discrete ? 0.5 : 0.8) ? 1 : 0)));
		items.forEach(({ panel, screen }, i) => {
			const visible = i === index || (moving && i === index + 1);
			[panel, screen].forEach((element) => {
				element.style.visibility = visible ? 'visible' : 'hidden';
				element.style.willChange = moving && visible ? 'transform' : '';
			});
		});
		options.render({ time, index, moving, isActive: !!trigger?.isActive });
	};
	const select = (index: number, immediate: boolean) => {
		transition?.kill();
		selected = index;
		if (!timeline) show(index);
		else if (immediate) {
			timeline.time(readingPositionFor(index));
			update();
		} else transition = timeline.tweenTo(readingPositionFor(index), { duration: 0.3, ease: 'power2.out', onComplete: update });
	};
	if (!reduced) {
		timeline = gsap.timeline({ paused: true, onUpdate: update });
		items.forEach(({ panel, screen, glow }, i) => {
			gsap.set([panel, screen], { yPercent: i === 0 ? 0 : 100 });
			gsap.set(panel, { '--ads-sections-item-annotations-opacity': 0 });
			gsap.set(glow, { opacity: i === 0 ? 1 : 0 });
			if (i === items.length - 1) return;
			const start = positionFor(i) + (discrete ? 0 : step * 0.6);
			const duration = discrete ? 1 : step * 0.4;
			const next = items[i + 1];
			timeline!.to([panel, screen], { yPercent: -100, duration, ease: 'none' }, start)
				.to([next.panel, next.screen], { yPercent: 0, duration, ease: 'none' }, start)
				.to(glow, { opacity: 0, duration, ease: 'none' }, start)
				.to(next.glow, { opacity: 1, duration, ease: 'none' }, start);
		});
		timeline.to({}, { duration: finalHold }, positionFor(items.length - 1));
	} else show(0);
	const indexFor = (progress: number, duration: number) => Math.min(items.length - 1, Math.max(0, Math.round((progress * duration - hold) / step)));
	return {
		timeline,
		active: () => active,
		readingPositionFor,
		update,
		attach: (value: ScrollTrigger) => { trigger = value; },
		updateFromScroll: (self: ScrollTrigger, duration: number) => {
			const index = indexFor(self.progress, duration);
			if (index !== selected) select(index, !self.isActive || reduced);
		},
		sync: (progress: number, duration: number) => {
			if (discrete || reduced) select(indexFor(progress, duration), true);
			else {
				timeline?.progress(progress);
				update();
			}
		},
		destroy: () => { transition?.kill(); },
	};
}
