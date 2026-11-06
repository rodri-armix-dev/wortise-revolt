import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardFadeDuration, cardFadeEase, createPanelMotion, isRefreshing } from './ads-sections-motion';
import type { AdsElements, Controller } from './ads-sections-motion';

const phoneZoomOutDuration = 0.48;

export function createStickyController(elements: AdsElements, options: { touch: boolean; reduced: boolean; rebuilding: () => boolean }): Controller | undefined {
	const { root, phoneLayout, viewportMeasure, items } = elements;
	const phone = phoneLayout.querySelector<HTMLElement>('.ads-sections__phone-zoom');
	if (!phone) return;
	const height = viewportMeasure.clientHeight;
	const padding = parseFloat(getComputedStyle(items[0].section).paddingTop);
	const gap = parseFloat(getComputedStyle(items[0].inner).rowGap);
	const introHeight = Math.max(...items.map(({ intro }) => intro.offsetHeight));
	const contentHeight = Math.max(...items.map(({ content }) => content.offsetHeight));
	const available = height - padding * 2 - introHeight - contentHeight - gap * 2;
	// Short viewports keep every panel in normal flow.
	if (available < 120) return;
	const phoneWidth = Math.min(available * 410 / 788, items[0].inner.clientWidth, 320);
	// Cap the transformed phone too; max-width alone does not constrain scale().
	const initialPhoneMaxWidth = Math.min(items[0].inner.clientWidth, 384);
	const initialPhoneScale = Math.min(1.5, initialPhoneMaxWidth / phoneWidth);
	root.style.setProperty('--ads-sections-item-display', 'grid');
	root.style.setProperty('--ads-sections-item-rows', `${introHeight}px ${available}px minmax(${contentHeight}px, 1fr)`);
	root.style.setProperty('--ads-sections-item-inner-height', 'calc(var(--ads-sections-item-height) - var(--ads-sections-item-padding-block, var(--spacing-48)) * 2)');
	root.style.setProperty('--ads-sections-item-phone-max-width', '100%');
	root.style.setProperty('--ads-sections-item-phone-width', `${phoneWidth}px`);
	root.style.setProperty('--ads-sections-phone-width', `${phoneWidth}px`);
	root.style.setProperty('--ads-sections-phone-initial-scale', String(initialPhoneScale));
	root.style.setProperty('--ads-sections-phone-gap', `${gap}px`);
	// The zoom starts at the scene center, then settles between the cards.
	root.style.setProperty('--ads-sections-phone-center-offset', `${(contentHeight - introHeight) / 2}px`);
	root.style.setProperty('--ads-sections-glow-x', `${root.clientWidth / 2}px`);
	root.style.setProperty('--ads-sections-glow-y', `calc(var(--ads-sections-item-height) * 0.5 + ${(introHeight - contentHeight) / 2}px)`);
	const hold = options.touch ? 0 : 0.6;
	const step = options.touch ? 1 : 1.6;
	const duration = options.touch ? items.length - 1 + 1.1 : (items.length - 1) * step + hold * 2;
	const distance = height * duration;
	const inset = parseFloat(getComputedStyle(root).getPropertyValue('--ads-sections-inset'));
	root.style.setProperty('--ads-sections-track-height', `calc(var(--ads-sections-item-height) + ${distance + inset * 2}px)`);
	root.dataset.enhanced = '';
	root.dataset.pinning = 'sticky';
	let motion!: ReturnType<typeof createPanelMotion>;
	let trigger!: ScrollTrigger;
	let reveals: gsap.core.Timeline[] = [];
	let phoneEntrance: gsap.core.Timeline | undefined;
	let phoneTransition: gsap.core.Tween | undefined;
	let phoneDelay: gsap.core.Tween | undefined;
	let phoneShown = -1;
	const phoneEntranceDelay = 0.1;
	const cardRevealDelay = 0.08;
	const cardRevealStagger = 0.2;
	const shown = items.map(() => false);
	const updateAccess = () => items.forEach(({ panel, content }) => {
		const hidden = panel.inert || Number(panel.style.getPropertyValue('--ads-sections-item-bottom-opacity')) < 0.999;
		content.inert = hidden;
		content.setAttribute('aria-hidden', String(hidden));
	});
	const context = gsap.context(() => {
		if (!options.reduced) {
			// CSS owns the capped initial scale. One reversible timeline keeps the
			// shared frame continuous when scrolling changes direction mid-zoom.
			phoneEntrance = gsap.timeline({ paused: true })
				.to(phone, { scale: 1, y: 0, duration: phoneZoomOutDuration, ease: cardFadeEase });
		}
		motion = createPanelMotion(elements, {
			hold, step, readingOffset: 0, finalHold: options.touch ? 1.1 : hold,
			discrete: options.touch, reduced: options.reduced,
			suspend: () => isRefreshing() && !options.rebuilding(),
			render: ({ index, moving, isActive }) => {
				const arrivedIndex = isActive && !moving ? index : -1;
				items.forEach(({ panel }, i) => {
					const opacity = isActive && !moving && i === index ? '1' : '0';
					if (panel.style.getPropertyValue('--ads-sections-item-annotations-opacity') !== opacity) panel.style.setProperty('--ads-sections-item-annotations-opacity', opacity);
				});
				reveals.forEach((animation, i) => {
					const arrived = i === arrivedIndex;
					if (shown[i] === arrived) return;
					shown[i] = arrived;
					if (!arrived) animation.reverse();
				});
				if (phoneShown !== arrivedIndex) {
					phoneTransition?.kill();
					phoneTransition = undefined;
					phoneDelay?.kill();
					phoneDelay = undefined;
					phoneShown = arrivedIndex;
					if (arrivedIndex < 0) phoneEntrance?.reverse();
					else if (phoneEntrance) {
						const entrance = phoneEntrance;
						// Only enter after the slide settles; rapid scroll cancels this wait.
						entrance.pause();
						phoneDelay = gsap.delayedCall(phoneEntranceDelay, () => {
							phoneDelay = undefined;
							if (phoneShown !== arrivedIndex || !trigger.isActive) return;
							// Resuming play() uses only the remaining timeline duration.
							// Keep every zoom out equally long, even after an interrupted reverse.
							phoneTransition = entrance.tweenTo(entrance.duration(), { duration: phoneZoomOutDuration, ease: 'none' });
							reveals[arrivedIndex]?.restart();
						});
					} else reveals[arrivedIndex]?.restart();
				}
				updateAccess();
			},
		});
		if (!options.reduced) reveals = items.map(({ panel }) => {
			gsap.set(panel, { '--ads-sections-item-top-opacity': 0, '--ads-sections-item-bottom-opacity': 0 });
			return gsap.timeline({ paused: true, onUpdate: updateAccess })
				.to(panel, { '--ads-sections-item-top-opacity': 1, duration: cardFadeDuration, ease: cardFadeEase }, cardRevealDelay)
				.to(panel, { '--ads-sections-item-bottom-opacity': 1, duration: cardFadeDuration, ease: cardFadeEase }, cardRevealDelay + cardRevealStagger);
		});
		motion.update();
		trigger = ScrollTrigger.create({
			trigger: root, start: 'top top', end: `+=${distance}`, pin: false, pinSpacing: false,
			animation: !options.touch && !options.reduced ? motion.timeline : undefined,
			scrub: !options.touch && !options.reduced ? 0.2 : false,
			onToggle: motion.update,
			onUpdate: (self) => {
				if (options.rebuilding() || isRefreshing() || (!options.touch && !options.reduced)) return;
				motion.updateFromScroll(self, duration);
			},
		});
		motion.attach(trigger);
	}, root);
	return {
		mode: 'sticky', playback: options.reduced ? 'reduced' : options.touch ? 'panels' : 'scrub', trigger,
		active: motion.active,
		panelScroll: (index) => trigger.start + motion.readingPositionFor(index) * height,
		sync: (progress = trigger.progress) => motion.sync(progress, duration),
		destroy: () => { phoneDelay?.kill(); phoneTransition?.kill(); motion.destroy(); context.revert(); },
	};
}
