for (const panels of document.querySelectorAll<HTMLElement>('.ads-scroll__panels')) {
	const titles = [...panels.querySelectorAll<HTMLElement>('.ads-sections-item__title-card')];
	const contents = [...panels.querySelectorAll<HTMLElement>('.ads-sections-item__content')];

	if (!titles.length || !contents.length || !('ResizeObserver' in window)) continue;

	const update = () => {
		// Use layout heights so the entrance transforms never affect the reserved rows.
		panels.style.setProperty('--mobile-scroll-intro-row', `${Math.max(...titles.map((card) => card.offsetHeight))}px`);
		panels.style.setProperty('--mobile-scroll-content-row', `${Math.max(...contents.map((card) => card.offsetHeight))}px`);
	};
	const observer = new ResizeObserver(update);
	for (const card of [...titles, ...contents]) observer.observe(card);
	update();

	if (import.meta.hot) {
		import.meta.hot.dispose(() => {
			observer.disconnect();
			panels.style.removeProperty('--mobile-scroll-intro-row');
			panels.style.removeProperty('--mobile-scroll-content-row');
		});
	}
}
