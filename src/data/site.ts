import { getDestinationHref } from './destinations';
import { getPublicationProfile, legalPages } from '../../config/publication';
import type { ComponentProps } from 'astro/types';
import type Footer from '../components/organisms/Footer/Footer.astro';
import type { Locale } from '../i18n/config';
import { getLanguageItems } from '../i18n/navigation';
import { getUiText } from '../i18n/ui';
import { footerData } from './footer';

// Keep the localized site shell independent of its future content source.
export function getSiteData(locale: Locale, pathname: string) {
	const footer: Omit<ComponentProps<typeof Footer>, 'locale'> = footerData[locale];
	const profile = getPublicationProfile();
	const contactHref = getDestinationHref(locale, 'contact');
	const legalItems = legalPages.flatMap(({ page, labels }) => {
		const href = getDestinationHref(locale, page);
		const label = labels[locale];
		return href && label ? [{ label, href }] : [];
	});
	return {
		header: { variant: profile.shell },
		includeFooterCTA: profile.includeFooterCTA,
		whatsapp: profile.whatsappHref
			? { href: profile.whatsappHref, label: getUiText(locale).contactWhatsApp }
			: undefined,
		footer: {
			...footer,
			variant: profile.shell,
			brand: { ...footer.brand, contact: { ...footer.brand.contact, href: contactHref ?? '', disabled: !contactHref } },
			legal: { ...footer.legal, items: profile.shell === 'compact' || legalPages.length ? legalItems : footer.legal.items },
			menus: footer.menus.map((menu) => ({
				...menu,
				items: menu.items.map((item) => ({
					...item,
					href: item.page ? getDestinationHref(locale, item.page) ?? '' : item.href,
				})),
			})),
			languages: { ...footer.languages, currentCode: locale, items: getLanguageItems(pathname) },
		},
	};
}
