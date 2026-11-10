import { externalButtons } from './external-buttons';
import { readContent } from './content/validate';
import rawES from '../content/global/navigation/es.json';
import rawEN from '../content/global/navigation/en.json';
import rawPT from '../content/global/navigation/pt.json';

import { getDestinationHref } from './destinations';
import { localeLabels, locales, type Locale } from '../i18n/config';
import { isPage } from '../i18n/routes';

const contentES = readContent(rawES, 'global/navigation/es');
const contentEN = readContent(rawEN, 'global/navigation/en');
const contentPT = readContent(rawPT, 'global/navigation/pt');

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
	es: { label: contentES.account.label, href: externalButtons.es.createAccountUrl },
	en: { label: contentEN.account.label, href: externalButtons.en.createAccountUrl },
	pt: { label: contentPT.account.label, href: externalButtons.pt.createAccountUrl },
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
			label: contentES.menu.advertisers.label,
			href: '',
		},
		{
			id: 'developers',
			label: contentES.menu.developers.label,
			href: '',
		},
		{
			id: 'wortise-ads',
			label: contentES.menu['wortise-ads'].label,
			href: '',
		},
		{
			id: 'about',
			label: contentES.menu.about.label,
			href: '',
		},
		{
			id: 'resources',
			label: contentES.menu.resources.label,
			href: '',
			children: [
				{
					id: 'blog',
					label: contentES.menu.resources.children.blog.label,
					href: '',
				},
				{
					id: 'glossary',
					label: contentES.menu.resources.children.glossary.label,
					href: externalButtons.es.glossaryUrl,
				},
				{
					id: 'sdk-documentation',
					label: contentES.menu.resources.children['sdk-documentation'].label,
					href: externalButtons.es.sdkDocumentationUrl,
				},
			],
		},
	],
	en: [
		{ id: 'advertisers', label: contentEN.menu.advertisers.label, href: '' },
		{ id: 'developers', label: contentEN.menu.developers.label, href: '' },
		{ id: 'wortise-ads', label: contentEN.menu['wortise-ads'].label, href: '' },
		{ id: 'about', label: contentEN.menu.about.label, href: '' },
		{
			id: 'resources', label: contentEN.menu.resources.label, href: '',
			children: [
				{ id: 'blog', label: contentEN.menu.resources.children.blog.label, href: '' },
				{ id: 'glossary', label: contentEN.menu.resources.children.glossary.label, href: externalButtons.en.glossaryUrl },
				{ id: 'sdk-documentation', label: contentEN.menu.resources.children['sdk-documentation'].label, href: externalButtons.en.sdkDocumentationUrl },
			],
		},
	],
	pt: [
		{ id: 'advertisers', label: contentPT.menu.advertisers.label, href: '' },
		{ id: 'developers', label: contentPT.menu.developers.label, href: '' },
		{ id: 'wortise-ads', label: contentPT.menu['wortise-ads'].label, href: '' },
		{ id: 'about', label: contentPT.menu.about.label, href: '' },
		{
			id: 'resources', label: contentPT.menu.resources.label, href: '',
			children: [
				{ id: 'blog', label: contentPT.menu.resources.children.blog.label, href: '' },
				{ id: 'glossary', label: contentPT.menu.resources.children.glossary.label, href: externalButtons.pt.glossaryUrl },
				{ id: 'sdk-documentation', label: contentPT.menu.resources.children['sdk-documentation'].label, href: externalButtons.pt.sdkDocumentationUrl },
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
	return { ...contactActionData[locale], disabled: !contactActionData[locale].href };
}
