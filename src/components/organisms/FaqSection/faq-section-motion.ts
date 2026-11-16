const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cleanup = new AbortController();

if (typeof HTMLElement.prototype.animate === 'function') {
	for (const group of document.querySelectorAll('.faq-section__items')) {
		const items = [...group.querySelectorAll<HTMLDetailsElement>('.faq-section__item')];
		const animations = new Map<HTMLDetailsElement, Animation>();
		let active = items.find((item) => item.open);

		function setOpen(item: HTMLDetailsElement, open: boolean) {
			const start = item.getBoundingClientRect().height;
			animations.get(item)?.cancel();
			animations.delete(item);

			item.toggleAttribute('data-closing', !open);
			item.open = open;
			const end = item.getBoundingClientRect().height;
			item.open = true;

			if (reducedMotion.matches || start === end) {
				item.open = open;
				item.removeAttribute('data-closing');
				item.removeAttribute('data-animating');
				return;
			}

			item.setAttribute('data-animating', '');
			const animation = item.animate(
				[{ height: `${start}px` }, { height: `${end}px` }],
				{ duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
			);
			animations.set(item, animation);

			animation.onfinish = () => {
				item.open = open;
				item.removeAttribute('data-closing');
				item.removeAttribute('data-animating');
				animations.delete(item);
			};
		}

		// Keep the native group in HTML. With motion, the outgoing item needs
		// to stay open while it collapses alongside the incoming item.
		for (const item of items) item.removeAttribute('name');

		group.addEventListener('click', (event) => {
			if (!(event.target instanceof Element)) return;
			const summary = event.target.closest('.faq-section__question');
			const item = summary?.parentElement;
			if (!(item instanceof HTMLDetailsElement) || item.parentElement !== group) return;

			event.preventDefault();
			const previous = active;
			active = previous === item ? undefined : item;
			if (previous) setOpen(previous, false);
			if (active) setOpen(active, true);
		}, { signal: cleanup.signal });

		reducedMotion.addEventListener('change', () => {
			if (reducedMotion.matches) animations.forEach((animation) => animation.finish());
		}, { signal: cleanup.signal });

		cleanup.signal.addEventListener('abort', () => {
			for (const item of items) {
				animations.get(item)?.cancel();
				item.open = item === active;
				item.removeAttribute('data-closing');
				item.removeAttribute('data-animating');
				item.setAttribute('name', group.closest('section')!.id);
			}
		}, { once: true });
	}
}

if (import.meta.hot) import.meta.hot.dispose(() => cleanup.abort());
