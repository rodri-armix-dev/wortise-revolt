for (const track of document.querySelectorAll<HTMLElement>('[data-ads-scroll-track]')) {
	if (!('IntersectionObserver' in window)) continue;

	const panels = [...track.querySelectorAll<HTMLElement>('.ads-scroll__panel')];
	const markers = [...track.querySelectorAll<HTMLElement>('[data-ads-annotation-marker]')];
	const stackMarkers = track.querySelectorAll('[data-ads-stack-marker]');
	const markerPanels = new Map(markers.map((marker, index) => [marker, panels[index]] as const));
	const lastPanel = panels.at(-1);
	const lastMarker = markers.at(-1);
	let observer: IntersectionObserver;

	const observe = () => {
		observer?.disconnect();
		const height = document.documentElement.clientHeight;
		observer = new IntersectionObserver((entries, source) => {
			if (source !== observer) return;

			// A fast reverse scroll can cross the entire last pause between samples.
			const boundary = entries[0]?.rootBounds?.bottom ?? 1;
			if (lastPanel?.hasAttribute('data-content-held') && lastMarker && lastMarker.getBoundingClientRect().top > boundary) {
				lastPanel.removeAttribute('data-content-held');
			}

			for (const entry of entries) {
				const panel = markerPanels.get(entry.target as HTMLElement);
				if (!panel) continue;

				if (entry.isIntersecting && entry.boundingClientRect.height > 0) {
					panel.dataset.annotationPlayback = 'enter';
					panel.removeAttribute('data-content-held');
				} else if (panel.dataset.annotationPlayback === 'enter') {
					panel.dataset.annotationPlayback = 'exit';
					panel.toggleAttribute('data-content-held', panel === lastPanel && entry.boundingClientRect.bottom <= 0 && entry.boundingClientRect.height > 0);
				}
			}
		}, { rootMargin: `0px 0px ${1 - height}px 0px` });
		for (const marker of markers) observer.observe(marker);
		for (const marker of stackMarkers) observer.observe(marker);
	};

	track.setAttribute('data-annotation-observer', '');
	observe();
	window.addEventListener('resize', observe);

	import.meta.hot?.dispose(() => {
		observer.disconnect();
		window.removeEventListener('resize', observe);
		track.removeAttribute('data-annotation-observer');
		for (const panel of panels) {
			panel.removeAttribute('data-annotation-playback');
			panel.removeAttribute('data-content-held');
		}
	});
}
