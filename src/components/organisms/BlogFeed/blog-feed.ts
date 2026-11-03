class BlogFeed extends HTMLElement {
	private abort?: AbortController;
	private observer?: ResizeObserver;

	connectedCallback() {
		this.abort?.abort();
		this.abort = new AbortController();
		const signal = this.abort.signal;
		const list = this.querySelector<HTMLElement>('[data-feed-list]');
		const items = [...this.querySelectorAll<HTMLElement>('[data-feed-item]')];
		if (!list || !items.length) return;
		if (this.dataset.mode === 'stories') {
			const more = this.querySelector<HTMLElement>('[data-feed-more]');
			const button = more?.querySelector('button');
			if (!more || !button || items.length <= 6) return;
			let shown = 6;
			items.forEach((item, index) => { item.hidden = index >= shown; });
			more.hidden = false;
			button.addEventListener('click', () => {
				const first = items[shown];
				const previous = shown;
				shown = Math.min(shown + 6, items.length);
				items.forEach((item, index) => { item.hidden = index >= shown; });
				more.hidden = shown >= items.length;
				const status = this.querySelector<HTMLElement>('[data-feed-status]');
				if (status) status.textContent = (this.dataset.loadedLabel ?? '').replace('{count}', String(shown - previous));
				first?.querySelector('a')?.focus({ preventScroll: true });
			}, { signal });
			return;
		}
		const controls = this.querySelector<HTMLElement>('[data-feed-controls]');
		const buttons = [...this.querySelectorAll<HTMLButtonElement>('[data-feed-slide]')];
		if (!controls) return;
		controls.hidden = false;
		const update = () => {
			const start = list.getBoundingClientRect().left;
			let active = 0;
			let distance = Infinity;
			items.forEach((item, index) => {
				const current = Math.abs(item.getBoundingClientRect().left - start);
				if (current < distance) { distance = current; active = index; }
			});
			buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === active)));
		};
		buttons.forEach((button, index) => button.addEventListener('click', () => {
			const left = list.scrollLeft + items[index].getBoundingClientRect().left - list.getBoundingClientRect().left;
			list.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
		}, { signal }));
		list.addEventListener('scroll', update, { signal, passive: true });
		this.observer = new ResizeObserver(update);
		this.observer.observe(list);
		update();
	}

	disconnectedCallback() {
		this.abort?.abort();
		this.observer?.disconnect();
	}
}

if (!customElements.get('blog-feed')) customElements.define('blog-feed', BlogFeed);
