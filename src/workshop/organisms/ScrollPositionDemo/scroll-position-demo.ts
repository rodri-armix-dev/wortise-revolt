import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { bindScrollPositionSettings } from './scroll-position-settings';
import { mountScrollPositionScrub } from './scroll-position-scrub';
import { mountScrollPositionSnap } from './scroll-position-snap';

const demo = document.querySelector<HTMLElement>('[data-scroll-position]');
const track = demo?.querySelector<HTMLElement>('[data-scroll-position-track]');
const stage = track?.querySelector<HTMLElement>('[data-scroll-position-stage]');
const panels = [...(stage?.querySelectorAll<HTMLElement>('[data-scroll-position-panel]') ?? [])];
const rail = track?.querySelector<HTMLElement>('[data-scroll-position-rail]');
const release = rail?.querySelector<HTMLElement>('[data-scroll-position-release]');
const state = stage?.querySelector<HTMLElement>('[data-scroll-position-state]');
const cuts = [...(rail?.querySelectorAll<HTMLElement>('[data-scroll-position-cut]') ?? [])];
const cleanups: (() => void)[] = [];

function bindOption(control: HTMLElement | null | undefined, option: string, fallback: boolean, apply: (enabled: boolean) => void) {
	const on = control?.querySelector<HTMLButtonElement>('[data-scroll-position-choice="on"]');
	const off = control?.querySelector<HTMLButtonElement>('[data-scroll-position-choice="off"]');
	if (!control || !on || !off) return;

	const storageKey = `wortise:scroll-position-demo:${option}`;
	const select = (enabled: boolean) => {
		on.setAttribute('aria-pressed', String(enabled));
		off.setAttribute('aria-pressed', String(!enabled));
		apply(enabled);
	};
	let initial = fallback;
	try {
		const saved = sessionStorage.getItem(storageKey);
		if (saved !== null) initial = saved === 'true';
	} catch {
		// Keep the default when storage is unavailable.
	}
	const onClick = (event: MouseEvent) => {
		const enabled = event.currentTarget === on;
		select(enabled);
		try {
			sessionStorage.setItem(storageKey, String(enabled));
		} catch {
			// The selection still applies to the current page.
		}
	};
	on.addEventListener('click', onClick);
	off.addEventListener('click', onClick);
	select(initial);
	control.hidden = false;
	cleanups.push(() => {
		on.removeEventListener('click', onClick);
		off.removeEventListener('click', onClick);
		control.hidden = true;
	});
}

