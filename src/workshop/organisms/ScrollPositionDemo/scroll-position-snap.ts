import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { bindScrollPositionSettings } from './scroll-position-settings';

export function mountScrollPositionSnap(demo: HTMLElement, stops: HTMLElement[]) {
	const control = demo.querySelector<HTMLElement>('[data-scroll-position-snap-control]');
	const cssHelp = demo.querySelector<HTMLElement>('[data-scroll-position-css-snap-help]');
	const form = demo.querySelector<HTMLFormElement>('[data-scroll-position-snap-settings]');
	const gear = demo.querySelector<HTMLButtonElement>('[data-scroll-position-snap-gear]');
	const cssForm = demo.querySelector<HTMLFormElement>('#scroll-position-css-snap-settings');
	const cssGear = demo.querySelector<HTMLButtonElement>('[data-scroll-position-css-snap-gear]');
	const durationMode = form?.querySelector<HTMLSelectElement>('[name="durationMode"]');
	const minDuration = form?.querySelector<HTMLInputElement>('[name="minDuration"]');
	const maxDuration = form?.querySelector<HTMLInputElement>('[name="maxDuration"]');
	const start = form?.querySelector<HTMLSelectElement>('[name="start"]');
	const end = form?.querySelector<HTMLSelectElement>('[name="end"]');
	if (!control || !cssHelp || !form || !gear || !cssForm || !cssGear || !durationMode || !minDuration || !maxDuration || !start || !end || stops.length < 2) return;

	const durationFields = [...form.querySelectorAll<HTMLElement>('[data-snap-duration]')];

	const updateFields = () => {
		for (const field of durationFields) {
			field.hidden = field.dataset.snapDuration !== durationMode.value;
			field.querySelector('input')?.toggleAttribute('disabled', field.hidden);
		}
		maxDuration.setCustomValidity(durationMode.value === 'range' && maxDuration.valueAsNumber < minDuration.valueAsNumber
			? 'La duración máxima debe ser mayor o igual a la mínima.'
			: '');
		end.setCustomValidity(Number(end.value) <= Number(start.value)
			? 'El final del tramo debe quedar después del inicio.'
			: '');
	};

	let config: Record<string, string> = {};
	let snap: ScrollTrigger | undefined;
	let restoreScrollBehavior: (() => void) | undefined;
	const stopSnap = () => {
		snap?.kill();
		snap = undefined;
		restoreScrollBehavior?.();
		restoreScrollBehavior = undefined;
	};

	const setEnabled = (enabled: boolean) => {
		if (!enabled) {
			stopSnap();
			return;
		}
		if (snap) return;

		// ScrollTrigger sets inline scroll-behavior on the viewport for its snap tween.
		const viewport = [document.documentElement, document.body];
		const previous = viewport.map(({ style }) => ({
			value: style.getPropertyValue('scroll-behavior'),
			priority: style.getPropertyPriority('scroll-behavior'),
		}));
		restoreScrollBehavior = () => viewport.forEach(({ style }, index) => {
			const { value, priority } = previous[index];
			style.setProperty('scroll-behavior', value, priority);
		});

		const activeStops = stops.slice(Number(config.start), Number(config.end) + 1);
		const duration = config.durationMode === 'range'
			? { min: Number(config.minDuration) / 1000, max: Number(config.maxDuration) / 1000 }
			: Number(config.duration) / 1000;
		snap = ScrollTrigger.create({
			trigger: activeStops[0],
			start: 'top top',
			endTrigger: activeStops.at(-1),
			end: 'top top',
			snap: {
				delay: Math.max(.001, Number(config.delay) / 1000),
				duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? .01 : duration,
				ease: config.ease,
				inertia: config.inertia === 'on',
				snapTo: (progress, trigger) => {
					if (!trigger) return progress;
					const distance = trigger.end - trigger.start;
					const intermediate = config.destination === 'edges' ? [] : activeStops.slice(1, -1).map((stop) =>
						(stop.getBoundingClientRect().top + scrollY - trigger.start) / distance,
					);
					const points = [0, ...intermediate, 1];
					if (config.destination === 'midpoints') {
						const midpoints = points.slice(1).map((point, index) => (points[index] + point) / 2);
						points.push(...midpoints);
					}
					return config.direction === 'directional'
						? ScrollTrigger.snapDirectional(points)(progress, trigger.direction)
						: gsap.utils.snap(points, progress);
				},
			},
		});
	};

	const disposeSettings = bindScrollPositionSettings(form, gear, 'wortise:scroll-position-demo:snap-settings', (settings) => {
		config = settings;
		if (snap) {
			stopSnap();
			setEnabled(true);
		}
	}, updateFields);
	if (!disposeSettings) return;

	const viewportStyle = document.documentElement.style;
	let cssStrictness = 'proximity';
	const properties = [
		{ style: viewportStyle, name: '--scroll-position-demo-snap-strictness', field: 'strictness', unit: '' },
		{ style: viewportStyle, name: '--scroll-position-demo-snap-padding', field: 'padding', unit: 'px' },
		{ style: demo.style, name: '--scroll-position-demo-snap-align', field: 'align', unit: '' },
		{ style: demo.style, name: '--scroll-position-demo-snap-stop', field: 'stop', unit: '' },
		{ style: demo.style, name: '--scroll-position-demo-snap-margin', field: 'margin', unit: 'px' },
	];
	const disposeCssSettings = bindScrollPositionSettings(cssForm, cssGear, 'wortise:scroll-position-demo:css-snap-settings', (settings) => {
		cssStrictness = settings.strictness;
		if (demo.hasAttribute('data-scroll-position-css-snap')) demo.setAttribute('data-scroll-position-css-snap', cssStrictness);
		for (const { style, name, field, unit } of properties) {
			style.setProperty(name, settings[field] + unit);
		}
	});
	if (!disposeCssSettings) {
		disposeSettings();
		return;
	}

	const storageKey = 'wortise:scroll-position-demo:snap';
	const options = [...control.querySelectorAll<HTMLButtonElement>('[data-scroll-position-choice]')];
	const select = (mode: string) => {
		const css = mode === 'css';
		if (!css) demo.removeAttribute('data-scroll-position-css-snap');
		setEnabled(mode === 'on');
		if (css) {
			form.hidden = true;
			gear.setAttribute('aria-expanded', 'false');
		} else {
			cssForm.hidden = true;
			cssGear.setAttribute('aria-expanded', 'false');
		}
		if (css) demo.setAttribute('data-scroll-position-css-snap', cssStrictness);
		cssHelp.hidden = !css;
		gear.hidden = css;
		cssGear.hidden = !css;
		for (const option of options) {
			option.setAttribute('aria-pressed', String(option.dataset.scrollPositionChoice === mode));
		}
	};
	const onClick = (event: MouseEvent) => {
		const mode = (event.currentTarget as HTMLButtonElement).dataset.scrollPositionChoice ?? 'off';
		select(mode);
		try {
			sessionStorage.setItem(storageKey, mode === 'css' ? 'css' : String(mode === 'on'));
		} catch {
			// The selected mode still applies on the current page.
		}
	};
	let saved: string | null = null;
	try {
		saved = sessionStorage.getItem(storageKey);
	} catch {
		// Start without Snap when storage is unavailable.
	}

	stops.forEach((stop) => stop.setAttribute('data-scroll-position-snap-target', ''));
	options.forEach((option) => option.addEventListener('click', onClick));
	select(saved === 'css' ? 'css' : saved === 'true' ? 'on' : 'off');
	control.hidden = false;
	return () => {
		options.forEach((option) => option.removeEventListener('click', onClick));
		stops.forEach((stop) => stop.removeAttribute('data-scroll-position-snap-target'));
		demo.removeAttribute('data-scroll-position-css-snap');
		control.hidden = true;
		cssHelp.hidden = true;
		disposeCssSettings();
		for (const { style, name } of properties) style.removeProperty(name);
		disposeSettings();
		stopSnap();
	};
}
