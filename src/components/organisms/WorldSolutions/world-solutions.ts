import { mediaQueries } from '../../../../config/breakpoints';

type Projection = { id: string; x: number; y: number; visible: boolean };

class WorldSolutions extends HTMLElement {
	private controller?: AbortController;
	private resize?: ResizeObserver;
	private cardAnimations = new Map<HTMLElement, Animation>();

	connectedCallback() {
		this.controller?.abort();
		this.resize?.disconnect();
		this.cardAnimations.forEach((animation) => animation.cancel());
		this.cardAnimations.clear();
		this.controller = new AbortController();
		const { signal } = this.controller;
		const map = this.querySelector<HTMLElement>('[data-world-map]');
		const globe = this.querySelector<HTMLElement>('world-3d');
		const status = this.querySelector<HTMLElement>('[data-city-status]');
		const cards = [...this.querySelectorAll<HTMLElement>('[data-city-card]')];
		const locations = [...this.querySelectorAll<HTMLElement>('[data-location]')];
		if (!map || !globe || !cards.length) return;
		let selected = 0;
		let open = true;
		let globeReady = false;
		let awaitingCard: string | undefined;
		let projections: Projection[] = [];
		const desktop = matchMedia(mediaQueries.l);
		const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
		const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));
		const place = () => {
			const mapRect = map.getBoundingClientRect();
			const globeRect = globe.getBoundingClientRect();
			const offsetX = globeRect.left - mapRect.left;
			const offsetY = globeRect.top - mapRect.top;
			for (const projection of projections) {
				const location = locations.find((item) => item.dataset.location === projection.id);
				if (!location) continue;
				location.hidden = !projection.visible;
				const x = offsetX + projection.x * globeRect.width;
				const y = offsetY + projection.y * globeRect.height;
				location.style.left = `${x}px`;
				location.style.top = `${y}px`;
				const pill = location.querySelector<HTMLElement>('.world-solutions__pill');
				if (pill) {
					const half = pill.offsetWidth / 2;
					pill.style.left = `${clamp(x, half + 16, mapRect.width - half - 16) - x}px`;
				}
				if (projection.id !== cards[selected].dataset.cityCard || !open) continue;
				const card = cards[selected];
				// Desktop card follows its point; mobile retains a stable position above the globe.
				card.style.setProperty('--world-card-x', `${clamp(x - card.offsetWidth / 2, 16, mapRect.width - card.offsetWidth - 16)}px`);
				card.style.setProperty('--world-card-y', `${clamp(y - card.offsetHeight - 32, 16, mapRect.height - card.offsetHeight - 16)}px`);
			}
			if (!desktop.matches) {
				const height = open ? cards[selected].offsetHeight : 0;
				map.style.paddingTop = `${Math.max(260, height - 24)}px`;
			} else map.style.removeProperty('padding-top');
		};
		const setCardVisible = (card: HTMLElement, visible: boolean) => {
			const initialized = card.dataset.cardOpen !== undefined;
			if (initialized && (card.dataset.cardOpen === 'true') === visible) return;
			const wasHidden = card.hidden;
			const style = getComputedStyle(card);
			const from = !initialized || wasHidden ? { opacity: '0', translate: '0 12px' } : { opacity: style.opacity, translate: style.translate };
			this.cardAnimations.get(card)?.cancel();
			this.cardAnimations.delete(card);
			card.dataset.cardOpen = String(visible);
			card.inert = !visible;
			card.setAttribute('aria-hidden', String(!visible));
			if (reducedMotion.matches || (!visible && wasHidden)) {
				card.hidden = !visible;
				return;
			}
			card.hidden = false;
			const animation = card.animate([from, { opacity: visible ? '1' : '0', translate: visible ? '0 0' : '0 12px' }], {
				duration: visible ? 280 : 180,
				easing: visible ? 'cubic-bezier(0.2, 0.7, 0.2, 1)' : 'ease-in',
				fill: 'both',
			});
			this.cardAnimations.set(card, animation);
			void animation.finished.then(() => {
				if (this.cardAnimations.get(card) !== animation) return;
				card.hidden = !visible;
				this.cardAnimations.delete(card);
				animation.cancel();
			}, () => {});
		};
		const sync = () => {
			cards.forEach((card, index) => setCardVisible(card, open && index === selected));
			locations.forEach((location, index) => {
				location.toggleAttribute('data-selected', index === selected);
				location.querySelectorAll('[data-city-select]').forEach((control) => control.setAttribute('aria-expanded', String(open && index === selected)));
				// Keep navigation and cards usable with the static fallback if WebGL is unavailable.
				if (!projections.length) location.hidden = index !== selected;
			});
			const city = locations[selected].querySelector('.world-solutions__pill')?.textContent?.split(' · ')[0];
			if (status) status.textContent = `${city} · ${selected + 1} / ${cards.length}`;
			place();
		};
		const focusCity = (immediate = false) => globe.dispatchEvent(new CustomEvent('world-3d:focus', { detail: { id: cards[selected].dataset.cityCard, immediate } }));
		const close = (restoreFocus: boolean) => {
			open = false;
			awaitingCard = undefined;
			sync();
			if (restoreFocus) locations[selected].querySelector<HTMLButtonElement>('.world-solutions__pill')?.focus({ preventScroll: true });
		};
		this.addEventListener('click', (event) => {
			const target = (event.target as Element).closest<HTMLElement>('[data-city-select], [data-city-step], [data-city-close], [data-contact-pending]');
			if (!target) return;
			if (target.hasAttribute('data-contact-pending')) {
				const notice = cards[selected].querySelector<HTMLElement>('[data-contact-notice]');
				if (notice) notice.hidden = false;
				place();
				return;
			}
			if (target.hasAttribute('data-city-close')) { close(true); return; }
			if (target.dataset.cityStep) selected = (selected + Number(target.dataset.cityStep) + cards.length) % cards.length;
			else selected = cards.findIndex((card) => card.dataset.cityCard === target.dataset.citySelect);
			if (selected < 0) selected = 0;
			open = !globeReady;
			awaitingCard = globeReady ? cards[selected].dataset.cityCard : undefined;
			sync();
			focusCity();
		}, { signal });
		this.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && (open || awaitingCard)) close(true);
		}, { signal });
		this.addEventListener('world-3d:ready', () => { globeReady = true; focusCity(true); }, { signal });
		this.addEventListener('world-3d:focusend', (event) => {
			const { id } = (event as CustomEvent<{ id: string }>).detail;
			if (id !== awaitingCard) return;
			awaitingCard = undefined;
			open = true;
			sync();
		}, { signal });
		this.addEventListener('world-3d:dragstart', () => close(false), { signal });
		this.addEventListener('world-3d:unavailable', () => {
			globeReady = false;
			open = open || awaitingCard !== undefined;
			awaitingCard = undefined;
			projections = [];
			this.removeAttribute('data-projection-ready');
			this.setAttribute('data-map-fallback', '');
			locations.forEach((location) => {
				location.style.removeProperty('left');
				location.style.removeProperty('top');
				location.querySelector<HTMLElement>('.world-solutions__pill')?.style.removeProperty('left');
			});
			sync();
		}, { signal });
		this.addEventListener('world-3d:project', (event) => {
			const detail = (event as CustomEvent<{ positions: Projection[]; markerColor: string; markerSize: number; pulse: boolean }>).detail;
			globeReady = true;
			projections = detail.positions;
			this.removeAttribute('data-map-fallback');
			this.setAttribute('data-projection-ready', '');
			this.style.setProperty('--world-marker-color', detail.markerColor);
			this.style.setProperty('--world-marker-size', String(detail.markerSize));
			this.toggleAttribute('data-pulse-disabled', !detail.pulse);
			place();
		}, { signal });
		reducedMotion.addEventListener('change', () => {
			if (!reducedMotion.matches) return;
			this.cardAnimations.forEach((animation, card) => {
				card.hidden = card.dataset.cardOpen !== 'true';
				animation.cancel();
			});
			this.cardAnimations.clear();
		}, { signal });
		desktop.addEventListener('change', place, { signal });
		this.resize = new ResizeObserver(place);
		this.resize.observe(map);
		cards.forEach((card) => this.resize?.observe(card));
		sync();
	}

	disconnectedCallback() {
		this.cardAnimations.forEach((animation) => animation.cancel());
		this.cardAnimations.clear();
		this.controller?.abort();
		this.resize?.disconnect();
	}
}

if (!customElements.get('world-solutions')) customElements.define('world-solutions', WorldSolutions);

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		document.querySelectorAll<WorldSolutions>('world-solutions').forEach((world) => world.disconnectedCallback());
	});
}
