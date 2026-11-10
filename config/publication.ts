import { readContent } from '../src/data/content/validate';
import rawPT from '../src/content/global/navigation/pt.json';
import rawEN from '../src/content/global/navigation/en.json';
import rawES from '../src/content/global/navigation/es.json';
import type { Page } from '../src/data/pages';
import type { Locale } from '../src/i18n/config';

const navigationPT = readContent(rawPT, 'global/navigation/pt');
const navigationEN = readContent(rawEN, 'global/navigation/en');
const navigationES = readContent(rawES, 'global/navigation/es');

// Register legal pages in src/data/pages first, then add their keys here.
// Missing translations remain unpublished, just like other editorial pages.
export const legalPages: { page: Page; labels: Partial<Record<Locale, string>> }[] = [
	{ page: 'sdk-terms', labels: { es: navigationES.legal['sdk-terms'], en: navigationEN.legal['sdk-terms'], pt: navigationPT.legal['sdk-terms'] } },
	{ page: 'terms', labels: { es: navigationES.legal.terms, en: navigationEN.legal.terms, pt: navigationPT.legal.terms } },
	{ page: 'privacy', labels: { es: navigationES.legal.privacy, en: navigationEN.legal.privacy, pt: navigationPT.legal.privacy } },
];

interface PublicationProfile {
	homePage: Page;
	pages: 'all' | readonly Page[];
	shell: 'full' | 'compact';
	includeUi: boolean;
	includeFooterCTA: boolean;
	pruneUnusedAssets: boolean;
	includeWhatsApp?: boolean;
}

export const publicationProfiles = {
	full: {
		homePage: 'home',
		pages: 'all',
		shell: 'full',
		includeUi: import.meta.env.DEV,
		includeFooterCTA: true,
		pruneUnusedAssets: false,
	},
	launch: {
		homePage: 'wortise-ads',
		pages: ['wortise-ads', ...legalPages.map(({ page }) => page)],
		shell: 'compact',
		includeUi: false,
		includeFooterCTA: true,
		pruneUnusedAssets: true,
		includeWhatsApp: true,
	},
} satisfies Record<string, PublicationProfile>;

export function getPublicationProfile(mode = import.meta.env.MODE): PublicationProfile {
	return mode === 'launch' ? publicationProfiles.launch : publicationProfiles.full;
}
