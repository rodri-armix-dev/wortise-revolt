import styles from './wortise-material-panel.scss?inline';
import { defaultMotion, entrancePreviews, idlePreviews, type EntrancePreview, type IdlePreview } from './wortise-motion-preview';
import {
	copyMaterialJson, freshMaterial, loadMaterial, materialControls, parseMaterialJson, saveMaterial, serializeMaterial, validateMaterial,
	type MaterialConfig,
} from './wortise-material';

let panelId = 0;

export function mountMaterialPanel(anchor: HTMLElement, api: {
	apply: (config: MaterialConfig) => void;
	pause: (paused: boolean) => void;
	compare: (png: boolean) => void;
	enter: (name: EntrancePreview) => void;
	idle: (name: IdlePreview) => void;
}) {
	const events = new AbortController();
	const id = `wortise-material-${++panelId}`;
	const element = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => {
		const node = document.createElement(tag);
		if (className) node.className = `wortise-material-panel__${className}`;
		if (text) node.textContent = text;
		return node;
	};
	const style = element('style');
	style.textContent = styles;
	const root = element('aside');
	root.className = 'wortise-material-panel';
	root.setAttribute('aria-label', 'Material de la W (desarrollo)');
	const toggle = element('button', 'toggle');
	toggle.type = 'button';
	toggle.setAttribute('aria-expanded', 'false');
	toggle.setAttribute('aria-label', 'Editar material de la W');
	toggle.title = 'Editar material de la W';
	toggle.setAttribute('aria-controls', `${id}-editor`);
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('width', '22');
	svg.setAttribute('height', '22');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('stroke', 'currentColor');
	svg.setAttribute('stroke-width', '1.8');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');
	svg.setAttribute('aria-hidden', 'true');
	svg.setAttribute('focusable', 'false');
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', 'M15 5l4 4M4 20l1-5L16 4a2.8 2.8 0 0 1 4 4L9 19z');
	svg.append(path);
	toggle.append(svg);
	const editor = element('div', 'editor');
	editor.id = `${id}-editor`;
	editor.hidden = true;
	const header = element('div', 'header');
	const title = element('strong', undefined, 'Material de la W · Desarrollo');
	const close = element('button', 'close', '×');
	close.type = 'button';
	close.setAttribute('aria-label', 'Cerrar editor de material');
	header.append(title, close);
	const content = element('div', 'content');
	content.id = `${id}-content`;
	const status = element('p', 'status');
	status.setAttribute('role', 'status');
	status.setAttribute('aria-live', 'polite');
	const message = (text: string) => { status.textContent = text; };
	const json = element('textarea', 'json');
	json.id = `${id}-json`;
	json.rows = 7;
	json.spellcheck = false;
	const jsonLabel = element('label', 'label', 'Configuración JSON');
	jsonLabel.htmlFor = json.id;
	const linked: { group: string; key: string; inputs: (HTMLInputElement | HTMLSelectElement)[] }[] = [];
	let current = freshMaterial();
	let initialMessage = '';
	try {
		const loaded = loadMaterial(window.localStorage);
		current = loaded.config;
		initialMessage = loaded.message ?? '';
	} catch { initialMessage = 'Almacenamiento no disponible. Puedes ajustar y copiar el JSON.'; }

	function sync() {
		for (const control of linked) {
			const value = (current[control.group as keyof Omit<MaterialConfig, 'version'>] as Record<string, number | string>)[control.key];
			for (const input of control.inputs) {
				if (document.activeElement !== input) input.value = String(value);
				input.removeAttribute('aria-invalid');
				const glass = current.transparencia.modo === 'vidrio';
				input.disabled = (control.key === 'metalizado' && glass) || (['transmision', 'indiceRefraccion'].includes(control.key) && !glass);
			}
		}
		json.value = serializeMaterial(current);
	}
	function persist() {
		try {
			const warning = saveMaterial(window.localStorage, current);
			if (warning) message(warning);
		} catch { message('No se pudo guardar localmente. Puedes copiar el JSON.'); }
	}
	function apply(value: unknown) {
		const checked = validateMaterial(value);
		api.apply(checked);
		current = checked;
		sync();
		persist();
	}
	function edit(group: string, key: string, value: string | number) {
		try {
			const next = structuredClone(current);
			(next[group as keyof Omit<MaterialConfig, 'version'>] as Record<string, string | number>)[key] = value;
			message('');
			apply(next);
			return true;
		} catch (error) {
			message(error instanceof Error ? error.message : 'Valor inválido.');
			return false;
		}
	}
	function button(label: string, action: () => void | Promise<void>) {
		const node = element('button', 'button', label);
		node.type = 'button';
		node.addEventListener('click', action, { signal: events.signal });
		return node;
	}

	const preview = element('div', 'actions');
	let paused = false;
	let comparing = false;
	const pause = button('Pausar movimiento', () => {
		paused = !paused;
		api.pause(paused);
		pause.setAttribute('aria-pressed', String(paused));
		pause.textContent = paused ? 'Reanudar movimiento' : 'Pausar movimiento';
	});
	pause.setAttribute('aria-pressed', 'false');
	const compare = button('Comparar con PNG', () => {
		comparing = !comparing;
		api.compare(comparing);
		compare.setAttribute('aria-pressed', String(comparing));
		compare.textContent = comparing ? 'Volver al 3D' : 'Comparar con PNG';
		message(comparing ? 'Mostrando el PNG original. Los ajustes se aplican al modelo 3D.' : 'Mostrando el modelo 3D.');
	});
	compare.setAttribute('aria-pressed', 'false');
	preview.append(pause, compare);
	content.append(element('p', 'note', 'Ajustes locales: no se publican. Copia el JSON para compartirlos.'), preview);
	const animations = element('section', 'section');
	animations.setAttribute('aria-label', 'Probar animaciones');
	animations.append(element('strong', 'label', 'Animaciones de entrada'));
	const entranceActions = element('div', 'actions');
	const idleActions = element('div', 'actions');
	function resumePreview() {
		if (paused) pause.click();
		if (comparing) compare.click();
	}
	for (const [name, label] of entrancePreviews) {
		entranceActions.append(button(label, () => { resumePreview(); api.enter(name); message('Reproduciendo entrada. Al terminar continúa el idle seleccionado.'); }));
	}
	const idleButtons: HTMLButtonElement[] = [];
	for (const [name, label] of idlePreviews) {
		const choice = button(label, () => {
			resumePreview();
			api.idle(name);
			idleButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === choice)));
			message('Idle de prueba seleccionado. No modifica la animación publicada.');
		});
		choice.setAttribute('aria-pressed', String(name === defaultMotion.idle));
		idleButtons.push(choice);
		idleActions.append(choice);
	}
	animations.append(entranceActions, element('strong', 'label', 'Animaciones en reposo'), idleActions, element('p', 'note', 'Las pruebas respetan movimiento reducido. No se incluyen en el JSON del material.'));
	content.append(animations);

	for (const group of materialControls) {
		const section = element('details', 'section');
		section.open = group.key === 'color' || group.key === 'sombras';
		section.append(element('summary', 'summary', group.label));
		for (const field of group.fields) {
			const row = element('div', 'control');
			const controlId = `${id}-${group.key}-${field.key}`;
			const label = element('label', 'label', field.label);
			label.htmlFor = controlId;
			row.append(label);
			const inputs: (HTMLInputElement | HTMLSelectElement)[] = [];
			if (field.kind === 'select') {
				const select = element('select', 'select');
				select.id = controlId;
				for (const [value, text] of [['solido', 'Sólido rojo'], ['vidrio', 'Vidrio rojo']]) {
					const option = element('option', undefined, text);
					option.value = value;
					select.append(option);
				}
				select.addEventListener('change', () => edit(group.key, field.key, select.value), { signal: events.signal });
				inputs.push(select);
				row.append(select);
			} else {
				const pair = element('div', 'pair');
				for (const [index, type] of (field.kind === 'color' ? ['color', 'text'] : ['range', 'number']).entries()) {
					const input = element('input', 'input');
					input.type = type;
					input.id = index === 0 ? controlId : `${controlId}-value`;
					if (index) input.setAttribute('aria-label', `${field.label}: ${field.kind === 'color' ? 'hexadecimal' : 'valor numérico'}`);
					if (field.kind === 'number') {
						input.min = String(field.min);
						input.max = String(field.max);
						input.step = String(field.step);
					}
					input.addEventListener(type === 'text' ? 'change' : 'input', () => {
						const value = field.kind === 'number' ? (input.value === '' ? NaN : Number(input.value)) : input.value;
						input.setAttribute('aria-invalid', String(!edit(group.key, field.key, value)));
					}, { signal: events.signal });
					inputs.push(input);
					pair.append(input);
				}
				row.append(pair);
			}
			linked.push({ group: group.key, key: field.key, inputs });
			section.append(row);
		}
		if (group.key === 'transparencia') section.append(element('p', 'note', 'El vidrio refracta el entorno 3D, no el HTML. Opacidad desvanece la W completa.'));
		content.append(section);
	}

	const actions = element('div', 'actions');
	actions.append(
		button('Copiar JSON', async () => {
			json.value = serializeMaterial(current);
			if (await copyMaterialJson(current, (text) => navigator.clipboard.writeText(text))) {
				message('JSON copiado.');
			} else {
				json.focus();
				json.select();
				message('No se pudo usar el portapapeles. Copia manualmente el JSON seleccionado.');
			}
		}),
		button('Importar JSON', () => {
			try {
				const imported = parseMaterialJson(json.value);
				message('JSON aplicado.');
				apply(imported);
			} catch (error) { message(error instanceof Error ? error.message : 'JSON inválido.'); }
		}),
		button('Restablecer', () => { message('Material inicial restaurado.'); apply(freshMaterial()); }),
	);
	content.append(jsonLabel, json, actions);
	function setOpen(open: boolean) {
		editor.hidden = !open;
		toggle.setAttribute('aria-expanded', String(open));
		if (!open) toggle.focus();
	}
	toggle.addEventListener('click', () => setOpen(editor.hidden), { signal: events.signal });
	close.addEventListener('click', () => setOpen(false), { signal: events.signal });
	root.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !editor.hidden) {
			event.preventDefault();
			setOpen(false);
		}
	}, { signal: events.signal });
	editor.append(header, status, content);
	root.append(toggle, editor);

	document.head.append(style);
	document.body.append(root);
	let positionFrame = 0;
	function position() {
		positionFrame = 0;
		const bounds = anchor.getBoundingClientRect();
		root.style.left = `${Math.max(16, Math.min(window.innerWidth - 64, bounds.right - 48))}px`;
		root.style.top = `${Math.max(16, bounds.top)}px`;
		root.style.visibility = bounds.bottom <= 0 || bounds.top >= window.innerHeight ? 'hidden' : 'visible';
	}
	function schedulePosition() {
		if (!positionFrame) positionFrame = requestAnimationFrame(position);
	}
	const anchorObserver = new ResizeObserver(schedulePosition);
	anchorObserver.observe(anchor);
	window.addEventListener('scroll', schedulePosition, { passive: true, signal: events.signal });
	window.addEventListener('resize', schedulePosition, { passive: true, signal: events.signal });
	position();
	api.apply(current);
	sync();
	message(initialMessage);

	return () => {
		events.abort();
		anchorObserver.disconnect();
		cancelAnimationFrame(positionFrame);
		root.remove();
		style.remove();
	};
}
