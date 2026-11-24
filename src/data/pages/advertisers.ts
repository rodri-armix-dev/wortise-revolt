import type { ComponentProps } from 'astro/types';
import vanishImage from '../../assets/pages/wortise-ads/efficiency-dashboard.webp';
import armaniImage from '../../assets/pages/wortise-ads/creative-dashboard.webp';
import muglerImage from '../../assets/pages/wortise-ads/projection-dashboard.webp';
import type AdsSectionsScrollDriven from '../../components/organisms/AdsSectionsScrollDriven/AdsSectionsScrollDriven.astro';
import rawES from '../../content/pages/advertisers/es.json';
import type { Locale } from '../../i18n/config';
import { getPagePath } from '../../i18n/routes';
import { clientMarqueeES } from '../client-marquee';
import { descriptionHtml, headingHtml } from '../content/format';
import { readContent } from '../content/validate';
import { footerCTAVisuals } from '../footer-cta';
import type { ModulesPageData } from './page.types';

const contentES = readContent(rawES, 'pages/advertisers/es');
const { cases } = contentES;
const creatives = {
	vanish: { src: vanishImage, variant: 'efficiency' },
	armani: { src: armaniImage, variant: 'creative' },
	mugler: { src: muglerImage, variant: 'projection' },
} as const;

type AdsItem = ComponentProps<typeof AdsSectionsScrollDriven>['items'][number];

function caseItem(brand: keyof typeof creatives): AdsItem {
	const copy = cases.desktop[brand];
	const { src, variant } = creatives[brand];
	return {
		id: `advertisers-desktop-${brand}`,
		variant,
		heading: headingHtml(copy.title),
		badge: copy.badge,
		image: { src, alt: copy.imageAlt },
		description: { html: descriptionHtml(copy.description) },
		annotations: brand === 'armani' ? [
			{ position: 'top-end', ...cases.desktop.armani.visits },
			{ position: 'bottom-start', ...cases.desktop.armani.purchases },
		] : undefined,
		action: { label: cases.contact, variant: 'tertiary', icon: 'arrow-up-right', get href(): string | undefined { return getPagePath('es', 'contact'); }, get disabled(): boolean { return !this.href; } },
	};
}

export const advertisersPageData = {
	es: {
		key: 'advertisers',
		slug: contentES.slug,
		meta: contentES.meta,
		footerCTA: {
			...footerCTAVisuals,
			actionPage: 'contact',
			text: {
				heading: { html: headingHtml(contentES.callToAction.title), tag: 'h2' },
				description: { html: descriptionHtml(contentES.callToAction.description) },
				actions: {
					primary: { label: contentES.callToAction.button, variant: 'primary-special', size: 'large' },
				},
			},
		},
		modules: [{
			type: 'advertisers-cover',
			props: {
				textBlock: {
					responsiveAlignment: { l: 'center' },
					eyebrow: { label: contentES.hero.eyebrow },
					heading: { html: headingHtml(contentES.hero.title), tag: 'h1', size: { s: 'display-sm', l: 'display-xl' } },
					description: { html: descriptionHtml(contentES.hero.description) },
					actions: {
						primary: { label: contentES.hero.button, variant: 'primary-special', size: 'large', get href(): string | undefined { return getPagePath('es', 'contact'); }, get disabled(): boolean { return !this.href; } },
					},
				},
			},
		}, {
			type: 'ads-sections',
			props: {
				items: [caseItem('vanish'), caseItem('armani'), caseItem('mugler')],
			},
		}, {
			type: 'advertisers-clients',
			props: {
				marquee: clientMarqueeES,
				textBlock: {
					alignment: 'center',
					eyebrow: { label: contentES.clients.eyebrow },
					heading: { html: headingHtml(contentES.clients.title), tag: 'h2', size: { s: 'title-lg', l: 'display-md' } },
				},
			},
		}],
	},
} satisfies Partial<Record<Locale, ModulesPageData<'advertisers'>>>;
