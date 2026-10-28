import { defaultLocale, languageCookieName, type Locale } from './config.js';

export interface LanguageRouting {
	basePath: string;
	homes: Partial<Record<Locale, string>>;
}

function savedLanguage(cookie: string): string | undefined {
	const value = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${languageCookieName}=`));
	try {
		return value ? decodeURIComponent(value.slice(languageCookieName.length + 1)) : undefined;
	} catch {
		return undefined;
	}
}

export function selectLanguage(header: string, cookie: string, homes: LanguageRouting['homes']): Locale {
	const available = Object.keys(homes) as Locale[];
	const saved = savedLanguage(cookie);
	if (available.some((locale) => locale === saved)) return saved as Locale;

	const preferences = header.split(',').map((entry, order) => {
		const [range = '', ...parameters] = entry.trim().toLowerCase().split(';');
		const quality = parameters.map((parameter) => parameter.trim()).find((parameter) => parameter.startsWith('q='));
		const value = quality ? quality.slice(2) : '1';
		const weight = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(value) ? Number(value) : 0;
		return { range, weight, order };
	}).filter(({ range }) => /^(?:[a-z]{1,8}(?:-[a-z0-9]{1,8})*|\*)$/.test(range));

	// An explicit exclusion takes precedence over a broader wildcard.
	const excluded = new Set(preferences.filter(({ weight }) => weight === 0).map(({ range }) => range));
	for (const { range, weight } of preferences.sort((a, b) => b.weight - a.weight || a.order - b.order)) {
		if (weight === 0) continue;
		const locale = range.split('-')[0];
		if (range === '*') {
			const match = available.find((candidate) => !excluded.has(candidate) && !excluded.has('*'));
			if (match) return match;
		} else if (!excluded.has(range) && !excluded.has(locale) && available.includes(locale as Locale)) {
			return locale as Locale;
		}
	}
	return defaultLocale;
}

export function languageRedirect(request: Request, routing: LanguageRouting): Response {
	const url = new URL(request.url);
	if (url.pathname !== routing.basePath || !['GET', 'HEAD'].includes(request.method)) {
		return new Response(null, { headers: { 'x-middleware-next': '1' } });
	}
	const locale = selectLanguage(request.headers.get('accept-language') ?? '', request.headers.get('cookie') ?? '', routing.homes);
	const home = routing.homes[locale];
	if (!home) throw new Error('The default locale must have a published home page.');
	url.pathname = home;
	return new Response(null, {
		status: 307,
		headers: {
			Location: url.href,
			'Cache-Control': 'private, no-store',
			Vary: 'Accept-Language, Cookie',
		},
	});
}
