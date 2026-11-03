class ArticleSharing extends HTMLElement {
	private abort?: AbortController;

	connectedCallback() {
		this.abort?.abort();
		this.abort = new AbortController();
		const url = new URL(location.href);
		url.hash = '';
		const encoded = encodeURIComponent(url.href);
		this.querySelectorAll<HTMLAnchorElement>('[data-share-network]').forEach((anchor) => {
			anchor.href = anchor.dataset.shareNetwork === 'linkedin'
				? `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`
				: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
		});
		const controls = this.querySelector<HTMLElement>('[data-sharing-controls]');
		if (controls) controls.hidden = false;
		this.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
			const status = this.querySelector<HTMLElement>('[data-sharing-status]');
			try {
				await navigator.clipboard.writeText(url.href);
				if (status) status.textContent = this.dataset.copiedLabel ?? '';
			} catch {
				if (status) status.textContent = `${this.dataset.failedLabel ?? ''} ${url.href}`;
			}
		}, { signal: this.abort.signal });
	}

	disconnectedCallback() { this.abort?.abort(); }
}

if (!customElements.get('article-sharing')) customElements.define('article-sharing', ArticleSharing);
