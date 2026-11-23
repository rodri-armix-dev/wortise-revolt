import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function bindScrollPositionSettings(
	form: HTMLFormElement,
	gear: HTMLButtonElement,
	storageKey: string,
	onSettings: (values: Record<string, string>) => void,
	updateFields = () => {},
) {
	const reset = form.querySelector<HTMLButtonElement>('[data-scroll-position-settings-reset]');
	const status = form.querySelector<HTMLOutputElement>('[data-scroll-position-settings-status]');
	if (!reset || !status) return;

	const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input[name], select[name]')];
	const read = () => Object.fromEntries(fields.map((field) => [field.name, field.value]));

	let saved: Record<string, unknown> = {};
	try {
		const stored: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? '{}');
		if (stored && typeof stored === 'object' && !Array.isArray(stored)) saved = stored as Record<string, unknown>;
		for (const field of fields) {
			const value = saved[field.name];
			if (typeof value === 'string') field.value = value;
		}
	} catch {
		// The form defaults also work without session storage.
	}
	updateFields();
	if (!form.checkValidity()) {
		form.reset();
		updateFields();
	}

	let values = read();
	onSettings(values);
	const apply = (message: string) => {
		status.value = message;
		const next = read();
		if (fields.every(({ name }) => next[name] === values[name])) return;

		values = next;
		try {
			sessionStorage.setItem(storageKey, JSON.stringify({ ...saved, ...values }));
		} catch {
			// Keep the new values on the current page when storage is unavailable.
		}
		onSettings(values);
		ScrollTrigger.refresh();
	};

	const toggleSettings = () => {
		form.hidden = !form.hidden;
		gear.setAttribute('aria-expanded', String(!form.hidden));
		ScrollTrigger.refresh();
	};

	let pending = 0;
	const cancelPending = () => {
		window.clearTimeout(pending);
		pending = 0;
	};
	const commit = () => {
		cancelPending();
		updateFields();
		const invalid = fields.find((field) => field.willValidate && !field.validity.valid);
		if (invalid) {
			const label = invalid.labels?.[0]?.textContent;
			status.value = `Revisá «${label}». ${invalid.validationMessage}`;
			return;
		}
		apply('Ajustes actualizados.');
	};
	const onInput = (event: Event) => {
		if (event.target instanceof HTMLSelectElement) {
			commit();
		} else {
			cancelPending();
			pending = window.setTimeout(commit, 150);
		}
	};
	const onSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		commit();
	};
	const onReset = () => {
		cancelPending();
		form.reset();
		updateFields();
		apply('Ajustes restablecidos.');
	};
	const onHelpClick = (event: MouseEvent) => {
		if (!(event.target instanceof Element)) return;
		const button = event.target.closest<HTMLButtonElement>('[data-scroll-position-settings-help]');
		if (!button) return;
		const help = document.getElementById(button.getAttribute('aria-controls') ?? '');
		if (!help) return;
		const open = help.hidden;
		help.hidden = !open;
		button.setAttribute('aria-expanded', String(open));
		ScrollTrigger.refresh();
	};
	gear.addEventListener('click', toggleSettings);
	form.addEventListener('input', onInput);
	form.addEventListener('change', commit);
	form.addEventListener('submit', onSubmit);
	form.addEventListener('click', onHelpClick);
	reset.addEventListener('click', onReset);
	gear.hidden = false;

	// Settings can change the document position of the scene and its snap stops.
	let frame = 0;
	const observer = new ResizeObserver(() => {
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			ScrollTrigger.refresh();
		});
	});
	if (form.parentElement) observer.observe(form.parentElement);

	return () => {
		observer.disconnect();
		cancelAnimationFrame(frame);
		cancelPending();
		gear.removeEventListener('click', toggleSettings);
		form.removeEventListener('input', onInput);
		form.removeEventListener('change', commit);
		form.removeEventListener('submit', onSubmit);
		form.removeEventListener('click', onHelpClick);
		reset.removeEventListener('click', onReset);
		form.hidden = true;
		gear.hidden = true;
		gear.setAttribute('aria-expanded', 'false');
	};
}
