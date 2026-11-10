import { externalButtons } from '../external-buttons';
import { headingHtml, descriptionHtml } from '../content/format';
import { readContent } from '../content/validate';
import rawES from '../../content/pages/wortise-ads/es.json';
import rawEN from '../../content/pages/wortise-ads/en.json';
import rawPT from '../../content/pages/wortise-ads/pt.json';

import { wortiseVideos } from '../videos';
import { footerCTAVisuals } from '../footer-cta';
import efficiencyImage from '../../assets/pages/wortise-ads/efficiency-dashboard.webp';
import projectionImage from '../../assets/pages/wortise-ads/projection-dashboard.webp';
import creativeImage from '../../assets/pages/wortise-ads/creative-dashboard.webp';
import reportingImage from '../../assets/pages/wortise-ads/reporting-dashboard.webp';
import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';

const contentES = readContent(rawES, 'pages/wortise-ads/es');
const contentEN = readContent(rawEN, 'pages/wortise-ads/en');
const contentPT = readContent(rawPT, 'pages/wortise-ads/pt');


export const wortiseAdsPageKey = 'wortise-ads' as const;

export type WortiseAdsPageData = ModulesPageData<typeof wortiseAdsPageKey>;

export const wortiseAdsPageData = {
	es: {
		key: wortiseAdsPageKey,
		slug: contentES.slug,
		meta: {
			title: contentES.meta.title,
			description: contentES.meta.description,
		},
		footerCTA: {
			...footerCTAVisuals,
			text: {
				heading: { html: headingHtml(contentES.callToAction.title), tag: 'h2' },
				description: { html: descriptionHtml(contentES.callToAction.description) },
				actions: { primary: { label: contentES.callToAction.button, href: externalButtons.es.demoUrl, target: '_blank', variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'ads-cover',
				props: {
					textBlock: {
						heading: {
							tag: 'h1',
							html: headingHtml(contentES.hero.title),
						},
						description: {
							html: descriptionHtml(contentES.hero.description),
						},
						actions: {
							primary: { label: contentES.hero.button, href: externalButtons.es.demoUrl, target: '_blank', variant: 'primary-special', size: 'large' },
						},
					},
				},
			},
			{
				type: 'ads-sections',
				props: {
					items: [
						{
							id: 'campaigns',
							variant: 'efficiency',
							heading: headingHtml(contentES.features.items.campaigns.title),
							badge: 'Más eficiencia',
							image: { src: efficiencyImage, alt: contentES.features.items.campaigns.imageAlt },
							description: { html: descriptionHtml(contentES.features.items.campaigns.description) },
							action: { label: contentES.features.items.campaigns.button, href: externalButtons.es.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-assisted', label: contentES.features.items.campaigns.annotations['1'].label },
								{ position: 'bottom-start', icon: 'ads-manual', label: contentES.features.items.campaigns.annotations['2'].label },
							],
						},
						{
							id: 'projection',
							variant: 'projection',
							heading: headingHtml(contentES.features.items.projection.title),
							badge: 'Más proyección',
							image: { src: projectionImage, alt: contentES.features.items.projection.imageAlt },
							description: { html: descriptionHtml(contentES.features.items.projection.description) },
							action: { label: contentES.features.items.projection.button, href: externalButtons.es.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', value: contentES.features.items.projection.annotations['1'].value, label: contentES.features.items.projection.annotations['1'].label },
								{ position: 'bottom-start', value: contentES.features.items.projection.annotations['2'].value, label: contentES.features.items.projection.annotations['2'].label },
								{ position: 'side-end', icon: 'ads-audience' },
							],
						},
						{
							id: 'creative',
							variant: 'creative',
							heading: headingHtml(contentES.features.items.creative.title),
							badge: 'Más impacto',
							image: { src: creativeImage, alt: contentES.features.items.creative.imageAlt },
							description: { html: descriptionHtml(contentES.features.items.creative.description) },
							action: { label: contentES.features.items.creative.button, href: externalButtons.es.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-design', label: contentES.features.items.creative.annotations['1'].label },
								{ position: 'bottom-start', icon: 'ads-impact', label: contentES.features.items.creative.annotations['2'].label },
							],
						},
						{
							id: 'reporting',
							variant: 'reporting',
							heading: headingHtml(contentES.features.items.reporting.title),
							badge: 'Más control',
							image: { src: reportingImage, alt: contentES.features.items.reporting.imageAlt },
							description: { html: descriptionHtml(contentES.features.items.reporting.description) },
							action: { label: contentES.features.items.reporting.button, href: externalButtons.es.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-start', icon: 'ads-views', label: contentES.features.items.reporting.annotations['1'].label },
								{ position: 'bottom-end', value: contentES.features.items.reporting.annotations['2'].value, label: contentES.features.items.reporting.annotations['2'].label },
							],
						},
					],
				},
			},
			{ type: 'video-section', props: { video: wortiseVideos.es } },
		],
	},
	en: {
		key: wortiseAdsPageKey,
		slug: contentEN.slug,
		meta: {
			title: contentEN.meta.title,
			description: contentEN.meta.description,
		},
		footerCTA: {
			...footerCTAVisuals,
			text: {
				heading: { html: headingHtml(contentEN.callToAction.title), tag: 'h2' },
				description: { html: descriptionHtml(contentEN.callToAction.description) },
				actions: { primary: { label: contentEN.callToAction.button, href: externalButtons.en.demoUrl, target: '_blank', variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'ads-cover',
				props: {
					textBlock: {
						heading: {
							tag: 'h1',
							html: headingHtml(contentEN.hero.title),
						},
						description: {
							html: descriptionHtml(contentEN.hero.description),
						},
						actions: {
							primary: { label: contentEN.hero.button, href: externalButtons.en.demoUrl, target: '_blank', variant: 'primary-special', size: 'large' },
						},
					},
				},
			},
			{
				type: 'ads-sections',
				props: {
					items: [
						{
							id: 'campaigns',
							variant: 'efficiency',
							heading: headingHtml(contentEN.features.items.campaigns.title),
							badge: 'Greater efficiency',
							image: { src: efficiencyImage, alt: contentEN.features.items.campaigns.imageAlt },
							description: { html: descriptionHtml(contentEN.features.items.campaigns.description) },
							action: { label: contentEN.features.items.campaigns.button, href: externalButtons.en.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-assisted', label: contentEN.features.items.campaigns.annotations['1'].label },
								{ position: 'bottom-start', icon: 'ads-manual', label: contentEN.features.items.campaigns.annotations['2'].label },
							],
						},
						{
							id: 'projection',
							variant: 'projection',
							heading: headingHtml(contentEN.features.items.projection.title),
							badge: 'Better forecasting',
							image: { src: projectionImage, alt: contentEN.features.items.projection.imageAlt },
							description: { html: descriptionHtml(contentEN.features.items.projection.description) },
							action: { label: contentEN.features.items.projection.button, href: externalButtons.en.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', value: contentEN.features.items.projection.annotations['1'].value, label: contentEN.features.items.projection.annotations['1'].label },
								{ position: 'bottom-start', value: contentEN.features.items.projection.annotations['2'].value, label: contentEN.features.items.projection.annotations['2'].label },
								{ position: 'side-end', icon: 'ads-audience' },
							],
						},
						{
							id: 'creative',
							variant: 'creative',
							heading: headingHtml(contentEN.features.items.creative.title),
							badge: 'Greater impact',
							image: { src: creativeImage, alt: contentEN.features.items.creative.imageAlt },
							description: { html: descriptionHtml(contentEN.features.items.creative.description) },
							action: { label: contentEN.features.items.creative.button, href: externalButtons.en.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-design', label: contentEN.features.items.creative.annotations['1'].label },
								{ position: 'bottom-start', icon: 'ads-impact', label: contentEN.features.items.creative.annotations['2'].label },
							],
						},
						{
							id: 'reporting',
							variant: 'reporting',
							heading: headingHtml(contentEN.features.items.reporting.title),
							badge: 'Greater control',
							image: { src: reportingImage, alt: contentEN.features.items.reporting.imageAlt },
							description: { html: descriptionHtml(contentEN.features.items.reporting.description) },
							action: { label: contentEN.features.items.reporting.button, href: externalButtons.en.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-start', icon: 'ads-views', label: contentEN.features.items.reporting.annotations['1'].label },
								{ position: 'bottom-end', value: contentEN.features.items.reporting.annotations['2'].value, label: contentEN.features.items.reporting.annotations['2'].label },
							],
						},
					],
				},
			},
			{
				type: 'video-section',
				props: {
					video: wortiseVideos.en,
				},
			},
		],
	},
	pt: {
		key: wortiseAdsPageKey,
		slug: contentPT.slug,
		meta: {
			title: contentPT.meta.title,
			description: contentPT.meta.description,
		},
		footerCTA: {
			...footerCTAVisuals,
			text: {
				heading: { html: headingHtml(contentPT.callToAction.title), tag: 'h2' },
				description: { html: descriptionHtml(contentPT.callToAction.description) },
				actions: { primary: { label: contentPT.callToAction.button, href: externalButtons.pt.demoUrl, target: '_blank', variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'ads-cover',
				props: {
					textBlock: {
						heading: {
							tag: 'h1',
							html: headingHtml(contentPT.hero.title),
						},
						description: {
							html: descriptionHtml(contentPT.hero.description),
						},
						actions: {
							primary: { label: contentPT.hero.button, href: externalButtons.pt.demoUrl, target: '_blank', variant: 'primary-special', size: 'large' },
						},
					},
				},
			},
			{
				type: 'ads-sections',
				props: {
					items: [
						{
							id: 'campaigns',
							variant: 'efficiency',
							heading: headingHtml(contentPT.features.items.campaigns.title),
							badge: 'Mais eficiência',
							image: { src: efficiencyImage, alt: contentPT.features.items.campaigns.imageAlt },
							description: { html: descriptionHtml(contentPT.features.items.campaigns.description) },
							action: { label: contentPT.features.items.campaigns.button, href: externalButtons.pt.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-assisted', label: contentPT.features.items.campaigns.annotations['1'].label },
								{ position: 'bottom-start', icon: 'ads-manual', label: contentPT.features.items.campaigns.annotations['2'].label },
							],
						},
						{
							id: 'projection',
							variant: 'projection',
							heading: headingHtml(contentPT.features.items.projection.title),
							badge: 'Mais previsibilidade',
							image: { src: projectionImage, alt: contentPT.features.items.projection.imageAlt },
							description: { html: descriptionHtml(contentPT.features.items.projection.description) },
							action: { label: contentPT.features.items.projection.button, href: externalButtons.pt.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', value: contentPT.features.items.projection.annotations['1'].value, label: contentPT.features.items.projection.annotations['1'].label },
								{ position: 'bottom-start', value: contentPT.features.items.projection.annotations['2'].value, label: contentPT.features.items.projection.annotations['2'].label },
								{ position: 'side-end', icon: 'ads-audience' },
							],
						},
						{
							id: 'creative',
							variant: 'creative',
							heading: headingHtml(contentPT.features.items.creative.title),
							badge: 'Mais impacto',
							image: { src: creativeImage, alt: contentPT.features.items.creative.imageAlt },
							description: { html: descriptionHtml(contentPT.features.items.creative.description) },
							action: { label: contentPT.features.items.creative.button, href: externalButtons.pt.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-design', label: contentPT.features.items.creative.annotations['1'].label },
								{ position: 'bottom-start', icon: 'ads-impact', label: contentPT.features.items.creative.annotations['2'].label },
							],
						},
						{
							id: 'reporting',
							variant: 'reporting',
							heading: headingHtml(contentPT.features.items.reporting.title),
							badge: 'Mais controle',
							image: { src: reportingImage, alt: contentPT.features.items.reporting.imageAlt },
							description: { html: descriptionHtml(contentPT.features.items.reporting.description) },
							action: { label: contentPT.features.items.reporting.button, href: externalButtons.pt.demoUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-start', icon: 'ads-views', label: contentPT.features.items.reporting.annotations['1'].label },
								{ position: 'bottom-end', value: contentPT.features.items.reporting.annotations['2'].value, label: contentPT.features.items.reporting.annotations['2'].label },
							],
						},
					],
				},
			},
			{
				type: 'video-section',
				props: {
					video: wortiseVideos.pt,
				},
			},
		],
	},
} satisfies Partial<Record<Locale, WortiseAdsPageData>>;
