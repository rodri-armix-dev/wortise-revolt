import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mediaQueries } from '../../../../config/breakpoints';

// Scroll pacing: 1 = original, 1.25 = 25% longer, 1.5 = 50% longer.
// Applies to the first entrance and the complete pinned sequence, including holds.
const SCROLL_DURATION_MULTIPLIER = 1.25;

// GSAP exposes these matchMedia lifecycle hooks without declarations in 3.15.
const mediaEvents = gsap as typeof gsap & {
	addEventListener(event: 'matchMediaInit', callback: () => void): void;
	removeEventListener(event: 'matchMediaInit', callback: () => void): void;
};
const beforeMediaChange = new Set<() => void>();
const preservePositions = () => beforeMediaChange.forEach((save) => save());
mediaEvents.addEventListener('matchMediaInit', preservePositions);
gsap.registerPlugin(ScrollTrigger);

const cleanups: (() => void)[] = [];
let disposed = false;

// Measure after fonts settle, before pin spacing changes document positions.
void document.fonts.ready.then(() => {
	if (disposed) return;
	for (const sections of document.querySelectorAll<HTMLElement>('.audience-sections')) {
		const scene = sections.querySelector<HTMLElement>('.audience-sections__scene');
		const panels = [...sections.querySelectorAll<HTMLElement>('[data-audience-panel]')];
		const cards = [...sections.querySelectorAll<HTMLElement>('.audience-sections-item')];
		const text = [...sections.querySelectorAll<HTMLElement>('.audience-sections-item__intro, .audience-sections-item__content')];
		if (!scene || panels.length < 2) continue;

		const touch = matchMedia('(hover: none), (pointer: coarse)').matches
			|| 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		sections.dataset.input = touch ? 'touch' : 'mouse';
		let active = 0;
		let carry: { progress: number; index: number } | undefined;
		let lastPosition = { progress: 0, index: active };
		const preservePosition = () => {
			if (lastPosition.progress > 0 && lastPosition.progress < 1) carry = lastPosition;
		};
		beforeMediaChange.add(preservePosition);
		const media = gsap.matchMedia();

		media.add({ stacked: mediaQueries.osm, desktop: mediaQueries.l, reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
			const sticky = !!context.conditions?.stacked;
			const reduced = !!context.conditions?.reduced;
			const hold = 0.55;
			const reveal = 0.9;
			const transition = reveal - hold;
			const entranceDistance = 0.35;
			const restore = carry;
			carry = undefined;
			sections.dataset.pinning = sticky ? 'sticky' : 'fixed';
			// Release both ends so Safari only samples the inset pinned scene.
			// Avoid a second browser scroll compensation when refreshing the track.
			gsap.set(document.documentElement, { overflowAnchor: 'none' });
			let trigger: ScrollTrigger | undefined;
			let entered = false;
			let refreshing: { progress: number; index: number } | undefined;
			let frame = 0;
			let geometry = '';
			const distance = () => scene.clientHeight * panels.length * SCROLL_DURATION_MULTIPLIER;
			const within = () => !!trigger && scrollY >= trigger.start && scrollY <= trigger.end;

			// One unit per viewport: reading hold, then a reversible transition.
			// Animate the molecule through its custom properties, keeping layout intact.
			const timeline = reduced ? undefined : gsap.timeline({ paused: true });
			panels.forEach((panel, index) => {
				gsap.set(panel, { zIndex: panels.length - index });
				if (!timeline) return;
				gsap.set(panel, {
					'--audience-sections-item-background-inset': '0%',
					'--audience-sections-item-background-opacity': index === 0 || index === panels.length - 1 ? 0 : 1,
					'--audience-sections-item-background-scale': index === panels.length - 1 ? 0.95 : 1,
					'--audience-sections-item-content-opacity': 1,
					'--audience-sections-item-visual-scale': 0.85,
				});
			});
			const entranceParts = [
				{ name: 'eyebrow', y: 12 },
				{ name: 'visual', y: 24 },
				{ name: 'heading', y: 18 },
				{ name: 'description', y: 12 },
				{ name: 'action', y: 12 },
			];
			if (!reduced) {
				panels.forEach((panel) => entranceParts.forEach(({ name, y }) => {
					gsap.set(panel, {
						[`--audience-sections-item-${name}-opacity`]: 0,
						[`--audience-sections-item-${name}-y`]: `${y}px`,
					});
				}));
			}
			const addEntrance = (animation: gsap.core.Timeline, panel: HTMLElement, start: number, duration: number) => {
				entranceParts.forEach(({ name }, index) => {
					animation.to(panel, {
						[`--audience-sections-item-${name}-opacity`]: 1,
						[`--audience-sections-item-${name}-y`]: '0px',
						...(name === 'visual' ? { '--audience-sections-item-visual-scale': 1 } : {}),
						duration: duration * 0.68,
						ease: 'power1.out',
					}, start + duration * index * 0.08);
				});
			};
			// The first entrance uses the same sequence before the scene pins.
			const entryTimeline = reduced ? undefined : gsap.timeline({ paused: true });
			if (entryTimeline) {
				entryTimeline.to(panels[0], { '--audience-sections-item-background-opacity': 1, duration: 0.3, ease: 'power1.out' }, 0);
				addEntrance(entryTimeline, panels[0], 0.3, 0.7);
			}
			if (timeline) {
				panels.slice(0, -1).forEach((panel, index) => {
					const start = index + hold;
					const next = panels[index + 1];
					timeline.to(panel, {
						'--audience-sections-item-content-opacity': 0,
						duration: 0.12,
						ease: 'power1.inOut',
					}, start)
						.to(panel, {
							'--audience-sections-item-background-inset': '50%',
							duration: transition,
							ease: 'power1.inOut',
						}, start)
						.to(next, {
							'--audience-sections-item-background-opacity': 1,
							'--audience-sections-item-background-scale': 1,
							duration: transition,
							ease: 'power1.inOut',
						}, start);
					addEntrance(timeline, next, index + reveal, entranceDistance);
				});
				// Keep the last panel readable before releasing the pinned scene.
				timeline.to({}, { duration: 1 }, panels.length - 1);
			}

			const select = (index: number) => {
				active = index;
				sections.dataset.activePanel = String(index);
				panels.forEach((panel, position) => {
					const selected = position === index;
					panel.toggleAttribute('data-active', selected);
					panel.inert = !selected;
					panel.setAttribute('aria-hidden', String(!selected));
				});
			};
			const update = (self: ScrollTrigger) => {
				// Enter as ordinary content until the scene reaches its sticky inset.
				sections.toggleAttribute('data-before-pin', sticky && self.progress === 0);
				// Keep the same bottom-anchored geometry, but remove the viewport
				// constraint before Safari can extend the exiting sticky's color.
				sections.toggleAttribute('data-exited', sticky && self.progress === 1);
				const position = self.progress * panels.length;
				const current = Math.min(panels.length - 1, Math.floor(position));
				const transitioning = !reduced && current < panels.length - 1 && position - current > hold;
				const index = current === 0 && !entered ? -1
					: transitioning && position - current >= reveal + (1 - reveal) / 2 ? current + 1 : current;
				timeline?.time(position);
				panels.forEach((panel, panelIndex) => {
					panel.toggleAttribute('data-visible', panelIndex === current || (transitioning && panelIndex === current + 1));
					panel.toggleAttribute('data-transitioning', (transitioning && (panelIndex === current || panelIndex === current + 1))
						|| (!reduced && current > 0 && position - current < reveal + entranceDistance - 1 && panelIndex === current));
				});
				if (index !== active) select(index);
				lastPosition = { progress: self.progress, index };
			};
			const measure = () => {
				if (sticky) {
					const available = cards.map((card, index) => {
						const style = getComputedStyle(card);
						const inner = getComputedStyle(card.querySelector('.global-inner')!);
						return scene.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
							- parseFloat(inner.rowGap) * 2 - text[index * 2].offsetHeight - text[index * 2 + 1].offsetHeight;
					});
					sections.style.setProperty('--audience-sections-item-preview-height', `${Math.max(0, Math.min(...available))}px`);
					const style = getComputedStyle(scene);
					sections.style.setProperty('--audience-sections-track-height', `${scene.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom) + distance()}px`);
				} else {
					sections.style.removeProperty('--audience-sections-item-preview-height');
				}
				const next = [scene.clientHeight, ...text.map((element) => element.offsetHeight)].join(',');
				const changed = geometry !== next;
				geometry = next;
				return changed;
			};
			const restorePosition = (saved: { progress: number; index: number }) => {
				if (!trigger) return;
				const progress = saved.progress;
				window.scrollTo({ top: trigger.start + Math.max(1, progress * (trigger.end - trigger.start)), behavior: 'instant' });
				ScrollTrigger.update();
			};

			select(active);
			measure();
			trigger = ScrollTrigger.create({
				trigger: sections,
				pin: sticky ? false : scene,
				pinType: 'fixed',
				start: () => Math.round(sections.getBoundingClientRect().top + scrollY),
				end: () => `+=${distance()}`,
				invalidateOnRefresh: true,
				onUpdate: update,
				onRefreshInit: () => {
					refreshing = within() ? { progress: trigger!.progress, index: active } : undefined;
					measure();
				},
				onRefresh: (self) => {
					if (refreshing) restorePosition(refreshing);
					refreshing = undefined;
					update(self);
				},
			});
			// Reveal the first card only after it occupies 25% of the viewport.
			// This entrance runs before pinning and reverses when scrolling up.
			const updateEntry = (self: ScrollTrigger) => {
				entered = self.progress > 0;
				gsap.set(sections, { '--audience-sections-entry-opacity': Number(entered) });
				entryTimeline?.progress(self.progress);
				panels[0].toggleAttribute('data-entering', !reduced && self.progress > 0 && self.progress < 1);
				if (trigger) update(trigger);
			};
			ScrollTrigger.create({
				trigger: sections,
				start: 'top 75%',
				end: () => `+=${window.innerHeight * 0.5 * SCROLL_DURATION_MULTIPLIER}`,
				onUpdate: updateEntry,
				onRefresh: updateEntry,
			});
			const observer = new ResizeObserver(() => {
				cancelAnimationFrame(frame);
				frame = requestAnimationFrame(() => {
					if (measure()) ScrollTrigger.refresh();
				});
			});
			[scene, ...text].forEach((element) => observer.observe(element));
			ScrollTrigger.refresh();
			const restoreFrame = restore ? requestAnimationFrame(() => restorePosition(restore)) : 0;

			// Direct links to a card must also select it inside the pinned scene.
			const navigate = () => {
				const target = document.getElementById(location.hash.slice(1));
				const index = panels.findIndex((panel) => target && panel.contains(target));
				if (index >= 0) restorePosition({ index, progress: (index + 0.25) / panels.length });
			};
			window.addEventListener('hashchange', navigate);
			if (!restore) navigate();

			return () => {
				observer.disconnect();
				cancelAnimationFrame(frame);
				cancelAnimationFrame(restoreFrame);
				window.removeEventListener('hashchange', navigate);
				delete sections.dataset.pinning;
				sections.removeAttribute('data-before-pin');
				sections.removeAttribute('data-exited');
				sections.style.removeProperty('--audience-sections-track-height');
				sections.style.removeProperty('--audience-sections-item-preview-height');
			};
		});
		cleanups.push(() => {
			beforeMediaChange.delete(preservePosition);
			media.revert();
			delete sections.dataset.input;
			delete sections.dataset.activePanel;
			panels.forEach((panel) => {
				panel.inert = false;
				panel.removeAttribute('aria-hidden');
				panel.removeAttribute('data-active');
				panel.removeAttribute('data-visible');
				panel.removeAttribute('data-transitioning');
				panel.removeAttribute('data-entering');
			});
		});
	}
});

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		disposed = true;
		mediaEvents.removeEventListener('matchMediaInit', preservePositions);
		cleanups.forEach((cleanup) => cleanup());
	});
}
