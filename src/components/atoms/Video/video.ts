const cleanups: (() => void)[] = [];

const cleanupVideos = () => cleanups.splice(0).forEach((cleanup) => cleanup());

function initializeVideos() {
	cleanupVideos();
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	for (const video of document.querySelectorAll<HTMLVideoElement>('video[data-viewport-autoplay]')) {
		let visible = false;
		let manuallyPaused = false;
		let automaticPause = false;

		const pause = () => {
			if (video.paused) return;
			automaticPause = true;
			video.pause();
		};
		const update = () => {
			if (!visible || document.hidden) {
				pause();
			} else if (!reducedMotion.matches && !manuallyPaused) {
				// Rejections (including browser autoplay policy) leave native controls available.
				void video.play().catch(() => {});
			}
		};
		const onPause = () => {
			if (!automaticPause && visible && !document.hidden) manuallyPaused = true;
			automaticPause = false;
		};
		const onPlay = () => {
			manuallyPaused = false;
			if (!visible || document.hidden) pause();
		};
		const onMotionChange = () => {
			if (reducedMotion.matches) pause();
			else update();
		};
		const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting && entry.intersectionRatio >= .25;
			update();
		}, { threshold: [0, .25] }) : undefined;

		// With no observer support, retain ordinary manual playback.
		if (!observer) continue;
		observer.observe(video);
		video.addEventListener('pause', onPause);
		video.addEventListener('play', onPlay);
		document.addEventListener('visibilitychange', update);
		reducedMotion.addEventListener('change', onMotionChange);
		cleanups.push(() => {
			observer.disconnect();
			video.removeEventListener('pause', onPause);
			video.removeEventListener('play', onPlay);
			document.removeEventListener('visibilitychange', update);
			reducedMotion.removeEventListener('change', onMotionChange);
			video.pause();
		});
	}
}

initializeVideos();
document.addEventListener('astro:page-load', initializeVideos);
document.addEventListener('astro:before-swap', cleanupVideos);

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		cleanupVideos();
		document.removeEventListener('astro:page-load', initializeVideos);
		document.removeEventListener('astro:before-swap', cleanupVideos);
	});
}
