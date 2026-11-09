import type { Page } from '../src/data/pages';
import type { Locale } from '../src/i18n/config';

// Register legal pages in src/data/pages first, then add their keys here.
// Missing translations remain unpublished, just like other editorial pages.
export const legalPages: { page: Page; labels: Partial<Record<Locale, string>> }[] = [
	{ page: 'sdk-terms', labels: { es: 'Términos del SDK', en: 'SDK Terms', pt: 'Termos do SDK' } },
	{ page: 'terms', labels: { es: 'Términos y condiciones', en: 'Terms and Conditions', pt: 'Termos e condições' } },
	{ page: 'privacy', labels: { es: 'Privacidad', en: 'Privacy', pt: 'Privacidade' } },
];

interface PublicationProfile {
	homePage: Page;
	pages: 'all' | readonly Page[];
	shell: 'full' | 'compact';
	includeUi: boolean;
	includeFooterCTA: boolean;
	pruneUnusedAssets: boolean;
	whatsappHref?: string;
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
		whatsappHref: 'https://wa.link/81h5wa',
	},
} satisfies Record<string, PublicationProfile>;

export function getPublicationProfile(mode = import.meta.env.MODE): PublicationProfile {
	return mode === 'launch' ? publicationProfiles.launch : publicationProfiles.full;
}
