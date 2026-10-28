export const defaultMarbleEffects = {
	textureExposure: 0,
	textureContrast: 1,
	textureSaturation: 1,
	textureGamma: 1,
	tintColor: '#ff8fb4',
	tintAmount: 0,
	preserveLights: true,
	duotoneShadows: '#11080b',
	duotoneHighlights: '#ff8fb4',
	duotoneAmount: 0,
	lightIntensity: 1,
	lightThreshold: 0.2,
	glowStrength: 0,
	glowRadius: 6,
	atmosphereColor: '#ff8fb4',
	atmosphereStrength: 0,
	atmosphereWidth: 0.025,
	atmosphereGlow: 0.6,
	atmosphereGlowWidth: 0.04,
};

export const defaultWorldConfig = {
	...defaultMarbleEffects,
	textureExposure: 0.25,
	textureContrast: 1.25,
	textureSaturation: 0.75,
	textureGamma: 1.15,
	tintAmount: 1,
	lightIntensity: 0,
	glowStrength: 0.7,
	atmosphereColor: '#ff2c65',
	atmosphereStrength: 0.75,
	atmosphereWidth: 0.0001,
	atmosphereGlow: 1.25,
	atmosphereGlowWidth: 0.063,
	version: 1,
	surface: 'blackmarble' as 'points' | 'blackmarble',
	textureBrightness: 1.65,
	zoom: 1.33, offset: 0,
	lockRotationX: false, lockRotationY: false, lockRotationZ: false,
	// Buenos Aires centered in the reference camera window, matching the city focus control.
	pitch: -83.1410711489421,
	yaw: 58.3816,
	roll: 0,
	oceanDark: '#740b29', oceanLight: '#d10e4e', rimColor: '#f4f3ef',
	rimStrength: 1.81, oceanOpacity: 0.95,
	dotColor: '#ff2c65', dotHighlight: '#f4f3ef', dotSize: 1.25, dotIntensity: 2.2, dotGlow: 1.1, dotOpacity: 1, twinkle: 0.35,
	markerColor: '#f4f3ef', markerSize: 1, pulse: true,
	speed: 1, arcs: false,
};

export type WorldConfig = typeof defaultWorldConfig;
export const worldStorageKey = 'wortise:world-3d:v1';

const pointsOnlyControls: readonly (keyof WorldConfig)[] = [
	'oceanDark', 'oceanLight', 'rimColor', 'rimStrength',
	'dotColor', 'dotHighlight', 'dotSize', 'dotIntensity', 'dotGlow', 'dotOpacity', 'twinkle',
];

export function isWorldControlVisible(key: keyof WorldConfig, surface: WorldConfig['surface']): boolean {
	if (key.startsWith('atmosphere')) return true;
	if (key === 'textureBrightness' || Object.hasOwn(defaultMarbleEffects, key)) return surface === 'blackmarble';
	return surface !== 'blackmarble' || !pointsOnlyControls.includes(key);
}

