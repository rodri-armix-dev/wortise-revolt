class NewsletterForm extends HTMLElement {
	private abort?: AbortController;

	connectedCallback() {
		this.abort?.abort();
		this.abort = new AbortController();
		const form = this.querySelector('form');
		if (!form) return;
		const fields = form.querySelector('fieldset');
		if (fields) fields.disabled = false;
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const status = this.querySelector<HTMLElement>('[data-newsletter-status]');
			if (status) status.textContent = this.dataset.unavailableLabel ?? '';
		}, { signal: this.abort.signal });
	}

	disconnectedCallback() { this.abort?.abort(); }
}

if (!customElements.get('newsletter-form')) customElements.define('newsletter-form', NewsletterForm);
