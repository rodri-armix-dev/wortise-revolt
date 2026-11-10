import { externalButtons } from '../external-buttons';
import { headingHtml, descriptionHtml } from '../content/format';
import { contactCTA } from '../contact-cta';
import { readContent } from '../content/validate';
import rawES from '../../content/pages/about/es.json';

import { footerCTAVisuals } from '../footer-cta';
import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';
import aboutUsCoverImage from '../../assets/pages/about/team-cover.webp';
import { kpiItems } from '../kpis';
import { aboutGalleryItems } from '../gallery';

const contentES = readContent(rawES, 'pages/about/es');

export const aboutPageKey = 'about' as const;

export type AboutPageData = ModulesPageData<typeof aboutPageKey>;

export const aboutPageData = {
	es: {
		key: aboutPageKey,
		slug: contentES.slug,
		meta: {
			title: contentES.meta.title,
			description: contentES.meta.description,
		},
		footerCTA: {
			actionPage: 'contact',
			...footerCTAVisuals,
			text: {
				heading: { html: headingHtml(contactCTA.es.title), tag: 'h2' },
				description: { html: descriptionHtml(contactCTA.es.description) },
				actions: { primary: { label: contactCTA.es.button, href: externalButtons.es.contactUrl, variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'about-us-cover',
				props: {
					image: {
						src: aboutUsCoverImage,
						alt: contentES.hero.imageAlt,
						radius: 'normal',
						loading: 'eager',
					},
					textBlock: {
						alignment: 'left',
						responsiveAlignment: { m: 'center' },
						eyebrow: { label: contentES.hero.eyebrow },
						heading: {
							html: headingHtml(contentES.hero.title),
							tag: 'h1',
						},
						description: {
							html: descriptionHtml(contentES.hero.description),
						},
					},
				},
			},
			{
				type: 'kpis',
				props: {
					variant: 'vision',
					textBlock: {
						eyebrow: { label: contentES.statistics.eyebrow },
						heading: {
							tag: 'h2',
							html: headingHtml(contentES.statistics.title),
						},
					},
					items: kpiItems,
				},
			},
			{
				type: 'image-gallery',
				props: {
					variant: 'office',
					label: contentES.team.label,
					items: aboutGalleryItems,
				},
			},
		],
	},
} satisfies Partial<Record<Locale, AboutPageData>>;
