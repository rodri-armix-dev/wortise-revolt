import { externalButtons } from './external-buttons';
import { headingHtml, descriptionHtml } from './content/format';
import { contactCTA } from './contact-cta';
import { readContent } from './content/validate';
import rawES from '../content/pages/home/es.json';
import rawEN from '../content/pages/home/en.json';

import { footerCTAVisuals } from './footer-cta';
import { clientMarqueeES } from './client-marquee';
import { worldLocations } from './world';
import { kpiItems } from './kpis';
import { homeGalleryItems } from './gallery';
import wortiseW from '../assets/global/branding/wortise-symbol.png';
import glow from '../assets/pages/home/glow.svg?url';
import developersPreview from '../assets/pages/home/developers-screen.webp';
import advertisersPreview from '../assets/pages/home/advertisers-screen.webp';
import wortiseAdsPreview from '../assets/pages/home/wortise-ads-screen.webp';
import type { Locale } from '../i18n/config';
import type { ModulesPageData } from './pages/page.types';

const contentES = readContent(rawES, 'pages/home/es');
const contentEN = readContent(rawEN, 'pages/home/en');

export type HomeData = ModulesPageData<'home'>;

export const homeRecruitingModuleES = {
	type: 'recruiting-section',
	props: {
		id: 'busquedas-activas',
		textBlock: {
			eyebrow: { label: contentES.careers.eyebrow },
			heading: { html: headingHtml(contentES.careers.title), tag: 'h2' },
			description: {
				size: 'normal',
				html: descriptionHtml(contentES.careers.description),
			},
		},
		items: [
			// Temporary destinations for interaction previews until job URLs are available.
			{ id: 'technical-lead-1', title: contentES.careers.items['technical-lead-1'].title, location: contentES.careers.items['technical-lead-1'].location, href: externalButtons.es.careersJobs['technical-lead-1'].url },
			{ id: 'technical-lead-2', title: contentES.careers.items['technical-lead-2'].title, location: contentES.careers.items['technical-lead-2'].location, href: externalButtons.es.careersJobs['technical-lead-2'].url },
			{ id: 'technical-lead-3', title: contentES.careers.items['technical-lead-3'].title, location: contentES.careers.items['technical-lead-3'].location, href: externalButtons.es.careersJobs['technical-lead-3'].url },
		],
		action: { label: contentES.careers.button, href: externalButtons.es.careersUrl },
	},
} satisfies HomeData['modules'][number];

export const homeData = {
	es: {
		key: 'home',
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
				type: 'hero',
				props: {
					content: {
						eyebrow: { label: contentES.hero.eyebrow },
						heading: {
							tag: 'h1',
							html: headingHtml(contentES.hero.title),
						},
						description: {
							size: 'normal',
							html: descriptionHtml(contentES.hero.description),
						},
						actions: { primary: { label: contentES.hero.button, variant: 'primary-special' } },
					},
					visual: { image: wortiseW, background: glow, effect: 'wortise-3d' },
					actionPage: 'wortise-ads',
				},
			},
			{
				type: 'logo-marquee',
				props: clientMarqueeES,
			},
			{
				type: 'audience-sections',
				props: {
					items: [
						{
							variant: 'developers',
							eyebrow: contentES.solutions.items['1'].eyebrow,
							heading: headingHtml(contentES.solutions.items['1'].title),
							description: descriptionHtml(contentES.solutions.items['1'].description),
							image: { src: developersPreview, alt: contentES.solutions.items['1'].imageAlt },
							action: { label: contentES.solutions.items['1'].button },
						},
						{
							variant: 'advertisers',
							eyebrow: contentES.solutions.items['2'].eyebrow,
							heading: headingHtml(contentES.solutions.items['2'].title),
							description: descriptionHtml(contentES.solutions.items['2'].description),
							image: { src: advertisersPreview, alt: contentES.solutions.items['2'].imageAlt },
							action: { label: contentES.solutions.items['2'].button },
						},
						{
							variant: 'wortise-ads',
							eyebrow: contentES.solutions.items['3'].eyebrow,
							heading: headingHtml(contentES.solutions.items['3'].title),
							description: descriptionHtml(contentES.solutions.items['3'].description),
							image: { src: wortiseAdsPreview, alt: contentES.solutions.items['3'].imageAlt },
							action: { label: contentES.solutions.items['3'].button, page: 'wortise-ads' },
						},
					],
				},
			},
			{
				type: 'world-solutions',
				props: {
					locations: worldLocations,
					content: {
						eyebrow: { label: contentES.world.eyebrow },
						heading: {
							tag: 'h2',
							html: headingHtml(contentES.world.title),
						},
						description: {
							size: 'normal',
							html: descriptionHtml(contentES.world.description),
						},
					},
				},
			},
			{
				type: 'kpis',
				props: {
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
					label: contentES.team.label,
					textBlock: {
						alignment: 'center',
						eyebrow: { label: contentES.team.eyebrow },
						heading: {
							tag: 'h2',
							html: headingHtml(contentES.team.title),
						},
						description: {
							html: descriptionHtml(contentES.team.description),
						},
					},
					items: homeGalleryItems,
				},
			},
			homeRecruitingModuleES,
		],
	},
	en: {
		key: 'home',
		slug: contentEN.slug,
		meta: {
			title: contentEN.meta.title,
			description: contentEN.meta.description,
		},
		footerCTA: {
			actionPage: 'contact',
			...footerCTAVisuals,
			text: {
				heading: { html: headingHtml(contactCTA.en.title), tag: 'h2' },
				description: { html: descriptionHtml(contactCTA.en.description) },
				actions: { primary: { label: contactCTA.en.button, href: externalButtons.en.contactUrl, variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'hero',
				props: { heading: headingHtml(contentEN.hero.title) },
			},
		],
	},
} satisfies Partial<Record<Locale, HomeData>>;
