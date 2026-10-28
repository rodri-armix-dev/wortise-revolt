import Check from '@lucide/astro/icons/check';
import ArrowUpRight from '@lucide/astro/icons/arrow-up-right';
import ChevronLeft from '@lucide/astro/icons/chevron-left';
import ChevronRight from '@lucide/astro/icons/chevron-right';
import ChevronDown from '@lucide/astro/icons/chevron-down';
import ChevronUp from '@lucide/astro/icons/chevron-up';
import Menu from '@lucide/astro/icons/menu';
import X from '@lucide/astro/icons/x';
import LinkedIn from '../src/assets/icons/linkedin.svg';
import AdsAssisted from '../src/assets/icons/ads-assisted.svg';
import AdsManual from '../src/assets/icons/ads-manual.svg';
import AdsAudience from '../src/assets/icons/ads-audience.svg';
import AdsDesign from '../src/assets/icons/ads-design.svg';
import AdsImpact from '../src/assets/icons/ads-impact.svg';
import AdsViews from '../src/assets/icons/ads-views.svg';
import { lucideIcon, svgIcon } from '../src/lib/icons/providers';

// Stable content names belong to this project, not to a particular library.
export const iconRegistry = {
	check: { label: 'Check', ...lucideIcon(Check) },
	'arrow-up-right': { label: 'Arrow up right', ...lucideIcon(ArrowUpRight) },
	'chevron-left': { label: 'Chevron left', ...lucideIcon(ChevronLeft) },
	'chevron-right': { label: 'Chevron right', ...lucideIcon(ChevronRight) },
	'chevron-down': { label: 'Chevron down', ...lucideIcon(ChevronDown) },
	'chevron-up': { label: 'Chevron up', ...lucideIcon(ChevronUp) },
	menu: { label: 'Menu', ...lucideIcon(Menu) },
	x: { label: 'Close', ...lucideIcon(X) },
	linkedin: { label: 'LinkedIn', ...svgIcon(LinkedIn) },
	'ads-assisted': { label: 'Assisted mode', ...svgIcon(AdsAssisted) },
	'ads-manual': { label: 'Manual mode', ...svgIcon(AdsManual) },
	'ads-audience': { label: 'Audience', ...svgIcon(AdsAudience) },
	'ads-design': { label: 'Creative design', ...svgIcon(AdsDesign) },
	'ads-impact': { label: 'Impact', ...svgIcon(AdsImpact) },
	'ads-views': { label: 'Views', ...svgIcon(AdsViews) },
} as const;

export type IconName = keyof typeof iconRegistry;

export function isIconName(value: unknown): value is IconName {
	return typeof value === 'string' && Object.hasOwn(iconRegistry, value);
}

// Validate untrusted CMS fields before passing them to typed components.
export function parseIconName(value: unknown): IconName | undefined {
	return isIconName(value) ? value : undefined;
}

// Serializable options for a future CMS selector; no components or SVG payloads.
export function getIconOptions() {
	return (Object.keys(iconRegistry) as IconName[]).map((value) => ({ value, label: iconRegistry[value].label }));
}