export const worldControls = [
	{ label: 'Mapa', fields: [
		{ key: 'surface', label: 'Tipo de mapa', kind: 'select', options: [['points', 'Continentes de puntos'], ['blackmarble', 'Imagen Black Marble']] },
		{ key: 'textureBrightness', label: 'Brillo de la imagen', kind: 'number', min: 0.1, max: 4, step: 0.05 },
	] },
	{ label: 'Color de Marble', fields: [
		{ key: 'textureExposure', label: 'Exposición (EV)', kind: 'number', min: -3, max: 3, step: 0.05 },
		{ key: 'textureContrast', label: 'Contraste', kind: 'number', min: 0, max: 2.5, step: 0.05 },
		{ key: 'textureSaturation', label: 'Saturación', kind: 'number', min: 0, max: 2, step: 0.05 },
		{ key: 'textureGamma', label: 'Gamma', kind: 'number', min: 0.2, max: 3, step: 0.05 },
	] },
	{ label: 'Tinte de Marble', fields: [
		{ key: 'tintColor', label: 'Color del tinte', kind: 'color' },
		{ key: 'tintAmount', label: 'Intensidad del tinte', kind: 'number', min: 0, max: 1, step: 0.01 },
		{ key: 'preserveLights', label: 'Conservar color original de las luces', kind: 'boolean' },
	] },
	{ label: 'Duotono de Marble', fields: [
		{ key: 'duotoneShadows', label: 'Duotono: sombras', kind: 'color' },
		{ key: 'duotoneHighlights', label: 'Duotono: luces', kind: 'color' },
		{ key: 'duotoneAmount', label: 'Intensidad del duotono', kind: 'number', min: 0, max: 1, step: 0.01 },
	] },
	{ label: 'Luces y resplandor de Marble', fields: [
		{ key: 'lightIntensity', label: 'Intensidad de las luces', kind: 'number', min: 0, max: 4, step: 0.05 },
		{ key: 'lightThreshold', label: 'Umbral de luces', kind: 'number', min: 0.01, max: 0.9, step: 0.01 },
		{ key: 'glowStrength', label: 'Resplandor de ciudades', kind: 'number', min: 0, max: 3, step: 0.05 },
		{ key: 'glowRadius', label: 'Radio del resplandor (px de textura)', kind: 'number', min: 1, max: 24, step: 1 },
	] },
	{ label: 'Atmósfera', fields: [
		{ key: 'atmosphereColor', label: 'Color de atmósfera', kind: 'color' },
		{ key: 'atmosphereStrength', label: 'Intensidad de atmósfera', kind: 'number', min: 0, max: 2, step: 0.01 },
		{ key: 'atmosphereGlow', label: 'Intensidad del glow atmosférico', kind: 'number', min: 0, max: 3, step: 0.01 },
		{ key: 'atmosphereGlowWidth', label: 'Extensión del glow atmosférico', kind: 'number', min: 0.005, max: 0.2, step: 0.001 },
		{ key: 'atmosphereWidth', label: 'Grosor de atmósfera', kind: 'number', min: 0.0001, max: 0.12, step: 0.0001 },
	] },
	{ label: 'Vista y encuadre', fields: [
		{ key: 'zoom', label: 'Zoom uniforme', kind: 'number', min: 0.5, max: 2, step: 0.01 },
		{ key: 'offset', label: 'Desplazamiento vertical', kind: 'number', min: -1, max: 1, step: 0.01 },
		{ key: 'pitch', label: 'Inclinación X (grados)', kind: 'number', min: -180, max: 180, step: 0.1 },
		{ key: 'yaw', label: 'Giro Y (grados)', kind: 'number', min: -180, max: 180, step: 0.1 },
		{ key: 'roll', label: 'Rotación Z (grados)', kind: 'number', min: -180, max: 180, step: 0.1 },
	] },
	{ label: 'Bloqueo de coordenadas al arrastrar', fields: [
		{ key: 'lockRotationX', label: 'Bloquear inclinación X', kind: 'boolean' },
		{ key: 'lockRotationY', label: 'Bloquear giro Y', kind: 'boolean' },
		{ key: 'lockRotationZ', label: 'Bloquear rotación Z', kind: 'boolean' },
	] },
	{ label: 'Superficie y borde', fields: [
		{ key: 'oceanDark', label: 'Color base', kind: 'color' },
		{ key: 'oceanLight', label: 'Color iluminado', kind: 'color' },
		{ key: 'rimColor', label: 'Color del borde', kind: 'color' },
		{ key: 'rimStrength', label: 'Intensidad del borde', kind: 'number', min: 0, max: 3, step: 0.01 },
		{ key: 'oceanOpacity', label: 'Opacidad de la esfera', kind: 'number', min: 0, max: 1, step: 0.01 },
	] },
	{ label: 'Continentes de puntos', fields: [
		{ key: 'dotColor', label: 'Color de puntos', kind: 'color' },
		{ key: 'dotHighlight', label: 'Color de destello', kind: 'color' },
		{ key: 'dotSize', label: 'Tamaño de puntos (×)', kind: 'number', min: 0.25, max: 3, step: 0.05 },
		{ key: 'dotIntensity', label: 'Brillo de puntos', kind: 'number', min: 0, max: 4, step: 0.05 },
		{ key: 'dotGlow', label: 'Glow de puntos', kind: 'number', min: 0, max: 2, step: 0.05 },
		{ key: 'dotOpacity', label: 'Opacidad de puntos', kind: 'number', min: 0, max: 1, step: 0.01 },
		{ key: 'twinkle', label: 'Intensidad del destello', kind: 'number', min: 0, max: 1, step: 0.01 },
	] },
	{ label: 'Marcadores y animación', fields: [
		{ key: 'markerColor', label: 'Color de las ciudades', kind: 'color' },
		{ key: 'markerSize', label: 'Tamaño de marcadores (×)', kind: 'number', min: 0.25, max: 3, step: 0.05 },
		{ key: 'pulse', label: 'Pulsos de las ciudades', kind: 'boolean' },
		{ key: 'speed', label: 'Velocidad de animación (×)', kind: 'number', min: 0, max: 3, step: 0.05 },
		{ key: 'arcs', label: 'Mostrar conexión entre ciudades', kind: 'boolean' },
	] },
] as const;

export function freshWorldConfig(): WorldConfig { return structuredClone(defaultWorldConfig); }

