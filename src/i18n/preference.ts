import { isLocale, languageCookieMaxAge, languageCookieName } from './config';

// Delegation also covers selectors inserted during Astro client navigation.
document.addEventListener('click', (event) => {
	if (!(event.target instanceof Element)) return;
	const link = event.target.closest<HTMLAnchorElement>('a[data-language-choice]');
	const locale = link?.dataset.languageChoice;
	if (!link || !isLocale(locale) || new URL(link.href).origin !== location.origin) return;
	const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
	try {
		document.cookie = `${languageCookieName}=${locale}; Path=${base}; Max-Age=${languageCookieMaxAge}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
	} catch {
		// The language link still works when browser storage is blocked.
	}
});
