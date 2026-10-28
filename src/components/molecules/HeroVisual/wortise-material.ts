export const defaultMaterial = {
	version: 1 as const,
	sombras: { color: '#740b29', intensidad: 0.64, suavidad: 0.27 },
	color: { frente: '#d10e4e', laterales: '#b0003a' },
	reflexion: {
		intensidad: 0.78, rugosidad: 0.33, metalizado: 0.29, barniz: 0.46, rugosidadBarniz: 0.01,
		colorBorde: '#f4f3ef', intensidadBorde: 1.81, anchoBorde: 0.25, colorHalo: '#ff2c65', intensidadHalo: 0.78, anchoHalo: 0.0335,
	},
	transparencia: { modo: 'solido' as 'solido' | 'vidrio', opacidad: 1, transmision: 1, indiceRefraccion: 1 },
};

export type MaterialConfig = typeof defaultMaterial;
export const materialStorageKey = 'wortise:hero-material:v1';

export const materialControls = [
	{ key: 'sombras', label: 'Sombras', fields: [
		{ key: 'color', label: 'Color de sombra', kind: 'color' },
		{ key: 'intensidad', label: 'Intensidad', kind: 'number', min: 0, max: 1, step: 0.01 },
		{ key: 'suavidad', label: 'Suavidad', kind: 'number', min: 0, max: 1, step: 0.01 },
	] },
	{ key: 'color', label: 'Color', fields: [
		{ key: 'frente', label: 'Frente', kind: 'color' },
		{ key: 'laterales', label: 'Laterales y brazo posterior', kind: 'color' },
	] },
	{ key: 'reflexion', label: 'Reflexión', fields: [
		{ key: 'intensidad', label: 'Reflejo del entorno', kind: 'number', min: 0, max: 3, step: 0.01 },
		{ key: 'rugosidad', label: 'Rugosidad', kind: 'number', min: 0.01, max: 1, step: 0.01 },
		{ key: 'metalizado', label: 'Metalizado (solo sólido)', kind: 'number', min: 0, max: 1, step: 0.01 },
		{ key: 'barniz', label: 'Barniz', kind: 'number', min: 0, max: 1, step: 0.01 },
		{ key: 'rugosidadBarniz', label: 'Rugosidad del barniz', kind: 'number', min: 0.01, max: 1, step: 0.01 },
		{ key: 'colorBorde', label: 'Color del borde', kind: 'color' },
		{ key: 'intensidadBorde', label: 'Brillo del borde', kind: 'number', min: 0, max: 3, step: 0.01 },
		{ key: 'anchoBorde', label: 'Ancho del borde (relativo)', kind: 'number', min: 0.1, max: 5, step: 0.05 },
		{ key: 'colorHalo', label: 'Color del halo', kind: 'color' },
		{ key: 'intensidadHalo', label: 'Brillo del halo', kind: 'number', min: 0, max: 3, step: 0.01 },
		{ key: 'anchoHalo', label: 'Ancho del halo', kind: 'number', min: 0.005, max: 0.15, step: 0.0005 },
	] },
	{ key: 'transparencia', label: 'Transparencia', fields: [
		{ key: 'modo', label: 'Material', kind: 'select' },
		{ key: 'opacidad', label: 'Opacidad general', kind: 'number', min: 0, max: 1, step: 0.01 },
		{ key: 'transmision', label: 'Transmisión (solo vidrio)', kind: 'number', min: 0, max: 1, step: 0.01 },
		{ key: 'indiceRefraccion', label: 'Refracción (solo vidrio)', kind: 'number', min: 1, max: 2.333, step: 0.001 },
	] },
] as const;

export function freshMaterial(): MaterialConfig {
	return structuredClone(defaultMaterial);
}

function objectAt(value: unknown, path: string): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path}: debe ser un objeto.`);
	return value as Record<string, unknown>;
}

function exactKeys(object: Record<string, unknown>, keys: readonly string[], path: string) {
	for (const key of Object.keys(object)) {
		if (!keys.includes(key)) throw new Error(`${path}.${key}: campo desconocido.`);
	}
	for (const key of keys) {
		if (!Object.hasOwn(object, key)) throw new Error(`${path}.${key}: falta este campo.`);
	}
}

export function validateMaterial(value: unknown): MaterialConfig {
	const root = objectAt(value, 'JSON');
	exactKeys(root, ['version', ...materialControls.map((group) => group.key)], 'JSON');
	if (root.version !== 1) throw new Error('version: solo se admite la versión 1.');
	const result = freshMaterial();
	for (const group of materialControls) {
		const original = objectAt(root[group.key], group.key);
		// Older v1 exports predate the width control; preserve all their other values.
		const record = group.key === 'reflexion' && !Object.hasOwn(original, 'anchoBorde')
			? { ...original, anchoBorde: defaultMaterial.reflexion.anchoBorde }
			: original;
		exactKeys(record, group.fields.map((field) => field.key), group.key);
		const target = result[group.key] as Record<string, string | number>;
		for (const field of group.fields) {
			const current = record[field.key];
			const path = `${group.key}.${field.key}`;
			if (field.kind === 'number') {
				if (typeof current !== 'number' || !Number.isFinite(current) || current < field.min || current > field.max) {
					throw new Error(`${path}: debe ser un número entre ${field.min} y ${field.max}.`);
				}
				target[field.key] = current;
			} else if (field.kind === 'color') {
				if (typeof current !== 'string' || !/^#[0-9a-f]{6}$/i.test(current)) throw new Error(`${path}: usa un color #RRGGBB.`);
				target[field.key] = current.toLowerCase();
			} else {
				if (current !== 'solido' && current !== 'vidrio') throw new Error(`${path}: debe ser solido o vidrio.`);
				target[field.key] = current;
			}
		}
	}
	return result;
}

export function parseMaterialJson(text: string): MaterialConfig {
	let value: unknown;
	try { value = JSON.parse(text); } catch { throw new Error('JSON: sintaxis inválida.'); }
	return validateMaterial(value);
}

export function serializeMaterial(config: MaterialConfig): string {
	return JSON.stringify(validateMaterial(config), null, 2);
}

export function loadMaterial(storage: Pick<Storage, 'getItem'>): { config: MaterialConfig; message?: string } {
	try {
		const saved = storage.getItem(materialStorageKey);
		return { config: saved ? parseMaterialJson(saved) : freshMaterial() };
	} catch (error) {
		return { config: freshMaterial(), message: `Se usó la configuración inicial. ${error instanceof Error ? error.message : 'Almacenamiento no disponible.'}` };
	}
}

export function saveMaterial(storage: Pick<Storage, 'setItem'>, config: MaterialConfig): string | undefined {
	try { storage.setItem(materialStorageKey, serializeMaterial(config)); } catch {
		return 'No se pudo guardar localmente. Puedes seguir ajustando y copiar el JSON.';
	}
}

export async function copyMaterialJson(config: MaterialConfig, writeText: (text: string) => Promise<void>): Promise<boolean> {
	try {
		await writeText(serializeMaterial(config));
		return true;
	} catch { return false; }
}
