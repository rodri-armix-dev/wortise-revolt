import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ImageGallery extends HTMLElement {
	private cleanup?: () => void;

	connectedCallback() {
		if (this.cleanup) return;
		const scene = this.querySelector<HTMLElement>('.image-gallery__carousel');
		const viewport = this.querySelector<HTMLElement>('[data-carousel-viewport]');
		const track = this.querySelector<HTMLElement>('[data-carousel-track]');
		if (!scene || !viewport || !track) return;
		const reduced = matchMedia('(prefers-reduced-motion: reduce)');
		let context: gsap.Context | undefined;
		let trigger: ScrollTrigger | undefined;
		let distance = 0;
		let frame = 0;
		let disposed = false;
		let ready = false;
		let geometry = '';

		const reset = () => {
			context?.revert();
			context = undefined;
			trigger = undefined;
			viewport.removeAttribute('data-carousel-pinned');
			scene.style.removeProperty('--image-carousel-will-change');
		};
		const measure = () => {
			frame = 0;
			if (disposed || !ready) return;
			distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
			const fits = viewport.offsetHeight <= innerHeight - 32;
			const enabled = !reduced.matches && fits && distance > 1;
			const nextGeometry = `${viewport.clientWidth}:${viewport.offsetHeight}:${distance}:${enabled}`;
			if (geometry === nextGeometry) return;
			geometry = nextGeometry;
			if (!enabled) {
				reset();
				return;
			}
			if (context) {
				ScrollTrigger.refresh();
				return;
			}
			viewport.scrollLeft = 0;
			viewport.setAttribute('data-carousel-pinned', '');
			context = gsap.context(() => {
				const tween = gsap.fromTo(scene, { '--image-carousel-offset': '0px' }, {
					'--image-carousel-offset': () => `${-distance}px`,
					ease: 'none',
					scrollTrigger: {
						trigger: scene,
						pin: scene,
						start: 'center center',
						end: () => `+=${distance}`,
						scrub: true,
						anticipatePin: this.classList.contains('image-gallery--office') ? 2 : 1,
						invalidateOnRefresh: true,
						onToggle: self => scene.style.setProperty('--image-carousel-will-change', self.isActive ? 'transform' : 'auto'),
					},
				});
				trigger = tween.scrollTrigger;
			}, scene);
		};
		const schedule = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(measure);
		};
		const step = (event: Event) => {
			if (!trigger) return;
			event.preventDefault();
			const direction = (event as CustomEvent<number>).detail;
			const cards = [...track.querySelectorAll<HTMLElement>('[data-gallery-item]')];
			const first = cards[0]?.offsetLeft ?? 0;
			const positions = cards.map(card => card.offsetLeft - first);
			const current = trigger.progress * distance;
			const target = direction > 0
				? positions.find(position => position > current + 2) ?? distance
				: positions.reverse().find(position => position < current - 2) ?? 0;
			window.scrollTo({ top: trigger.start + Math.max(0, Math.min(distance, target)), behavior: 'instant' });
		};
		const observer = new ResizeObserver(schedule);
		observer.observe(viewport);
		observer.observe(track);
		window.addEventListener('resize', schedule);
		reduced.addEventListener('change', schedule);
		this.addEventListener('carousel-step', step);
		void document.fonts.ready.then(() => {
			ready = true;
			measure();
		});
		this.cleanup = () => {
			disposed = true;
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener('resize', schedule);
			reduced.removeEventListener('change', schedule);
			this.removeEventListener('carousel-step', step);
			reset();
		};
	}

	disconnectedCallback() {
		this.cleanup?.();
		this.cleanup = undefined;
	}
}

if (!customElements.get('image-gallery')) customElements.define('image-gallery', ImageGallery);

if (import.meta.hot) {
	import.meta.hot.dispose(() => document.querySelectorAll<ImageGallery>('image-gallery').forEach(element => element.disconnectedCallback()));
}
