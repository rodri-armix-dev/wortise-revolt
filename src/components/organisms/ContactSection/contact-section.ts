const initializedSections = new WeakSet<HTMLElement>();

function initializeContactSections() {
	for (const section of document.querySelectorAll<HTMLElement>('[data-contact-section]')) {
		if (initializedSections.has(section)) continue;
		const form = section.querySelector<HTMLFormElement>('[data-contact-form]');
		const controls = section.querySelector<HTMLFieldSetElement>('[data-contact-controls]');
		const success = section.querySelector<HTMLElement>('[data-contact-success]');
		const confirmation = section.querySelector<HTMLElement>('[data-contact-confirmation]');
		const reset = section.querySelector<HTMLButtonElement>('[data-contact-reset] button');
		if (!form || !controls || !success || !confirmation || !reset) continue;
		initializedSections.add(section);
		const inputs = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-contact-field] input, [data-contact-field] textarea')];
		const validate = (input: HTMLInputElement | HTMLTextAreaElement) => {
			const field = input.closest<HTMLElement>('[data-contact-field]');
			const error = field?.querySelector<HTMLElement>('[data-contact-error]');
			if (!field || !error) return true;
			const empty = input.required && !input.value.trim();
			const message = empty ? form.dataset.requiredMessage : input.validity.typeMismatch ? form.dataset.emailMessage : input.validationMessage;
			const invalid = empty || !input.validity.valid;
			field.dataset.invalid = String(invalid);
			input.setAttribute('aria-invalid', String(invalid));
			error.textContent = invalid ? message ?? '' : '';
			error.hidden = !invalid;
			return !invalid;
		};
		for (const input of inputs) {
			input.addEventListener('blur', () => {
				if (input.value || input.getAttribute('aria-invalid') === 'true') validate(input);
			});
			input.addEventListener('input', () => {
				if (input.getAttribute('aria-invalid') === 'true') validate(input);
			});
		}
		// Demo only: never submit, persist, or transmit form values.
		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const invalid = inputs.filter((input) => !validate(input));
			if (invalid.length) {
				invalid[0].focus();
				return;
			}
			form.hidden = true;
			success.hidden = false;
			confirmation.focus();
		});
		reset.addEventListener('click', () => {
			form.reset();
			for (const input of inputs) {
				input.removeAttribute('aria-invalid');
				const field = input.closest<HTMLElement>('[data-contact-field]');
				if (field) delete field.dataset.invalid;
				const error = field?.querySelector<HTMLElement>('[data-contact-error]');
				if (error) {
					error.hidden = true;
					error.textContent = '';
				}
			}
			success.hidden = true;
			form.hidden = false;
			inputs[0]?.focus();
		});
		form.noValidate = true;
		controls.disabled = false;
	}
}

initializeContactSections();
document.addEventListener('astro:page-load', initializeContactSections);
