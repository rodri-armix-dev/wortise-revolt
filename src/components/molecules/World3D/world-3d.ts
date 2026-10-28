class World3D extends HTMLElement {
	private cleanup?: () => void;
	private observer?: IntersectionObserver;
	private generation = 0;

	connectedCallback() {
		const generation = ++this.generation;
		this.observer = new IntersectionObserver((entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			this.observer?.disconnect();
			void this.mount(generation).catch((error: unknown) => {
				if (generation !== this.generation) return;
				this.cleanup?.();
				this.cleanup = undefined;
				this.removeAttribute('data-ready');
				this.setAttribute('data-fallback', '');
				this.dispatchEvent(new CustomEvent('world-3d:unavailable', { bubbles: true }));
				if (import.meta.env.DEV) console.warn('World3D: static fallback enabled.', error);
			});
		}, { rootMargin: '200px' });
		this.observer.observe(this);
	}

	disconnectedCallback() {
		this.generation++;
		this.observer?.disconnect();
		this.cleanup?.();
		this.cleanup = undefined;
		this.removeAttribute('data-ready');
	}

	private async mount(generation: number) {
		const [{ createGlobe }, { default: points }, { freshWorldConfig, parseWorldConfig, worldStorageKey }] = await Promise.all([
			import('./world-3d-scene'),
			import('../../../assets/world/land-points.json'),
			import('./world-3d-config'),
		]);
		if (!this.isConnected || generation !== this.generation) return;
		const canvas = this.querySelector('canvas');
		if (!canvas) return;
		const locations: { id: string; latitude: number; longitude: number }[] = JSON.parse(this.dataset.locations ?? '[]');
		let initialConfig = freshWorldConfig();
		if (import.meta.env.DEV) {
			try {
				const saved = localStorage.getItem(worldStorageKey);
				if (saved) initialConfig = parseWorldConfig(saved);
			} catch { console.warn('World3D: using published defaults; saved preview is unavailable or invalid.'); }
		}
		const globe = createGlobe(this, canvas, points, locations, initialConfig);
		const onFocus = (event: Event) => {
			const { id, immediate } = (event as CustomEvent<{ id: string; immediate?: boolean }>).detail;
			globe.focus(id, immediate);
		};
		this.addEventListener('world-3d:focus', onFocus);
		const cleanupGlobe = () => { this.removeEventListener('world-3d:focus', onFocus); globe.dispose(); };
		this.cleanup = cleanupGlobe;
		if (import.meta.env.DEV) {
			const { mountWorldPanel } = await import('./world-3d-panel');
			if (!this.isConnected || generation !== this.generation) return;
			const disposePanel = mountWorldPanel(this, globe);
			this.cleanup = () => { disposePanel(); cleanupGlobe(); };
		}
		this.dispatchEvent(new CustomEvent('world-3d:ready', { bubbles: true }));
		globe.start();
	}
}

if (!customElements.get('world-3d')) customElements.define('world-3d', World3D);

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		document.querySelectorAll<World3D>('world-3d').forEach((globe) => globe.disconnectedCallback());
	});
}
