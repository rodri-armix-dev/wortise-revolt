const track = document.querySelector('[data-ads-scroll-track]');

if (track) {
	const events = new AbortController();
	const options = { passive: true, signal: events.signal };
	let touchY: number | undefined;

	const setDirection = (delta: number) => {
		if (delta !== 0) track.toggleAttribute('data-ads-snap-suspended', delta < 0);
	};

	window.addEventListener('wheel', (event) => {
		if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
		const firstUpwardTick = event.deltaY < 0 && event.cancelable && !track.hasAttribute('data-ads-snap-suspended');
		const viewportStyle = firstUpwardTick ? window.getComputedStyle(document.documentElement) : undefined;
		const releaseSnap = viewportStyle && viewportStyle.scrollSnapType !== 'none';
		setDirection(event.deltaY);
		if (!releaseSnap) return;

		// Native wheel scrolling can still snap on the tick that disables snap.
		const unit = event.deltaMode === WheelEvent.DOM_DELTA_PAGE
			? document.documentElement.clientHeight
			: event.deltaMode === WheelEvent.DOM_DELTA_LINE ? Number.parseFloat(viewportStyle.fontSize) : 1;
		event.preventDefault();
		window.scrollBy({ top: event.deltaY * unit, behavior: 'instant' });
	}, { passive: false, signal: events.signal });

	window.addEventListener('keydown', (event) => {
		if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
		if (event.target instanceof Element && event.target.closest('a, button, input, textarea, select, summary, [contenteditable]')) return;

		if (['ArrowUp', 'PageUp', 'Home'].includes(event.key) || (event.key === ' ' && event.shiftKey)) {
			setDirection(-1);
		} else if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) {
			setDirection(1);
		}
	}, options);

	window.addEventListener('touchstart', (event) => {
		touchY = event.touches.length === 1 ? event.touches[0].clientY : undefined;
	}, options);

	window.addEventListener('touchmove', (event) => {
		if (touchY === undefined || event.touches.length !== 1) return;
		const nextY = event.touches[0].clientY;
		setDirection(touchY - nextY);
		touchY = nextY;
	}, options);

	import.meta.hot?.dispose(() => {
		events.abort();
		track.removeAttribute('data-ads-snap-suspended');
	});
}
