export const locales = ['es', 'en', 'pt'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const languageCookieName = 'wortise_locale';
export const languageCookieMaxAge = 60 * 60 * 24 * 365;

export const localeLabels = { es: 'Español', en: 'English', pt: 'Português' } satisfies Record<Locale, string>;

export function isLocale(value: string | undefined): value is Locale {
	return locales.some((locale) => locale === value);
}
