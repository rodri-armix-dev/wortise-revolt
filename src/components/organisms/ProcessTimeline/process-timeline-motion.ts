import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { mediaQueries } from '../../../../config/breakpoints';

gsap.registerPlugin(CustomEase);

function trackMobileProgress(track: HTMLElement, progress: HTMLElement) {
	const viewport = window.visualViewport;
	let frame: number | undefined;

	function update() {
		frame = undefined;
		const { top, height } = track.getBoundingClientRect();
		const viewportHeight = viewport?.height ?? window.innerHeight;
		const visibleTop = top - (viewport?.offsetTop ?? 0);
		const isVisible = visibleTop < viewportHeight && visibleTop + height > 0;
		const start = viewportHeight * 0.8;
		const distance = height + viewportHeight * 0.1;
		const ratio = isVisible ? gsap.utils.clamp(0, 1, (start - visibleTop) / distance) : 0;

		progress.style.setProperty('--process-timeline-progress', String(ratio));
	}

	function scheduleUpdate() {
		frame ??= window.requestAnimationFrame(update);
	}

	window.addEventListener('scroll', scheduleUpdate, { passive: true });
	window.addEventListener('resize', scheduleUpdate);
	viewport?.addEventListener('resize', scheduleUpdate);
	viewport?.addEventListener('scroll', scheduleUpdate);
	update();

	return () => {
		window.removeEventListener('scroll', scheduleUpdate);
		window.removeEventListener('resize', scheduleUpdate);
		viewport?.removeEventListener('resize', scheduleUpdate);
		viewport?.removeEventListener('scroll', scheduleUpdate);
		if (frame !== undefined) window.cancelAnimationFrame(frame);
		progress.style.removeProperty('--process-timeline-progress');
	};
}

const entrance = {
	opacity: 0,
	duration: 1.4,
	ease: CustomEase.create('process-timeline-entrance', '0.22, 1, 0.36, 1'),
	clearProps: 'opacity,transform',
};

const media = gsap.matchMedia();
media.add({
	desktop: mediaQueries.l,
	motionAllowed: '(prefers-reduced-motion: no-preference)',
}, (context) => {
	const { desktop, motionAllowed } = context.conditions ?? {};
	if (!motionAllowed) return;

	const cleanups: (() => void)[] = [];
	const animations = new Map<Element, gsap.core.Animation>();
	const visibilityThreshold = 0.15;
	const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
		for (const entry of entries) {
			const animation = animations.get(entry.target);
			if (desktop) {
				if (!entry.isIntersecting) animation?.pause(0);
				else if (entry.intersectionRatio >= visibilityThreshold) animation?.play();
				continue;
			}

			if (!entry.isIntersecting) continue;

			observer.unobserve(entry.target);
			animation?.play();
			animations.delete(entry.target);
		}
	}, { threshold: desktop ? [0, visibilityThreshold] : visibilityThreshold }) : undefined;

	for (const sequence of document.querySelectorAll('.process-timeline__sequence')) {
		const steps = sequence.querySelector('.process-timeline__steps');
		const track = sequence.querySelector<HTMLElement>('.process-timeline__track');
		const progress = sequence.querySelector<HTMLElement>('.process-timeline__progress');
		const cards = sequence.querySelectorAll('.process-timeline__card');
		if (!steps || !track || !progress || !cards.length) continue;

		if (desktop) {
			if (!observer) continue;

			const timeline = gsap.timeline({ paused: true })
				.from(cards, { ...entrance, y: 24, stagger: 0.7, immediateRender: true }, 0)
				.to(progress, { scaleX: 1, duration: 2.8, ease: 'power1.inOut' }, 0)
				.to(steps, { '--process-timeline-offset': '0px', duration: 1, ease: 'power1.inOut' }, 3.2);

			animations.set(sequence, timeline);
			observer.observe(sequence);
			continue;
		}

		cleanups.push(trackMobileProgress(track, progress));
		if (!observer) continue;

		for (const card of cards) {
			animations.set(card, gsap.from(card, { ...entrance, x: 24, paused: true }));
			observer.observe(card);
		}
	}

	return () => {
		observer?.disconnect();
		cleanups.forEach((cleanup) => cleanup());
	};
});

if (import.meta.hot) import.meta.hot.dispose(() => media.revert());
