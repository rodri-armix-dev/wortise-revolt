import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardFadeDuration, cardFadeEase, createPanelMotion, isRefreshing, revealProperty } from './ads-sections-motion';
import type { AdsElements, Controller } from './ads-sections-motion';

export function createPinController(elements: AdsElements, options: { reduced: boolean; rebuilding: () => boolean }): Controller | undefined {
	const { root, scene, phoneLayout, items } = elements;
	scene.append(...items.map(({ glow }) => glow), phoneLayout);
	const height = phoneLayout.clientHeight;
	const padding = parseFloat(getComputedStyle(items[0].section).paddingTop);
	if (items.some(({ intro, content }) => Math.max(intro.offsetHeight, content.offsetHeight) > height - padding * 2)) return;
	const visual = items[0].visual.getBoundingClientRect();
	const panel = items[0].panel.getBoundingClientRect();
	const intro = items[0].intro.getBoundingClientRect();
	const glowX = intro.right + Math.max(0, visual.left - intro.right) / 8;
	root.style.setProperty('--ads-sections-glow-x', `${glowX - panel.left}px`);
	root.style.setProperty('--ads-sections-glow-y', `${height / 2}px`);
	root.style.setProperty('--ads-sections-phone-left', `${visual.left - panel.left}px`);
	root.style.setProperty('--ads-sections-phone-top', `${visual.top - panel.top}px`);
	root.style.setProperty('--ads-sections-phone-width', `${visual.width}px`);
	root.style.setProperty('--ads-sections-item-phone-width', `${visual.width}px`);
	root.style.setProperty('--ads-sections-item-annotations-fade-duration', '0s');
	root.dataset.enhanced = '';
	root.dataset.pinning = 'fixed';
	const hold = 0.6;
	const step = 1.6;
	const readingDuration = step * 0.6;
	const duration = (items.length - 1) * step + hold * 2 + readingDuration;
	const distance = height * duration;
	let motion!: ReturnType<typeof createPanelMotion>;
	let trigger!: ScrollTrigger;
	let reveals: gsap.core.Timeline[][] = [];
	const reached = items.map(({ cards }) => cards.map(() => false));
	const updateAccess = () => items.forEach(({ panel, cards }) => cards.forEach((card) => {
		const hidden = panel.inert || Number(panel.style.getPropertyValue(revealProperty(card))) < 0.999;
		if (card.inert !== hidden) card.inert = hidden;
		if (card.getAttribute('aria-hidden') !== String(hidden)) card.setAttribute('aria-hidden', String(hidden));
	}));
	const context = gsap.context(() => {
		motion = createPanelMotion(elements, {
			hold, step, readingOffset: step * 0.45, finalHold: hold + readingDuration,
			discrete: false, reduced: options.reduced, suspend: () => false,
			render: ({ time, isActive }) => {
				reveals.forEach((animations, index) => animations.forEach((animation, rank) => {
					const threshold = (index === 0 ? 0 : hold + index * step) + rank * step * 0.45 / items[index].cards.length;
					const visible = time + 0.00001 >= threshold && (time > 0 || isActive);
					if (reached[index][rank] === visible) return;
					reached[index][rank] = visible;
					if (visible) animation.play();
					else animation.reverse();
				}));
				updateAccess();
			},
		});
		if (!options.reduced) reveals = items.map(({ panel, cards }) => cards.map((card) => {
			const property = revealProperty(card);
			gsap.set(panel, { [property]: 0 });
			return gsap.timeline({ paused: true, onUpdate: updateAccess })
				.to(panel, { [property]: 1, duration: cardFadeDuration, ease: cardFadeEase });
		}));
		motion.update();
		trigger = ScrollTrigger.create({
			trigger: root, start: 'top top', end: `+=${distance}`, pin: scene, pinSpacing: true,
			animation: options.reduced ? undefined : motion.timeline, scrub: options.reduced ? false : 0.2,
			onToggle: motion.update,
			onUpdate: (self) => {
				if (options.rebuilding() || isRefreshing() || !options.reduced) return;
				motion.updateFromScroll(self, duration);
			},
		});
		motion.attach(trigger);
	}, root);
	return {
		mode: 'pin', playback: options.reduced ? 'reduced' : 'scrub', trigger,
		active: motion.active,
		panelScroll: (index) => trigger.start + motion.readingPositionFor(index) * height,
		sync: (progress = trigger.progress) => motion.sync(progress, duration),
		captureCards: () => reveals[motion.active()]?.map((animation) => animation.progress()),
		restoreCards: (values) => values.forEach((value, rank) => {
			const animation = reveals[motion.active()]?.[rank];
			if (!animation) return;
			animation.progress(value);
			if (reached[motion.active()][rank]) animation.play();
			else animation.reverse();
		}),
		destroy: () => { motion.destroy(); context.revert(); },
	};
}
