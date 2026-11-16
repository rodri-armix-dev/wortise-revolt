import gsap from 'gsap';

const media = gsap.matchMedia();

media.add('(prefers-reduced-motion: no-preference)', () => {
	const cleanups: (() => void)[] = [];

	for (const list of document.querySelectorAll<HTMLElement>('[data-about-timeline]')) {
		const dots = Array.from(list.querySelectorAll<HTMLElement>('[data-about-timeline-dot]'));
		const first = dots.at(0);
		const lastDescription = list.querySelector('.about-timeline__item:last-child .about-timeline__description');
		if (!first || !lastDescription) continue;

		let frame: number | undefined;

		function update() {
			frame = undefined;
			const start = first!.getBoundingClientRect();
			const end = lastDescription!.getBoundingClientRect().bottom;
			const trigger = window.innerHeight * 0.65;
			const startCenter = start.top + start.height / 2;
			const endInset = parseFloat(getComputedStyle(list).getPropertyValue('--spacing-8'));
			const distance = Math.max(0, end - endInset - startCenter);
			const progress = distance > 0 ? gsap.utils.clamp(0, 1, (trigger - startCenter) / distance) : 0;

			list.toggleAttribute('data-incomplete', progress < 1);
			list.style.setProperty('--about-timeline-progress', String(progress));
			list.style.setProperty('--about-timeline-track-height', `${distance}px`);
			for (const dot of dots) {
				const bounds = dot.getBoundingClientRect();
				dot.toggleAttribute('data-active', bounds.top + bounds.height / 2 <= trigger);
			}
		}

		function scheduleUpdate() {
			frame ??= window.requestAnimationFrame(update);
		}

		const observer = new ResizeObserver(scheduleUpdate);
		observer.observe(list);
		window.addEventListener('resize', scheduleUpdate);
		window.addEventListener('scroll', scheduleUpdate, { passive: true });
		update();

		cleanups.push(() => {
			observer.disconnect();
			window.removeEventListener('resize', scheduleUpdate);
			window.removeEventListener('scroll', scheduleUpdate);
			if (frame !== undefined) window.cancelAnimationFrame(frame);
			list.removeAttribute('data-incomplete');
			list.style.removeProperty('--about-timeline-progress');
			list.style.removeProperty('--about-timeline-track-height');
			dots.forEach((dot) => dot.removeAttribute('data-active'));
		});
	}

	return () => cleanups.forEach((cleanup) => cleanup());
});

if (import.meta.hot) import.meta.hot.dispose(() => media.revert());