function bindPanelSettings(demo: HTMLElement, onHold?: (hold: number) => void) {
	const form = demo.querySelector<HTMLFormElement>('[data-scroll-position-panel-settings]');
	const gear = demo.querySelector<HTMLButtonElement>('[data-scroll-position-panel-gear]');
	const travelField = form?.querySelector<HTMLInputElement>('[data-scroll-position-travel]');
	const transitionField = form?.querySelector<HTMLInputElement>('#scroll-position-panel-transition');
	const css = form?.querySelector<HTMLElement>('[data-scroll-position-css]');
	const js = form?.querySelector<HTMLElement>('[data-scroll-position-js]');
	if (!form || !gear || !travelField || !transitionField || !css) return;

	const isNative = demo.dataset.scrollPosition === 'sticky-panels';
	const isScrollDriven = demo.dataset.scrollPosition === 'scroll-driven';
	const isPin = demo.dataset.scrollPosition === 'pin';
	const continuous = demo.querySelector('[data-scroll-position-transition-control] [data-scroll-position-choice="on"]');
	const screenHeight = '--scroll-position-demo-screen-height';
	const scrollLength = '--scroll-position-demo-scroll-length';
	const pauseLength = '--scroll-position-demo-pause-length';
	let pause = 100;
	let travel = 200;
	let readoutFrame = 0;
	const updateReadout = () => {
		readoutFrame = 0;
		const lengths = [
			'.scroll-position-demo {',
			`  ${screenHeight}: max(100svh, 15rem);`,
			`  ${pauseLength}: ${pause / 100};`,
			...(!isNative ? [`  ${scrollLength}: ${travel / 100};`] : []),
			'}',
		];
		const rules = isNative ? [
			'/* Contenedor de cada panel */',
			'.scroll-position-demo__panel--track {',
			`  min-height: calc(var(${screenHeight}) * (1 + var(${pauseLength}, 1)));`,
			`  /* ${travel}svh si 100svh ≥ 15rem */`,
			'}',
			'',
			'.scroll-position-demo__panel-inner--sticky {',
			'  position: sticky;',
			'  top: 0;',
			`  min-height: var(${screenHeight});`,
			'}',
		] : [
			...(!isPin ? ['/* Marco compartido */', '.scroll-position-demo__slot {', '  position: sticky;', '  top: 0;', '}', ''] : []),
			'.scroll-position-demo__beat[data-scroll-position-cut] {',
			`  min-height: calc(var(${screenHeight}) * var(${scrollLength}, 1));`,
			`  /* A–D: ${travel}svh si 100svh ≥ 15rem */`,
			'}',
			'',
			'.scroll-position-demo__beat--last-panel {',
			`  ${scrollLength}: var(${pauseLength}, 1);`,
			`  /* E: ${pause}svh si 100svh ≥ 15rem */`,
			'}',
		];
		const timeline = isScrollDriven ? [
			'',
			'.scroll-position-demo__track {',
			'  view-timeline-name: --scroll-position-panels;',
			'}',
			'',
			'/* Salida de A y entrada de B */',
			'animation-timeline: --scroll-position-panels;',
			`animation-timing-function: ${continuous?.getAttribute('aria-pressed') === 'true' ? 'linear' : 'step-end'};`,
			`animation-range: contain calc(max(100svh, 15rem) * ${pause / 100})`,
			`                 contain calc(max(100svh, 15rem) * ${travel / 100});`,
		] : [];
		css.textContent = [...lengths, '', ...rules, ...timeline].join('\n');

		if (!js) return;
		const transitionCode = [
			`const transitionEnabled = ${continuous?.getAttribute('aria-pressed') === 'true'};`,
			`const hold = ${pause} / ${travel}; // Pausa / recorrido`,
			'const transitionDistance = distance * (1 - hold);',
			'const progress = transitionEnabled && transitionDistance > 0',
			'  ? gsap.utils.clamp(0, 1, (-current - distance * hold) / transitionDistance)',
			'  : 0;',
		];
		const pin = isPin && ScrollTrigger.getAll().find((trigger) => trigger.pin === stage);
		js.textContent = (pin ? [
			'ScrollTrigger.create({',
			'  trigger: track,',
			`  start: "${pin.vars.start}",`,
			'  endTrigger: release, // Después de E',
			`  end: "${pin.vars.end}",`,
			'  pin: stage,',
			`  pinSpacing: ${pin.vars.pinSpacing},`,
			'});',
			'',
			...transitionCode,
		] : transitionCode).join('\n');
	};
	const scheduleReadout = () => {
		if (!readoutFrame) readoutFrame = requestAnimationFrame(updateReadout);
	};

	const dispose = bindScrollPositionSettings(form, gear, 'wortise:scroll-position-demo:panel-settings', (settings) => {
		pause = Number(settings.pause);
		const transition = Number(settings.transition ?? transitionField.value);
		travel = pause + transition;
		travelField.value = String(travel);
		demo.style.setProperty(scrollLength, String(travel / 100));
		demo.style.setProperty(pauseLength, String(pause / 100));
		onHold?.(pause / travel);
		scheduleReadout();
	});
	if (dispose) {
		cleanups.push(() => {
			cancelAnimationFrame(readoutFrame);
			dispose();
			demo.style.removeProperty(scrollLength);
			demo.style.removeProperty(pauseLength);
		});
		return scheduleReadout;
	}
}

