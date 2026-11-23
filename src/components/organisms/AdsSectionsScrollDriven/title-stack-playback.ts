for (const track of document.querySelectorAll<HTMLElement>('[data-ads-scroll-track]')) {
	if (!('IntersectionObserver' in window)) continue;

	const panels = [...track.querySelectorAll<HTMLElement>('.ads-scroll__panel')];
	const markers = [...track.querySelectorAll<HTMLElement>('[data-ads-stack-marker]')];
	let observer: IntersectionObserver;

	const observe = () => {
		observer?.disconnect();
		const height = document.documentElement.clientHeight;
		observer = new IntersectionObserver((_, source) => {
			if (source !== observer) return;

			// Read the markers together so a fast scroll can skip several panels.
			const active = markers.findLastIndex((marker) => {
				const rect = marker.getBoundingClientRect();
				return rect.height > 0 && rect.top <= 1;
			});

			track.toggleAttribute('data-ads-snap-active', active >= 0 && active < markers.length - 1);

			for (const [index, panel] of panels.entries()) {
				panel.dataset.stackState = index < active ? 'past' : index === active ? 'current' : 'pending';
			}
		}, { rootMargin: `0px 0px ${1 - height}px 0px` });
		for (const marker of markers) observer.observe(marker);
	};

	observe();
	window.addEventListener('resize', observe);

	import.meta.hot?.dispose(() => {
		observer.disconnect();
		window.removeEventListener('resize', observe);
		track.removeAttribute('data-ads-snap-active');
		for (const panel of panels) panel.removeAttribute('data-stack-state');
	});
}
