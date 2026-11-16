import type { Page } from './pages';
import type { Locale } from '../i18n/config';
import { getPagePath } from '../i18n/routes';

export function getDestinationHref(locale: Locale, page: Page): string | undefined {
	return getPagePath(locale, page);
}
