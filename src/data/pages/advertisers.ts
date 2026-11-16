import type { ComponentProps } from 'astro/types';
import vanishImage from '../../assets/pages/wortise-ads/efficiency-dashboard.webp';
import armaniImage from '../../assets/pages/wortise-ads/creative-dashboard.webp';
import muglerImage from '../../assets/pages/wortise-ads/projection-dashboard.webp';
import type AdsSections from '../../components/organisms/AdsSections/AdsSections.astro';
import rawES from '../../content/pages/advertisers/es.json';
import type { Locale } from '../../i18n/config';
import { clientMarqueeES } from '../client-marquee';
import { descriptionHtml, headingHtml } from '../content/format';
import { readContent } from '../content/validate';
import { externalButtons } from '../external-buttons';
import { footerCTAVisuals } from '../footer-cta';
import type { ModulesPageData } from './page.types';

const contentES = readContent(rawES, 'pages/advertisers/es');
const contactHref = externalButtons.es.contactUrl;
const demoHref = externalButtons.es.demoUrl;
const { cases } = contentES;
const creatives = {
	vanish: { src: vanishImage, variant: 'efficiency' },
	armani: { src: armaniImage, variant: 'creative' },
	mugler: { src: muglerImage, variant: 'projection' },
} as const;

type AdsItem = ComponentProps<typeof AdsSections>['items'][number];

function caseItem(brand: keyof typeof creatives, range: 'desktop' | 'mobile'): AdsItem {
	const copy = cases[range][brand];
	const { src, variant } = creatives[brand];
	const isDesktop = range === 'desktop';
	return {
		id: `advertisers-${range}-${brand}`,
		variant,
		heading: headingHtml(copy.title),
		badge: copy.badge,
		image: { src, alt: copy.imageAlt },
		description: { html: descriptionHtml(copy.description) },
		annotations: isDesktop && brand === 'armani' ? [
			{ position: 'top-end', ...cases.desktop.armani.visits },
			{ position: 'bottom-start', ...cases.desktop.armani.purchases },
		] : undefined,
		action: isDesktop
			? { label: cases.contact, href: contactHref || undefined, variant: 'tertiary', icon: 'arrow-up-right', disabled: !contactHref }
			: { label: cases.demo, href: demoHref || undefined, variant: 'primary', target: '_blank', disabled: !demoHref },
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
						primary: { label: contentES.hero.button, variant: 'primary-special', size: 'large', href: contactHref || undefined, disabled: !contactHref },
					},
				},
			},
		}, {
			type: 'ads-sections',
			props: {
				range: 'desktop',
				items: [caseItem('vanish', 'desktop'), caseItem('armani', 'desktop'), caseItem('mugler', 'desktop')],
			},
		}, {
			type: 'ads-sections',
			props: {
				range: 'mobile',
				items: [caseItem('vanish', 'mobile'), caseItem('mugler', 'mobile'), caseItem('armani', 'mobile')],
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