export function validateWorldConfig(value: unknown): WorldConfig {
	if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('JSON: debe ser un objeto.');
	const { lockHorizontalDrag, lockVerticalDrag, ...original } = value as Record<string, unknown>;
	if (lockHorizontalDrag !== undefined && typeof lockHorizontalDrag !== 'boolean') throw new Error('Bloqueo horizontal inválido.');
	if (lockVerticalDrag !== undefined && typeof lockVerticalDrag !== 'boolean') throw new Error('Bloqueo vertical inválido.');
	// Preserve existing v1 previews and exports from before texture and drag controls.
	const source = { dotIntensity: 1, dotGlow: 0, ...defaultMarbleEffects, surface: defaultWorldConfig.surface, textureBrightness: defaultWorldConfig.textureBrightness, lockRotationX: lockVerticalDrag ?? false, lockRotationY: lockHorizontalDrag ?? false, lockRotationZ: false, ...original } as Record<string, unknown>;
	const keys = Object.keys(defaultWorldConfig);
	if (source.version !== 1) throw new Error('Solo se admite la versión 1.');
	if (Object.keys(source).some((key) => !keys.includes(key)) || keys.some((key) => !Object.hasOwn(source, key))) throw new Error('JSON: campos desconocidos o incompletos.');
	const result = freshWorldConfig();
	for (const group of worldControls) {
		for (const field of group.fields) {
			const entry = source[field.key];
			if (field.kind === 'number' && (typeof entry !== 'number' || !Number.isFinite(entry) || entry < field.min || entry > field.max)) throw new Error(`${field.label}: usa un número entre ${field.min} y ${field.max}.`);
			if (field.kind === 'color' && (typeof entry !== 'string' || !/^#[0-9a-f]{6}$/i.test(entry))) throw new Error(`${field.label}: usa un color #RRGGBB.`);
			if (field.kind === 'boolean' && typeof entry !== 'boolean') throw new Error(`${field.label}: debe ser true o false.`);
			if (field.kind === 'select' && !field.options.some(([key]) => key === entry)) throw new Error(`${field.label}: opción desconocida.`);
			(result as Record<string, unknown>)[field.key] = typeof entry === 'string' ? entry.toLowerCase() : entry;
		}
	}
	return result;
}

export function parseWorldConfig(text: string): WorldConfig {
	let value: unknown;
	try { value = JSON.parse(text); } catch { throw new Error('JSON: sintaxis inválida.'); }
	return validateWorldConfig(value);
}

export function serializeWorldConfig(config: WorldConfig) { return JSON.stringify(validateWorldConfig(config), null, 2); }

// Presets change appearance only; camera, locks and interaction remain intact.
export const marblePresets = [
	{ label: 'Original', values: { ...defaultMarbleEffects, textureBrightness: 1 } },
	{ label: 'Wortise rosa', values: { ...defaultMarbleEffects, textureBrightness: 1, textureExposure: 0.4, textureContrast: 1.15, textureGamma: 1.2, duotoneAmount: 1, duotoneShadows: '#11080b', duotoneHighlights: '#ff8fb4', lightIntensity: 1.5, glowStrength: 0.8, atmosphereStrength: 0.3 } },
	{ label: 'Bordó nocturno', values: { ...defaultMarbleEffects, textureBrightness: 0.9, textureContrast: 1.35, duotoneAmount: 1, duotoneShadows: '#080307', duotoneHighlights: '#d10e4e', lightIntensity: 1.2, glowStrength: 0.45, atmosphereColor: '#d10e4e', atmosphereStrength: 0.2 } },
	{ label: 'Magenta luminoso', values: { ...defaultMarbleEffects, textureBrightness: 1, textureExposure: 0.7, textureContrast: 1.2, duotoneAmount: 0.9, duotoneShadows: '#100711', duotoneHighlights: '#ff4c9b', lightIntensity: 2, glowStrength: 1.3, glowRadius: 10, atmosphereColor: '#ff4c9b', atmosphereStrength: 0.5 } },
	{ label: 'Rosa y luces cálidas', values: { ...defaultMarbleEffects, textureBrightness: 1, textureSaturation: 0.65, tintAmount: 0.75, tintColor: '#ff8fb4', preserveLights: true, textureGamma: 1.2, lightIntensity: 1.6, glowStrength: 0.7, atmosphereStrength: 0.25 } },
] satisfies { label: string; values: Partial<WorldConfig> }[];

// Saved user configuration includes the exact framing as well as its appearance.
export const savedWorldPreset = {
	label: 'Wortise personalizado',
	values: { ...defaultWorldConfig, textureExposure: 2.75, textureContrast: 1.7, textureGamma: 1.25, tintAmount: 1, lightIntensity: 1.85, lightThreshold: 0.56, glowRadius: 11, atmosphereStrength: 0.35, atmosphereWidth: 0.005, atmosphereGlow: 0.6, atmosphereGlowWidth: 0.04, textureBrightness: 0.9, zoom: 1.33, pitch: -91.99414579674296, yaw: 58.38160000000001, roll: -6.06675753088095e-15, oceanOpacity: 1 },
} satisfies { label: string; values: WorldConfig };

// Palette sampled from HeroVisual's published material; no runtime coupling.
export const pointsPresets = [
	{ label: 'Puntos · brillo de la W', values: { surface: 'points', oceanDark: '#740b29', oceanLight: '#d10e4e', oceanOpacity: 1, rimColor: '#f4f3ef', rimStrength: 1.81, dotColor: '#ff2c65', dotHighlight: '#f4f3ef', dotSize: 1.25, dotIntensity: 2.2, dotGlow: 1.1, dotOpacity: 1, twinkle: 0.35, atmosphereColor: '#ff2c65', atmosphereStrength: 0.78, atmosphereWidth: 0.003, atmosphereGlow: 1.2, atmosphereGlowWidth: 0.0335, markerColor: '#f4f3ef' } },
] satisfies { label: string; values: Partial<WorldConfig> }[];
