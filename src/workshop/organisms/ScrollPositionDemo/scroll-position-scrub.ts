import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { bindScrollPositionSettings } from './scroll-position-settings';

export function mountScrollPositionScrub(
	demo: HTMLElement,
	stops: HTMLElement[],
	{ endPosition, sharedStage, supportsCssScrub, holdRatio }: {
		endPosition: () => number;
		sharedStage?: HTMLElement | null;
		supportsCssScrub: boolean;
		holdRatio: () => number;
	},
) {
	const control = demo.querySelector<HTMLElement>('[data-scroll-position-scrub-control]');
	const form = demo.querySelector<HTMLFormElement>('[data-scroll-position-scrub-settings]');
	const gear = demo.querySelector<HTMLButtonElement>('[data-scroll-position-scrub-gear]');
	const entryField = demo.querySelector<HTMLInputElement>('#scroll-position-scrub-entry');
	const holdField = demo.querySelector<HTMLInputElement>('#scroll-position-scrub-hold');
	const exitField = demo.querySelector<HTMLInputElement>('#scroll-position-scrub-exit');
	const bars = [...demo.querySelectorAll<HTMLElement>('[data-scroll-position-progress]')].flatMap((bar) => {
		const fill = bar.firstElementChild;
		return fill ? [{ bar, fill, progress: -1, entryEnd: -1, holdEnd: -1 }] : [];
	});
	if (!control || !form || !gear || !entryField || !holdField || !exitField || bars.length < 2 || bars.length !== stops.length) return;

	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
	const format = new Intl.NumberFormat(document.documentElement.lang || undefined, { maximumFractionDigits: 1, style: 'percent' });
	const isStickyPerPanel = demo.dataset.scrollPosition === 'sticky-panels';
	const unfilled = '--scroll-position-demo-unfilled';
	let mode = 'off';
	let smoothing = 0;
	let frame = 0;
	let phaseLengths = '';
	const update = () => {
		frame = 0;
		const positions = stops.map((stop) => stop.getBoundingClientRect().top);
		positions.push(endPosition());
		const sharedHeight = sharedStage?.offsetHeight ?? 0;
		const share = holdRatio();
		const exits = stops.map((stop, index) => {
			const start = positions[index];
			const end = positions[index + 1];
			if (sharedStage) return index === stops.length - 1 ? end : start + (end - start) * share;
			if (isStickyPerPanel) return end - (stop.firstElementChild?.getBoundingClientRect().height ?? 0);
			return start;
		});
		// B has both a preceding and a following panel, so it illustrates the ordinary phase boundaries.
		const reference = isStickyPerPanel ? stops[1].firstElementChild : stops[1];
		const panelHeight = sharedHeight || reference?.getBoundingClientRect().height || 1;
		const lengths = [positions[1] - exits[0], exits[1] - positions[1], positions[2] - exits[1]];
		const nextLengths = [panelHeight, ...lengths].join(',');
		if (nextLengths !== phaseLengths) {
			phaseLengths = nextLengths;
			[entryField, holdField, exitField].forEach((field, index) => {
				field.value = format.format(Math.max(0, lengths[index]) / panelHeight);
			});
		}
		if (mode === 'off') return;

		bars.forEach((entry, index) => {
			const start = index === 0 ? Math.max(-scrollY, positions[0] - innerHeight) : exits[index - 1];
			const end = positions[index + 1] + (index === stops.length - 1 ? sharedHeight : 0);
			const distance = end - start;
			const fraction = (position: number) => distance > 0 ? gsap.utils.clamp(0, 1, (position - start) / distance) : 0;
			const entryEnd = fraction(positions[index]);
			const holdEnd = fraction(exits[index]);
			if (entryEnd !== entry.entryEnd || holdEnd !== entry.holdEnd) {
				entry.entryEnd = entryEnd;
				entry.holdEnd = holdEnd;
				entry.bar.style.setProperty('--scroll-position-demo-entry-end', `${entryEnd * 100}%`);
				entry.bar.style.setProperty('--scroll-position-demo-hold-end', `${holdEnd * 100}%`);
			}

			if (mode === 'css') {
				entry.bar.style.setProperty('--scroll-position-demo-scrub-start', `${start - positions[0]}px`);
				entry.bar.style.setProperty('--scroll-position-demo-scrub-end', `${end - positions[0]}px`);
				return;
			}

			const progress = distance > 0 ? fraction(0) : Number(start <= 0);
			if (progress === entry.progress) return;

			const duration = entry.progress < 0 || reducedMotion.matches ? 0 : smoothing;
			entry.progress = progress;
			entry.bar.toggleAttribute('data-scrub-in-progress', progress > 0 && progress < 1);
			entry.bar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
			const remaining = `${(1 - progress) * 100}%`;
			if (duration) {
				gsap.to(entry.fill, { [unfilled]: remaining, duration, ease: 'power3.out', overwrite: true });
			} else {
				gsap.set(entry.fill, { [unfilled]: remaining, overwrite: true });
			}
		});
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	const onScroll = () => {
		if (mode === 'on') schedule();
	};
	const resetProgress = () => {
		for (const entry of bars) {
			gsap.killTweensOf(entry.fill);
			entry.bar.removeAttribute('data-scrub-in-progress');
			entry.progress = -1;
		}
		schedule();
	};
	const disposeSettings = bindScrollPositionSettings(form, gear, 'wortise:scroll-position-demo:scrub-settings', (settings) => {
		smoothing = Number(settings.smoothing) / 1000;
		resetProgress();
	});
	if (!disposeSettings) return;

	const storageKey = 'wortise:scroll-position-demo:scrub';
	const options = [...control.querySelectorAll<HTMLButtonElement>('[data-scroll-position-choice]')];
	const cssOption = options.find((option) => option.dataset.scrollPositionChoice === 'css');
	if (cssOption) cssOption.hidden = !supportsCssScrub;
	const select = (value: string) => {
		mode = value;
		const css = mode === 'css';
		demo.toggleAttribute('data-scroll-position-css-scrub', css);
		gear.disabled = css;
		if (css) {
			form.hidden = true;
			gear.setAttribute('aria-expanded', 'false');
		}
		for (const { bar } of bars) {
			bar.hidden = mode === 'off';
			// CSS animates the visual indicator independently of per-frame accessibility updates.
			if (css) bar.setAttribute('aria-hidden', 'true');
			else bar.removeAttribute('aria-hidden');
		}
		for (const option of options) {
			option.setAttribute('aria-pressed', String(option.dataset.scrollPositionChoice === mode));
		}
		resetProgress();
	};
	const onClick = (event: MouseEvent) => {
		const selected = (event.currentTarget as HTMLButtonElement).dataset.scrollPositionChoice;
		if (!selected || (selected === 'css' && !supportsCssScrub)) return;
		select(selected);
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
		// Use direct JavaScript progress when storage is unavailable.
	}
	options.forEach((option) => option.addEventListener('click', onClick));
	select(saved === 'css' && supportsCssScrub ? 'css' : saved === 'false' ? 'off' : 'on');
	control.hidden = false;

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', schedule);
	reducedMotion.addEventListener('change', resetProgress);
	ScrollTrigger.addEventListener('refresh', schedule);

	return {
		schedule,
		dispose: () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', schedule);
			reducedMotion.removeEventListener('change', resetProgress);
			ScrollTrigger.removeEventListener('refresh', schedule);
			options.forEach((option) => option.removeEventListener('click', onClick));
			select('off');
			cancelAnimationFrame(frame);
			if (cssOption) cssOption.hidden = true;
			control.hidden = true;
			disposeSettings();
		},
	};
}
