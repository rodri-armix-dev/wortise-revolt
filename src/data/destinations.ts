import type { Page } from './pages';
import type { Locale } from '../i18n/config';
import { getPagePath } from '../i18n/routes';

// Destinations hosted by the original site are independent of local publication.
const externalSlugs: Partial<Record<Page, string>> = {
	contact: 'contact',
};

export function getDestinationHref(locale: Locale, page: Page): string | undefined {
	const slug = externalSlugs[page];
	return slug ? `https://wortise.com/${locale}/${slug}/` : getPagePath(locale, page);
}
