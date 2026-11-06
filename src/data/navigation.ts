import { getDestinationHref } from './destinations';
import { localeLabels, locales, type Locale } from '../i18n/config';
import { isPage } from '../i18n/routes';

export interface NavigationLink {
	id: string;
	label: string;
	href: string;
	children?: NavigationLink[];
}

export interface LanguageItem {
	code: Locale;
	label: string;
	href: string;
	available: boolean;
}

export const contactActionData = {
	es: { label: 'Crear Usuario', href: 'https://ads.wortise.com' },
	en: { label: 'Create Account', href: 'https://ads.wortise.com' },
	pt: { label: 'Criar Usuário', href: 'https://ads.wortise.com' },
} satisfies Record<Locale, { label: string; href: string }>;

// Availability belongs to a page, never to the language itself.
export const langMenuData: LanguageItem[] = locales.map((code) => ({
	code,
	label: localeLabels[code],
	href: '',
	available: false,
}));

export const mainMenuData: Record<Locale, NavigationLink[]> = {
	es: [
		{
			id: 'advertisers',
			label: 'Anunciantes',
			href: '',
		},
		{
			id: 'developers',
			label: 'Desarrolladores',
			href: '',
		},
		{
			id: 'wortise-ads',
			label: 'Wortise Ads',
			href: '',
		},
		{
			id: 'about',
			label: 'Nosotros',
			href: '',
		},
		{
			id: 'resources',
			label: 'Recursos',
			href: '',
			children: [
				{
					id: 'blog',
					label: 'Blog',
					href: '',
				},
				{
					id: 'glossary',
					label: 'Glosario',
					href: '',
				},
				{
					id: 'sdk-documentation',
					label: 'Documentación del SDK',
					href: '',
				},
			],
		},
	],
	en: [
		{ id: 'advertisers', label: 'Advertisers', href: '' },
		{ id: 'developers', label: 'Developers', href: '' },
		{ id: 'wortise-ads', label: 'Wortise Ads', href: '' },
		{ id: 'about', label: 'About us', href: '' },
		{
			id: 'resources', label: 'Resources', href: '',
			children: [
				{ id: 'blog', label: 'Blog', href: '' },
				{ id: 'glossary', label: 'Glossary', href: '' },
				{ id: 'sdk-documentation', label: 'SDK documentation', href: '' },
			],
		},
	],
	pt: [
		{ id: 'advertisers', label: 'Anunciantes', href: '' },
		{ id: 'developers', label: 'Desenvolvedores', href: '' },
		{ id: 'wortise-ads', label: 'Wortise Ads', href: '' },
		{ id: 'about', label: 'Sobre nós', href: '' },
		{
			id: 'resources', label: 'Recursos', href: '',
			children: [
				{ id: 'blog', label: 'Blog', href: '' },
				{ id: 'glossary', label: 'Glossário', href: '' },
				{ id: 'sdk-documentation', label: 'Documentação do SDK', href: '' },
			],
		},
	],
};

export function getMainMenuItems(locale: Locale): NavigationLink[] {
	const resolve = (item: NavigationLink): NavigationLink => ({
		...item,
		href: isPage(item.id) ? getDestinationHref(locale, item.id) ?? '' : item.href,
		children: item.children?.map(resolve),
	});
	return mainMenuData[locale].map(resolve);
}

export function getContactAction(locale: Locale) {
	return { ...contactActionData[locale], disabled: false };
}
