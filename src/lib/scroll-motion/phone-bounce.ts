for (const track of document.querySelectorAll<HTMLElement>('[data-phone-bounce]')) {
	const appearance = track.querySelector('[data-bounce-marker="appearance"]');
	const wait = track.querySelector('[data-bounce-marker="wait"]');
	if (!appearance || !wait || !('IntersectionObserver' in window)) continue;

	let observer: IntersectionObserver | undefined;
	let viewportHeight = 0;
	let appearing = false;
	let waiting = false;
	let enteringFromAbove = false;

	const observe = () => {
		const height = document.documentElement.clientHeight;
		if (height === viewportHeight) return;
		viewportHeight = height;
		observer?.disconnect();

		// Sample the scroll position at the top edge of the viewport.
		observer = new IntersectionObserver((entries, source) => {
			if (source !== observer) return;
			for (const entry of entries) {
				const crossesTop = entry.isIntersecting && entry.boundingClientRect.height > 0;
				if (entry.target === appearance) {
					appearing = crossesTop;
					if (!appearing) {
						enteringFromAbove = entry.boundingClientRect.top >= (entry.rootBounds?.bottom ?? 1);
						// Let a bounce finish if a fast downward scroll leaves the entry window.
						if (enteringFromAbove) track.removeAttribute('data-bounce-played');
					}
				} else waiting = crossesTop;
			}

			if (appearing && waiting && enteringFromAbove) {
				enteringFromAbove = false;
				track.setAttribute('data-bounce-played', '');
			}
		}, { rootMargin: `0px 0px ${1 - height}px 0px` });

		observer.observe(appearance);
		observer.observe(wait);
	};

	observe();
	window.addEventListener('resize', observe);

	if (import.meta.hot) {
		import.meta.hot.dispose(() => {
			observer?.disconnect();
			window.removeEventListener('resize', observe);
			track.removeAttribute('data-bounce-played');
		});
	}
}
