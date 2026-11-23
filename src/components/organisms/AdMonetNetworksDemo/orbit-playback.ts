for (const track of document.querySelectorAll<HTMLElement>('.networks-scroll__track')) {
	const marker = track.querySelector('[data-orbit-marker]');
	const upperMarker = track.querySelector('[data-orbit-upper-marker]');
	if (!marker || !upperMarker || !('IntersectionObserver' in window)) continue;

	let observer: IntersectionObserver | undefined;
	let lastScroll = window.scrollY;
	let viewportHeight = 0;
	track.dataset.orbitPlayback = 'waiting';

	function armUpperExit(length?: number) {
		if (length !== undefined) track.style.setProperty('--networks-particle-upper-exit-length', `${Math.max(1, length)}px`);
		track.setAttribute('data-orbit-upper-exit', '');
		window.removeEventListener('scroll', watchUpperDirection);
	}

	const watchUpperDirection = () => {
		const scroll = window.scrollY;
		if (scroll < lastScroll) {
			// Start a partial exit at the point where the user turned back.
			armUpperExit(lastScroll - scroll - upperMarker.getBoundingClientRect().top);
		}
		lastScroll = scroll;
	};

	const observe = () => {
		const height = document.documentElement.clientHeight;
		if (height === viewportHeight) return;
		viewportHeight = height;
		observer?.disconnect();

		// The marker crosses a one-pixel strip at the top of the viewport.
		observer = new IntersectionObserver((entries, source) => {
			if (source !== observer) return;
			const visible = entries.find(({ target }) => target === marker);
			if (visible?.isIntersecting && visible.boundingClientRect.height > 0) {
				track.dataset.orbitPlayback = 'visible';
			} else if (visible && visible.boundingClientRect.top > 1) {
				track.dataset.orbitPlayback = 'waiting';
				track.removeAttribute('data-orbit-upper-exit');
				track.style.removeProperty('--networks-particle-upper-exit-length');
			} else if (visible && track.dataset.orbitPlayback === 'visible') {
				track.dataset.orbitPlayback = 'hidden';
			}

			const upper = entries.find(({ target }) => target === upperMarker);
			if (!upper) return;
			if (upper.isIntersecting && upper.boundingClientRect.height > 0 && !track.hasAttribute('data-orbit-upper-exit')) {
				lastScroll = window.scrollY;
				window.addEventListener('scroll', watchUpperDirection, { passive: true });
			} else {
				window.removeEventListener('scroll', watchUpperDirection);
				if (upper.boundingClientRect.height > 0 && upper.boundingClientRect.bottom <= 1 && track.dataset.orbitPlayback !== 'waiting' && !track.hasAttribute('data-orbit-upper-exit')) armUpperExit();
			}
		}, { rootMargin: `0px 0px ${1 - height}px 0px` });
		observer.observe(marker);
		observer.observe(upperMarker);
	};

	observe();
	window.addEventListener('resize', observe);

	if (import.meta.hot) {
		import.meta.hot.dispose(() => {
			observer?.disconnect();
			window.removeEventListener('resize', observe);
			window.removeEventListener('scroll', watchUpperDirection);
			delete track.dataset.orbitPlayback;
			track.removeAttribute('data-orbit-upper-exit');
			track.style.removeProperty('--networks-particle-upper-exit-length');
		});
	}
}
