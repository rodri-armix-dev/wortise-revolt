import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mediaQueries } from '../../../../config/breakpoints';
import { readElements, resetElements } from './ads-sections-motion';
import type { AdsElements, Controller } from './ads-sections-motion';
import { createStickyController } from './ads-sections-sticky';
import { createPinController } from './ads-sections-pin';

const cleanups: (() => void)[] = [];
let disposed = false;

function mount(elements: AdsElements) {
	const { root, phoneLayout, viewportMeasure, items } = elements;
	const stackedMedia = matchMedia(mediaQueries.osm);
	const reducedMedia = matchMedia('(prefers-reduced-motion: reduce)');
	const touchMedia = matchMedia('(hover: none), (pointer: coarse)');
	const events = new AbortController();
	let controller: Controller | undefined;
	let keyboardScroll: gsap.core.Tween | undefined;
	let frame = 0;
	let restoreFrame = 0;
	let geometry = '';
	let rebuilding = false;
	let savedProgress: number | undefined;
	let pendingPosition: ReturnType<typeof capture>;
	const within = () => !!controller && scrollY >= controller.trigger.start && scrollY <= controller.trigger.end;
	const signature = () => [
		root.clientWidth, stackedMedia.matches, reducedMedia.matches, touchMedia.matches,
		stackedMedia.matches ? viewportMeasure.clientHeight : phoneLayout.clientHeight,
		// The desktop intro contracts while scrolling; measure its text, not its animated height.
		...items.flatMap(({ intro, content }) => [stackedMedia.matches ? intro.offsetHeight : intro.querySelector<HTMLElement>('.ads-sections-item__heading')?.scrollHeight, content.offsetHeight]),
	].join(':');
	function capture() {
		if (!controller || !within()) return;
		return {
			mode: controller.mode, playback: controller.playback, index: Math.max(0, controller.active()),
			progress: controller.trigger.progress, cards: controller.captureCards?.(),
		};
	}
	// The coordinator is the only owner of deferred scroll restoration.
	const restoreScroll = (current: Controller, progress: number, complete?: () => void) => {
		cancelAnimationFrame(restoreFrame);
		const deadline = performance.now() + 1000;
		const attempt = () => {
			if (disposed || controller !== current) return;
			const target = current.trigger.start + progress * (current.trigger.end - current.trigger.start);
			const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
			if (target > maximum + 1 && performance.now() < deadline) {
				restoreFrame = requestAnimationFrame(attempt);
				return;
			}
			window.scrollTo({ top: Math.min(target, maximum), behavior: 'instant' });
			ScrollTrigger.update();
			complete?.();
		};
		restoreFrame = requestAnimationFrame(attempt);
	};
	const rebuild = () => {
		if (disposed || rebuilding) return;
		const carry = pendingPosition ?? capture();
		rebuilding = true;
		cancelAnimationFrame(restoreFrame);
		savedProgress = undefined;
		keyboardScroll?.kill();
		controller?.destroy();
		controller = undefined;
		resetElements(elements);
		try {
			const options = { reduced: reducedMedia.matches, rebuilding: () => rebuilding };
			controller = stackedMedia.matches
				? createStickyController(elements, { ...options, touch: touchMedia.matches || navigator.maxTouchPoints > 0 })
				: createPinController(elements, options);
			if (!controller) resetElements(elements);
			geometry = signature();
			ScrollTrigger.refresh();
		} finally {
			rebuilding = false;
		}
		const current = controller;
		if (!current) {
			pendingPosition = undefined;
			return;
		}
		if (!carry) {
			current.sync();
			return;
		}
		pendingPosition = carry;
		const samePlayback = carry.mode === current.mode && carry.playback === current.playback;
		const progress = samePlayback ? carry.progress : (current.panelScroll(carry.index) - current.trigger.start) / (current.trigger.end - current.trigger.start);
		restoreScroll(current, progress, () => {
			current.sync(progress);
			if (samePlayback && carry.cards && current.active() === carry.index) current.restoreCards?.(carry.cards);
			pendingPosition = undefined;
		});
	};
	const schedule = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			if (geometry !== signature()) rebuild();
		});
	};
	const observer = new ResizeObserver(schedule);
	observer.observe(root);
	observer.observe(phoneLayout);
	observer.observe(viewportMeasure);
	items.forEach(({ intro, content }) => {
		observer.observe(intro);
		observer.observe(content);
	});
	// Keep the existing WebKit workaround for exited sticky layers.
	const visibilityObserver = new IntersectionObserver(([entry]) => {
		root.toggleAttribute('data-offscreen', entry.boundingClientRect.bottom <= 0);
	});
	visibilityObserver.observe(root);
	[stackedMedia, reducedMedia, touchMedia].forEach((media) => media.addEventListener('change', schedule, { signal: events.signal }));
	screen.orientation?.addEventListener('change', schedule, { signal: events.signal });

	window.addEventListener('keydown', (event) => {
		if (!controller || !within() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
		if (event.target instanceof Element && event.target.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;
		const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey ? -1 : 1)
			: ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
		const next = controller.active() + direction;
		if (!direction || next < 0 || next >= items.length) return;
		event.preventDefault();
		keyboardScroll?.kill();
		const state = { y: scrollY };
		keyboardScroll = gsap.to(state, {
			y: controller.panelScroll(next), duration: reducedMedia.matches ? 0 : 0.75, ease: 'power2.inOut',
			onUpdate: () => window.scrollTo({ top: state.y, behavior: 'instant' }),
		});
	}, { signal: events.signal });
	for (const type of ['wheel', 'touchstart']) window.addEventListener(type, () => keyboardScroll?.kill(), { passive: true, signal: events.signal });
	const followAnchor = () => {
		if (!controller || !location.hash) return;
		let id: string;
		try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
		const index = items.findIndex(({ section }) => section.id === id);
		if (index < 0) return;
		cancelAnimationFrame(restoreFrame);
		pendingPosition = undefined;
		window.scrollTo({ top: controller.panelScroll(index), behavior: 'instant' });
		ScrollTrigger.update();
		if (controller.playback !== 'scrub') controller.sync();
	};
	window.addEventListener('hashchange', followAnchor, { signal: events.signal });
	const beforeRefresh = () => {
		if (!rebuilding && !pendingPosition) savedProgress = within() && controller ? (scrollY - controller.trigger.start) / (controller.trigger.end - controller.trigger.start) : undefined;
	};
	const afterRefresh = () => {
		if (rebuilding || pendingPosition || savedProgress === undefined || !controller) return;
		const progress = savedProgress;
		savedProgress = undefined;
		restoreScroll(controller, progress);
	};
	ScrollTrigger.addEventListener('refreshInit', beforeRefresh);
	ScrollTrigger.addEventListener('refresh', afterRefresh);
	rebuild();
	followAnchor();
	return () => {
		cancelAnimationFrame(frame);
		cancelAnimationFrame(restoreFrame);
		keyboardScroll?.kill();
		observer.disconnect();
		visibilityObserver.disconnect();
		root.removeAttribute('data-offscreen');
		events.abort();
		ScrollTrigger.removeEventListener('refreshInit', beforeRefresh);
		ScrollTrigger.removeEventListener('refresh', afterRefresh);
		controller?.destroy();
		controller = undefined;
		resetElements(elements);
	};
}

void document.fonts.ready.then(() => {
	if (disposed) return;
	for (const root of document.querySelectorAll<HTMLElement>('.ads-sections')) {
		const elements = readElements(root);
		if (!elements) continue;
		const range = root.dataset.range;
		if (!range) {
			cleanups.push(mount(elements));
			continue;
		}
		const media = matchMedia(range === 'mobile' ? mediaQueries.osm : mediaQueries.l);
		let cleanup: (() => void) | undefined;
		const syncRange = () => {
			if (media.matches) cleanup ??= mount(elements);
			else {
				cleanup?.();
				cleanup = undefined;
			}
		};
		media.addEventListener('change', syncRange);
		syncRange();
		cleanups.push(() => {
			media.removeEventListener('change', syncRange);
			cleanup?.();
		});
	}
});

if (import.meta.hot) import.meta.hot.dispose(() => {
	disposed = true;
	cleanups.forEach((cleanup) => cleanup());
});
