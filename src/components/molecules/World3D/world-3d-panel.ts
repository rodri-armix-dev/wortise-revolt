import styles from './world-3d-panel.scss?inline';
import type { createGlobe } from './world-3d-scene';
import { freshWorldConfig, isWorldControlVisible, marblePresets, pointsPresets, savedWorldPreset, parseWorldConfig, serializeWorldConfig, validateWorldConfig, worldControls, worldStorageKey, type WorldConfig } from './world-3d-config';

let panelId = 0;

export function mountWorldPanel(anchor: HTMLElement, api: Omit<ReturnType<typeof createGlobe>, 'dispose'>) {
	const events = new AbortController();
	const id = `world-editor-${++panelId}`;
	const element = <K extends keyof HTMLElementTagNameMap>(tag: K, part?: string, text?: string) => {
		const node = document.createElement(tag);
		if (part) node.className = `world-3d-panel__${part}`;
		if (text) node.textContent = text;
		return node;
	};
	const style = element('style');
	style.textContent = styles;
	const root = element('aside');
	root.className = 'world-3d-panel';
	root.setAttribute('aria-label', 'Editor del globo (desarrollo)');
	const toggle = element('button', 'toggle', '✎');
	toggle.type = 'button';
	toggle.setAttribute('aria-label', 'Editar globo 3D');
	toggle.setAttribute('aria-expanded', 'false');
	toggle.setAttribute('aria-controls', `${id}-editor`);
	toggle.title = 'Editar globo 3D';
	const editor = element('div', 'editor');
	editor.id = `${id}-editor`;
	editor.hidden = true;
	const header = element('div', 'header');
	const close = element('button', 'close', '×');
	close.type = 'button';
	close.setAttribute('aria-label', 'Cerrar editor del globo');
	header.append(element('strong', undefined, 'Globo 3D · Desarrollo'), close);
	const status = element('p', 'status');
	status.setAttribute('role', 'status');
	const message = (text: string) => { status.textContent = text; };
	const content = element('div', 'content');
	const json = element('textarea', 'json');
	json.id = `${id}-json`;
	json.rows = 8;
	json.spellcheck = false;
	const jsonLabel = element('label', 'label', 'Configuración JSON del globo');
	jsonLabel.htmlFor = json.id;
	const linked: { key: keyof WorldConfig; inputs: (HTMLInputElement | HTMLSelectElement)[] }[] = [];
	const rows: { key: keyof WorldConfig; element: HTMLElement }[] = [];
	const sections: { element: HTMLDetailsElement; summary: HTMLElement; label: string }[] = [];
	const presetButtons: { button: HTMLButtonElement; values: Partial<WorldConfig>; surface: WorldConfig['surface'] }[] = [];
	let current = validateWorldConfig(api.snapshot());

	function sync() {

		for (const preset of presetButtons) {
			preset.button.hidden = preset.surface !== current.surface;
			preset.button.setAttribute('aria-pressed', String(Object.entries(preset.values).every(([key, value]) => current[key as keyof WorldConfig] === value)));
		}
		for (const row of rows) row.element.hidden = !isWorldControlVisible(row.key, current.surface);
		for (const section of sections) {
			section.element.hidden = rows.filter((row) => row.element.parentElement === section.element).every((row) => row.element.hidden);
			section.summary.textContent = section.label === 'Superficie y borde' && current.surface === 'blackmarble' ? 'Superficie' : section.label;
		}
		for (const { key, inputs } of linked) {
			for (const input of inputs) {
				if (document.activeElement !== input) input.value = String(current[key]);
				if (input instanceof HTMLInputElement && input.type === 'checkbox') input.checked = Boolean(current[key]);
				input.removeAttribute('aria-invalid');
			}
		}
		json.value = serializeWorldConfig(current);
	}
	function persist() {
		try { localStorage.setItem(worldStorageKey, serializeWorldConfig(current)); }
		catch { message('No se pudo guardar localmente. Puedes copiar el JSON.'); }
	}
	function apply(value: unknown) {
		const checked = validateWorldConfig(value);
		api.apply(checked);
		current = checked;
		sync();
		persist();
	}
	function capture() { current = validateWorldConfig(api.snapshot()); sync(); persist(); }
	function button(label: string, action: () => void | Promise<void>) {
		const node = element('button', 'button', label);
		node.type = 'button';
		node.addEventListener('click', () => { void action(); }, { signal: events.signal });
		return node;
	}
	const pause = button('Pausar animación', () => api.pause(!api.isPaused()));
	function syncPause() {
		pause.setAttribute('aria-pressed', String(api.isPaused()));
		pause.textContent = api.isPaused() ? 'Reanudar animación' : 'Pausar animación';
	}
	const actions = element('div', 'actions');
	actions.append(pause, button('Enfocar Buenos Aires', () => api.focus('buenos-aires')), button('Enfocar Madrid', () => api.focus('madrid')));
	content.append(element('p', 'note', 'Pruebas locales. Los cambios se guardan en este navegador; copia el JSON para compartirlos. El giro con mouse o touch también se guarda.'), actions);
	const presets = element('section', 'section');
	presets.setAttribute('aria-label', 'Presets de color del mapa');
	presets.append(element('strong', 'label', 'Presets de color'));
	const presetActions = element('div', 'actions');
	const availablePresets: { label: string; values: Partial<WorldConfig> }[] = [...marblePresets, savedWorldPreset, ...pointsPresets];
	for (const preset of availablePresets) {
		const choice = button(preset.label, () => {
			message(`Preset ${preset.label} aplicado. Puedes ajustar sus valores debajo.`);
			apply({ ...api.snapshot(), ...preset.values });
		});
		presetButtons.push({ button: choice, values: preset.values, surface: preset.values.surface ?? 'blackmarble' });
		presetActions.append(choice);
	}
	presets.append(presetActions, element('p', 'note', 'Los presets de color conservan el encuadre. Wortise personalizado restaura también la vista guardada.'));
	content.append(presets);
	const coordinateLocks = { pitch: 'lockRotationX', yaw: 'lockRotationY', roll: 'lockRotationZ' } as const;
	for (const group of worldControls) {
		// Coordinate locks render beside their numeric fields, not in a separate section.
		if (group.fields.every((field) => field.key.startsWith('lockRotation'))) continue;
		const section = element('details', 'section');
		section.open = group.label === 'Mapa' || group.label === 'Vista y encuadre' || group.label === 'Superficie y borde';
		const summary = element('summary', 'summary', group.label);
		section.append(summary);
		sections.push({ element: section, summary, label: group.label });
		for (const field of group.fields) {
			const row = element('div', 'control');
			rows.push({ key: field.key, element: row });
			const label = element('label', 'label', field.label);
			label.htmlFor = `${id}-${field.key}`;
			row.append(label);
			if (field.kind === 'boolean') {
				label.classList.add('world-3d-panel__label--checkbox');
				const input = element('input', 'checkbox');
				input.type = 'checkbox';
				input.id = label.htmlFor;
				input.addEventListener('change', () => {
					try { message(''); apply({ ...api.snapshot(), [field.key]: input.checked }); }
					catch (error) { message(error instanceof Error ? error.message : 'Valor inválido.'); }
				}, { signal: events.signal });
				label.prepend(input);
				linked.push({ key: field.key, inputs: [input] });
				section.append(row);
				continue;
			}
			if (field.kind === 'select') {
				const select = element('select', 'select');
				select.id = label.htmlFor;
				for (const [value, text] of field.options) {
					const option = element('option', undefined, text);
					option.value = value;
					select.append(option);
				}
				select.addEventListener('change', () => {
					try { message(''); apply({ ...api.snapshot(), [field.key]: select.value }); }
					catch (error) { message(error instanceof Error ? error.message : 'Opción inválida.'); }
				}, { signal: events.signal });
				linked.push({ key: field.key, inputs: [select] });
				row.append(select);
				section.append(row);
				continue;
			}
			const pair = element('div', 'pair');
			const inputs: HTMLInputElement[] = [];
			const types = field.kind === 'color' ? ['color', 'text'] : ['range', 'number'];
			for (const [index, type] of types.entries()) {
				const input = element('input', 'input');
				input.type = type;
				input.id = `${id}-${field.key}${index ? '-value' : ''}`;
				if (index) input.setAttribute('aria-label', `${field.label}: ${field.kind === 'color' ? 'hexadecimal' : 'valor numérico'}`);
				if (field.kind === 'number') {
					input.min = String(field.min); input.max = String(field.max); input.step = String(field.step);
				}
				input.addEventListener(type === 'text' ? 'change' : 'input', () => {
					try {
						const next = api.snapshot();
						(next as Record<string, unknown>)[field.key] = field.kind === 'number' ? (input.value === '' ? NaN : Number(input.value)) : input.value;
						message('');
						apply(next);
					} catch (error) {
						input.setAttribute('aria-invalid', 'true');
						message(error instanceof Error ? error.message : 'Valor inválido.');
					}
				}, { signal: events.signal });
				inputs.push(input);
				pair.append(input);
			}
			linked.push({ key: field.key, inputs });
			if (field.key === 'pitch' || field.key === 'yaw' || field.key === 'roll') {
				const lockKey = coordinateLocks[field.key];
				const checkbox = element('input', 'checkbox');
				checkbox.type = 'checkbox';
				checkbox.id = `${id}-${lockKey}`;
				checkbox.setAttribute('aria-label', `Bloquear ${field.label} durante el arrastre`);
				checkbox.title = `Bloquear ${field.label} durante el arrastre`;
				checkbox.addEventListener('change', () => {
					try { message(''); apply({ ...api.snapshot(), [lockKey]: checkbox.checked }); }
					catch (error) { message(error instanceof Error ? error.message : 'Valor inválido.'); }
				}, { signal: events.signal });
				linked.push({ key: lockKey, inputs: [checkbox] });
				pair.classList.add('world-3d-panel__pair--lock');
				pair.append(checkbox);
			}
			row.append(pair);
			section.append(row);
		}
		content.append(section);
	}
	const jsonActions = element('div', 'actions');
	jsonActions.append(
		button('Copiar JSON', async () => {
			capture();
			try { await navigator.clipboard.writeText(json.value); message('JSON copiado.'); }
			catch { json.focus(); json.select(); message('Copia manualmente el JSON seleccionado.'); }
		}),
		button('Importar JSON', () => {
			try { const value = parseWorldConfig(json.value); message('JSON aplicado.'); apply(value); json.removeAttribute('aria-invalid'); }
			catch (error) { json.setAttribute('aria-invalid', 'true'); message(error instanceof Error ? error.message : 'JSON inválido.'); }
		}),
		button('Restablecer globo', () => { message('Globo inicial restaurado.'); apply(freshWorldConfig()); api.pause(false); }),
	);
	content.append(jsonLabel, json, jsonActions);
	function setOpen(open: boolean) {
		editor.hidden = !open;
		toggle.setAttribute('aria-expanded', String(open));
		if (!open) toggle.focus();
	}
	toggle.addEventListener('click', () => setOpen(editor.hidden), { signal: events.signal });
	close.addEventListener('click', () => setOpen(false), { signal: events.signal });
	root.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !editor.hidden) { event.preventDefault(); setOpen(false); }
	}, { signal: events.signal });
	anchor.addEventListener('world-3d:viewchange', capture, { signal: events.signal });
	anchor.addEventListener('world-3d:pausechange', syncPause, { signal: events.signal });
	anchor.addEventListener('world-3d:textureerror', () => message('No se pudo cargar Black Marble. Se muestran los puntos; vuelve a seleccionar la imagen para reintentar.'), { signal: events.signal });
	editor.append(header, status, content);
	root.append(toggle, editor);
	document.head.append(style);
	document.body.append(root);
	let frame = 0;
	function position() {
		frame = 0;
		const bounds = anchor.getBoundingClientRect();
		root.style.left = `${Math.max(16, Math.min(innerWidth - 64, bounds.right - 60))}px`;
		root.style.top = `${Math.max(16, Math.min(innerHeight - 64, bounds.top + 16))}px`;
		root.style.visibility = bounds.bottom <= 0 || bounds.top >= innerHeight ? 'hidden' : 'visible';
	}
	const schedule = () => { if (!frame) frame = requestAnimationFrame(position); };
	const resize = new ResizeObserver(schedule);
	resize.observe(anchor);
	window.addEventListener('scroll', schedule, { passive: true, signal: events.signal });
	window.addEventListener('resize', schedule, { passive: true, signal: events.signal });
	sync();
	syncPause();
	position();
	return () => { events.abort(); resize.disconnect(); cancelAnimationFrame(frame); root.remove(); style.remove(); };
}
