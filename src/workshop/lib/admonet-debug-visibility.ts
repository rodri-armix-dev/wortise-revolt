const button = document.querySelector<HTMLButtonElement>('[data-networks-debug-toggle]');
const controls = document.getElementById('admonet-debug-tools');
const timeline = document.getElementById('admonet-debug-timeline');
const scrollRuler = document.getElementById('admonet-debug-scroll-progress');
const scrollProgress = scrollRuler?.querySelector<HTMLProgressElement>('[data-networks-scroll-progress]');
const storageKey = button?.dataset.networksDebugToggle;

if (button && scrollRuler && storageKey) {
	const update = (hidden: boolean) => {
		if (controls) controls.hidden = hidden;
		if (timeline) timeline.hidden = hidden;
		scrollRuler.hidden = hidden;
		button.setAttribute('aria-expanded', String(!hidden));
		button.textContent = hidden ? 'Mostrar debug' : 'Ocultar debug';
	};

	try {
		update(localStorage.getItem(storageKey) === 'true');
	} catch {
		update(false);
	}

	button.addEventListener('click', () => {
		const hidden = !scrollRuler.hidden;
		update(hidden);

		try {
			localStorage.setItem(storageKey, String(hidden));
		} catch {
			// Keep the current visibility if browser storage is unavailable.
		}
	});
}

if (scrollProgress) {
	const scroller = document.scrollingElement ?? document.documentElement;
	const markers = [...(scrollRuler?.querySelectorAll<HTMLElement>('[data-networks-snap-mark]') ?? [])];
	const ranges = [...(scrollRuler?.querySelectorAll<HTMLElement>('[data-networks-scroll-range]') ?? [])];
	const mode = document.querySelector<HTMLSelectElement>('[data-networks-mode]');
	const panels = document.querySelectorAll<HTMLElement>('[data-networks-overview], [data-networks-panel]');
	const track = document.querySelector<HTMLElement>('[data-networks-track]');
	const measure = document.querySelector<HTMLElement>('[data-networks-measure]');
	let marks: number[] = [];
	let measureMarks = true;

	let frame = 0;
	const updateScrollProgress = () => {
		frame = 0;
		const distance = scroller.scrollHeight - scroller.clientHeight;
		const position = scroller.scrollTop;
		scrollProgress.value = distance > 0 ? Math.max(0, Math.min(100, position / distance * 100)) : 0;
		if (measureMarks && markers.length) {
			measureMarks = false;
			if (mode?.value === 'stack') {
				marks = Array.from(panels, (panel) => position + panel.getBoundingClientRect().top - parseFloat(getComputedStyle(panel).scrollMarginBlockStart));
			} else if ((mode?.value === 'snap' || mode?.value === 'hybrid') && track?.closest('[data-networks-scroll]') && measure) {
				const start = Math.round(position + track.getBoundingClientRect().top);
				marks = markers.map((_, index) => start + measure.clientHeight * index);
			} else marks = [];
			markers.forEach((marker, index) => {
				const mark = marks[index];
				marker.hidden = mode?.value === 'hybrid' || mark === undefined || mark < 0 || mark > distance || distance <= 0;
				if (!marker.hidden) marker.style.left = `${mark / distance * 100}%`;
			});
			ranges.forEach((range, index) => {
				range.hidden = marks.length === 0 || distance <= 0;
				if (range.hidden || !measure) return;
				const center = marks[index];
				const start = index === 0 ? center : (marks[index - 1] + center) / 2;
				const end = index === marks.length - 1 ? center + measure.clientHeight : (center + marks[index + 1]) / 2;
				range.style.left = `${Math.max(0, start) / distance * 100}%`;
				range.style.width = `${Math.max(0, Math.min(distance, end) - Math.max(0, start)) / distance * 100}%`;
			});
		}

		let snapped = false;
		markers.forEach((marker, index) => {
			const active = !marker.hidden && Math.abs(position - marks[index]) <= 2;
			marker.toggleAttribute('data-active', active);
			snapped ||= active;
		});
		scrollProgress.toggleAttribute('data-snapped', snapped);
	};
	const scheduleScrollProgress = () => {
		if (!frame) frame = requestAnimationFrame(updateScrollProgress);
	};

	window.addEventListener('scroll', scheduleScrollProgress, { passive: true });
	const scheduleLayout = () => {
		measureMarks = true;
		scheduleScrollProgress();
	};
	window.addEventListener('resize', scheduleLayout);
	mode?.addEventListener('change', scheduleLayout);
	const observer = new ResizeObserver(scheduleLayout);
	observer.observe(document.body);
	updateScrollProgress();

	if (import.meta.hot) import.meta.hot.dispose(() => {
		window.removeEventListener('scroll', scheduleScrollProgress);
		window.removeEventListener('resize', scheduleLayout);
		mode?.removeEventListener('change', scheduleLayout);
		observer.disconnect();
		cancelAnimationFrame(frame);
	});
}
