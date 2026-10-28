class ImageCarousel extends HTMLElement {
	private cleanup?: () => void;

	connectedCallback() {
		if (this.cleanup) return;
		const viewport = this.querySelector<HTMLElement>('[data-carousel-viewport]');
		if (!viewport) return;

		const move = (direction: number) => {
			if (!this.dispatchEvent(new CustomEvent('carousel-step', { bubbles: true, cancelable: true, detail: direction }))) return;
			const cards = [...viewport.querySelectorAll<HTMLElement>('[data-gallery-item]')];
			const first = cards[0]?.getBoundingClientRect().left ?? 0;
			const positions = cards.map(card => card.getBoundingClientRect().left - first);
			const target = direction > 0
				? positions.find(position => position > viewport.scrollLeft + 2)
				: positions.reverse().find(position => position < viewport.scrollLeft - 2);
			viewport.scrollTo({ left: target ?? (direction > 0 ? viewport.scrollWidth : 0), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
		};
		const key = (event: KeyboardEvent) => {
			if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
			event.preventDefault();
			move(event.key === 'ArrowRight' ? 1 : -1);
		};
		viewport.addEventListener('keydown', key);
		this.cleanup = () => {
			viewport.removeEventListener('keydown', key);
		};
	}

	disconnectedCallback() {
		this.cleanup?.();
		this.cleanup = undefined;
	}
}

if (!customElements.get('image-carousel')) customElements.define('image-carousel', ImageCarousel);

if (import.meta.hot) {
	import.meta.hot.dispose(() => document.querySelectorAll<ImageCarousel>('image-carousel').forEach(element => element.disconnectedCallback()));
}
