import { getPublicationProfile } from '../../config/publication';
import { pageData, type Page, type LocalizedPages } from '../data/pages';
import { defaultLocale, isLocale, locales, type Locale } from './config';

export type { Page } from '../data/pages';

// Utility routes have no editorial modules and declare availability explicitly.
const utilityPageSlugs: Record<string, Partial<Record<Locale, string>>> = {
	ui: { [defaultLocale]: 'ui' },
};
type RoutePage = Page | 'ui';

export function normalizePath(pathname: string): string {
	return `${pathname.replace(/\/+$/, '')}/`;
}

export function getBasePath(basePath = import.meta.env.BASE_URL): string {
	return normalizePath(basePath);
}

export function removeBasePath(pathname: string, basePath = import.meta.env.BASE_URL): string {
	const base = getBasePath(basePath);
	const path = normalizePath(pathname);
	return path.startsWith(base) ? `/${path.slice(base.length)}` : path;
}

export function getLocaleFromPath(pathname: string, basePath = import.meta.env.BASE_URL): Locale {
	const [locale] = removeBasePath(pathname, basePath).split('/').filter(Boolean);
	return isLocale(locale) ? locale : defaultLocale;
}

export function isPage(value: string): value is Page {
	return Object.hasOwn(pageData, value);
}

export function getPageData(locale: Locale, page: Page) {
	return (pageData[page] as LocalizedPages)[locale];
}

export function getHomePage(): Page {
	return getPublicationProfile().homePage;
}

function getPublishedSlug(locale: Locale, page: RoutePage): string | undefined {
	const profile = getPublicationProfile();
	if (!isPage(page)) return profile.includeUi ? utilityPageSlugs[page]?.[locale] : undefined;
	if (profile.pages !== 'all' && !profile.pages.includes(page)) return undefined;
	const data = getPageData(locale, page);
	return data ? (page === profile.homePage ? '' : data.slug) : undefined;
}

// Never invent a URL for missing content or redirect to a different page.
export function getPagePath(locale: Locale, page: RoutePage, basePath = import.meta.env.BASE_URL): string | undefined {
	const slug = getPublishedSlug(locale, page);
	return slug !== undefined ? `${getBasePath(basePath)}${locale}/${slug ? `${slug}/` : ''}` : undefined;
}

export function getPageFromPath(pathname: string, basePath = import.meta.env.BASE_URL): RoutePage | undefined {
	const path = normalizePath(pathname);
	return ([...Object.keys(pageData), ...Object.keys(utilityPageSlugs)] as RoutePage[]).find((page) =>
		locales.some((locale) => getPagePath(locale, page, basePath) === path),
	);
}

export function getPublishedPages() {
	return (Object.keys(pageData) as Page[]).flatMap((key) =>
		locales.flatMap((locale) => {
			const page = getPageData(locale, key);
			const slug = getPublishedSlug(locale, key);
			return page && slug !== undefined ? [{ locale, page: { ...page, slug } }] : [];
		}),
	);
}
