class GlassSurface extends HTMLElement {
	private resizeObserver?: ResizeObserver;

	connectedCallback() {
		const scene = this.closest('[data-glass-scene]');
		const source = scene?.querySelector<HTMLElement>('[data-glass-source]');
		const refraction = this.querySelector<HTMLElement>('.glass-surface__refraction');
		const backdrop = this.querySelector<HTMLElement>('.glass-surface__backdrop');
		if (!scene || !source || !refraction || !backdrop) return;

		const align = () => {
			const bounds = source.getBoundingClientRect();
			const lens = refraction.getBoundingClientRect();
			backdrop.style.width = `${bounds.width}px`;
			backdrop.style.height = `${bounds.height}px`;
			backdrop.style.transform = `translate(${bounds.left - lens.left}px, ${bounds.top - lens.top}px)`;
			this.dataset.aligned = '';
		};

		align();
		this.resizeObserver = new ResizeObserver(align);
		this.resizeObserver.observe(source);
		this.resizeObserver.observe(refraction);
	}

	disconnectedCallback() {
		this.resizeObserver?.disconnect();
	}
}

if (!customElements.get('glass-surface')) {
	customElements.define('glass-surface', GlassSurface);
}
