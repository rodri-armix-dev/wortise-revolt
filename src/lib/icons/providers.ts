import type { ImageMetadata } from 'astro';
import type { HTMLAttributes, SvgComponent } from 'astro/types';

// Providers receive defined SVG attributes; null is not passed across adapters.
export type IconAttributes = {
	[Key in keyof HTMLAttributes<'svg'>]: Exclude<HTMLAttributes<'svg'>[Key], null>;
};

export type IconComponent = (props: IconAttributes) => unknown;

// Provider-neutral definitions are shared by the project catalog and renderer.
export interface IconDefinition {
	component: IconComponent;
	provider: string;
	aspectRatio: number;
	attributes: IconAttributes;
	supportsStrokeWidth: boolean;
}

export interface ComponentIconOptions {
	provider: string;
	width: number;
	height: number;
	attributes?: IconAttributes;
	supportsStrokeWidth?: boolean;
}

// Other libraries can normalize their Astro-compatible component here without
// adding provider branches or dependencies to the Icon atom.
export function componentIcon(component: IconComponent, options: ComponentIconOptions): IconDefinition {
	const { provider, width, height, attributes = {}, supportsStrokeWidth = false } = options;
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
		throw new Error(`Invalid icon dimensions for provider: ${provider}`);
	}
	return { component, provider, aspectRatio: width / height, attributes, supportsStrokeWidth };
}

export function lucideIcon(component: IconComponent): IconDefinition {
	return componentIcon(component, {
		provider: 'lucide',
		width: 24,
		height: 24,
		attributes: { 'stroke-width': 2 },
		supportsStrokeWidth: true,
	});
}

export function svgIcon(component: SvgComponent & Pick<ImageMetadata, 'width' | 'height'>): IconDefinition {
	return componentIcon(component, { provider: 'svg', width: component.width, height: component.height });
}