if (demo) gsap.registerPlugin(ScrollTrigger);

let hold = 0;
let transitionEnabled = false;
let scheduleScrub: (() => void) | undefined;
const isScrollDriven = demo?.dataset.scrollPosition === 'scroll-driven';
const hasScrollTimeline = isScrollDriven && CSS.supports('view-timeline-name', '--scroll-position-panels')
	&& CSS.supports('animation-range', 'contain 1px contain 2px');
if (demo && track && stage && rail && release && state && !isScrollDriven) {
	const isPin = demo.dataset.scrollPosition === 'pin';

	let frame = 0;
	let active = -1;
	let entering: HTMLElement | undefined;
	let lastProgress = -1;
	let geometry: { start: number; end: number; positions: number[] } | undefined;
	const update = () => {
		frame = 0;
		const scroll = window.scrollY;
		if (!geometry) {
			const bounds = track.getBoundingClientRect();
			const end = isPin ? release.getBoundingClientRect().top : bounds.bottom - stage.offsetHeight;
			geometry = {
				start: scroll + bounds.top,
				end: scroll + end,
				positions: cuts.map((cut) => scroll + cut.getBoundingClientRect().top),
			};
		}
		const { start, end, positions } = geometry;
		const index = Math.max(0, positions.findLastIndex((position) => Math.round(position - scroll) <= 0));
		if (index !== active) {
			const previous = panels[active];
			if (previous) {
				previous.removeAttribute('data-active');
				previous.style.removeProperty('transform');
				previous.inert = true;
			}
			panels[index].setAttribute('data-active', '');
			panels[index].inert = false;
			active = index;
			lastProgress = -1;
		}

		const current = positions[index] - scroll;
		const next = positions[index + 1];
		const distance = next === undefined ? 0 : next - positions[index];
		const transitionDistance = distance * (1 - hold);
		const progress = transitionEnabled && transitionDistance > 0
			? gsap.utils.clamp(0, 1, (-current - distance * hold) / transitionDistance)
			: 0;
		if (progress !== lastProgress) {
			const nextEntering = progress > 0 ? panels[index + 1] : undefined;
			if (nextEntering !== entering) {
				entering?.removeAttribute('data-entering');
				entering?.style.removeProperty('transform');
				entering = nextEntering;
				entering?.setAttribute('data-entering', '');
			}
			const panel = panels[index];
			if (entering) {
				panel.style.transform = `translateY(${-progress * 100}%)`;
				entering.style.transform = `translateY(${(1 - progress) * 100}%)`;
			} else {
				panel.style.removeProperty('transform');
			}
			lastProgress = progress;
		}

		const held = scroll >= start && scroll < end;
		const label = scroll < start ? 'La escena se fija al llegar arriba'
			: held ? 'Escena fijada'
			: isPin ? 'Escena liberada dentro de la sección' : 'Escena liberada al final del contenedor';
		if (state.textContent !== label) state.textContent = label;
		track.toggleAttribute('data-scene-held', held);
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	const invalidate = () => {
		geometry = undefined;
		schedule();
	};

	rail.hidden = false;
	state.hidden = false;
	panels.forEach((panel) => { panel.inert = true; });
	track.setAttribute('data-enhanced', '');

	const scheduleReadout = bindPanelSettings(demo, (value) => {
		hold = value;
		invalidate();
	});

	let pin: ScrollTrigger | undefined;
	if (isPin) {
		pin = ScrollTrigger.create({
			trigger: track,
			start: 'top top',
			endTrigger: release,
			end: 'top top',
			pin: stage,
			pinSpacing: false,
		});
	}
	bindOption(demo.querySelector<HTMLElement>('[data-scroll-position-transition-control]'), 'transition',
		!matchMedia('(prefers-reduced-motion: reduce)').matches, (enabled) => {
			transitionEnabled = enabled;
			schedule();
			scheduleReadout?.();
			scheduleScrub?.();
		});
	if (navigator.maxTouchPoints > 0) {
		const setNormalized = (enabled: boolean) => {
			if (enabled === demo.hasAttribute('data-scroll-position-normalized')) return;
			demo.toggleAttribute('data-scroll-position-normalized', enabled);
			if (enabled) {
				const { style } = document.documentElement;
				const behavior = style.getPropertyValue('scroll-behavior');
				const priority = style.getPropertyPriority('scroll-behavior');
				ScrollTrigger.normalizeScroll({ type: 'touch', allowNestedScroll: true });
				// Keep the temporary scroll-behavior in CSS so Snap can still manage its inline value.
				style.setProperty('scroll-behavior', behavior === 'smooth' ? '' : behavior, priority);
			} else {
				ScrollTrigger.normalizeScroll(false);
			}
		};
		bindOption(demo.querySelector<HTMLElement>('[data-scroll-position-normalize-control]'), 'normalize', false, setNormalized);
		cleanups.push(() => setNormalized(false));
	}
	const observer = new ResizeObserver(invalidate);
	observer.observe(track);
	observer.observe(stage);
	if (demo.firstElementChild) observer.observe(demo.firstElementChild);
	ScrollTrigger.addEventListener('refresh', invalidate);
	invalidate();
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', invalidate);
	cleanups.push(() => {
		cancelAnimationFrame(frame);
		observer.disconnect();
		ScrollTrigger.removeEventListener('refresh', invalidate);
		window.removeEventListener('scroll', schedule);
		window.removeEventListener('resize', invalidate);
		pin?.kill();
		panels.forEach((panel) => {
			panel.removeAttribute('data-active');
			panel.removeAttribute('data-entering');
			panel.style.removeProperty('transform');
			panel.inert = false;
		});
		track.removeAttribute('data-enhanced');
		track.removeAttribute('data-scene-held');
		rail.hidden = true;
		state.hidden = true;
	});
}

if (demo && track) {
	if (demo.dataset.scrollPosition === 'sticky-panels') bindPanelSettings(demo);
	if (isScrollDriven) {
		const control = demo.querySelector<HTMLElement>('[data-scroll-position-transition-control]');
		if (hasScrollTimeline) {
			const scheduleReadout = bindPanelSettings(demo, (value) => { hold = value; });
			bindOption(control, 'transition', !matchMedia('(prefers-reduced-motion: reduce)').matches, (enabled) => {
				transitionEnabled = enabled;
				demo.setAttribute('data-scroll-position-cut-direct', String(!enabled));
				scheduleReadout?.();
				scheduleScrub?.();
			});
			cleanups.push(() => demo.removeAttribute('data-scroll-position-cut-direct'));
		} else if (control) {
			const cut = control.querySelector<HTMLButtonElement>('[data-scroll-position-choice="off"]');
			if (cut) cut.disabled = true;
			control.hidden = false;
		}
	}
	const enhanced = hasScrollTimeline || track.hasAttribute('data-enhanced');
	const stops = enhanced ? cuts : panels;
	const disposeSnap = mountScrollPositionSnap(demo, stops);
	if (disposeSnap) cleanups.push(disposeSnap);

	const scrub = mountScrollPositionScrub(demo, stops, {
		endPosition: () => {
			if (demo.dataset.scrollPosition === 'pin' && release) return release.getBoundingClientRect().top;
			return track.getBoundingClientRect().bottom - (enhanced ? stage?.offsetHeight ?? 0 : 0);
		},
		sharedStage: enhanced ? stage : undefined,
		supportsCssScrub: hasScrollTimeline,
		holdRatio: () => transitionEnabled ? hold : 1,
	});
	if (scrub) {
		scheduleScrub = scrub.schedule;
		cleanups.push(scrub.dispose);
	}
}

import.meta.hot?.dispose(() => cleanups.reverse().forEach((cleanup) => cleanup()));
