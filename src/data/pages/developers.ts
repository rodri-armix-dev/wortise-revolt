import { clientMarqueeES } from '../client-marquee';
import { footerCTAVisuals } from '../footer-cta';
import { externalButtons } from '../external-buttons';
import { headingHtml, descriptionHtml } from '../content/format';
import { readContent } from '../content/validate';
import rawES from '../../content/pages/developers/es.json';

import mediationDashboard from '../../assets/pages/developers/mediation-dashboard.png';
import analyticsDashboard from '../../assets/pages/developers/analytics-dashboard.png';
import sdkDashboard from '../../assets/pages/developers/sdk-dashboard.png';
import rewardedScreen from '../../assets/pages/developers/rewarded-ad-screen.webp';
import interstitialScreen from '../../assets/pages/developers/interstitial-ad-screen.webp';
import nativeScreen from '../../assets/pages/developers/native-ad-screen.webp';
import offerwallScreen from '../../assets/pages/developers/offerwall-ad-screen.webp';
import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';
import googlePartnerBadge from '../../assets/certifications/google-partner-certified-channel.png';
import googleBuyerBadge from '../../assets/certifications/google-authorized-buyer-partner.png';

const contentES = readContent(rawES, 'pages/developers/es');

const dashboardImages = {
	mediation: mediationDashboard,
	analytics: analyticsDashboard,
	sdk: sdkDashboard,
};
const firstPaymentSteps = ['account', 'sdk', 'payout'] as const;
const dashboardItems = ['mediation', 'analytics', 'sdk'] as const;

export const developersPageData = {
	es: {
		key: 'developers',
		slug: contentES.slug,
		meta: {
			title: contentES.meta.title,
			description: contentES.meta.description,
		},
		footerCTA: {
			...footerCTAVisuals,
			marquee: clientMarqueeES,
			text: {
				heading: { html: headingHtml(contentES.callToAction.title), tag: 'h2' },
				description: { html: descriptionHtml(contentES.callToAction.description) },
				actions: {
					primary: { label: contentES.callToAction.button, href: externalButtons.es.demoUrl, target: '_blank', variant: 'primary-special', size: 'large', disabled: !externalButtons.es.demoUrl },
				},
			},
		},
		modules: [
			{
				type: 'developers-cover',
				props: {
					textBlock: {
						responsiveAlignment: { l: 'center' },
						eyebrow: { label: contentES.hero.eyebrow },
						heading: {
							html: headingHtml(contentES.hero.title),
							tag: 'h1',
							size: { s: 'display-sm', l: 'display-xl' },
						},
						description: {
							html: descriptionHtml(contentES.hero.description),
						},
						actions: {
							primary: { label: contentES.hero.button, variant: 'primary-special', size: 'large', href: externalButtons.es.developersStartUrl || undefined, disabled: !externalButtons.es.developersStartUrl },
							secondary: { label: contentES.hero.secondaryButton, size: 'medium', icon: 'arrow-up-right', href: externalButtons.es.sdkDocumentationUrl || undefined, target: '_blank', disabled: !externalButtons.es.sdkDocumentationUrl },
						},
					},
				},
			},
			{
				type: 'kpis',
				props: {
					variant: 'cover',
					items: [
						{ id: 'apps', value: contentES.statistics.items.apps.value, label: contentES.statistics.items.apps.label },
						{ id: 'countries', value: contentES.statistics.items.countries.value, label: contentES.statistics.items.countries.label },
						{ id: 'requests', value: contentES.statistics.items.requests.value, label: contentES.statistics.items.requests.label },
						{ id: 'uptime', value: contentES.statistics.items.uptime.value, label: contentES.statistics.items.uptime.label },
					],
				},
			},
			{
				type: 'certifications',
				props: {
					id: 'certificaciones',
					textBlock: {
						eyebrow: { label: contentES.certifications.eyebrow },
						heading: { html: headingHtml(contentES.certifications.title) },
					},
					items: [
						{
							title: contentES.certifications.items['1'].title,
							description: contentES.certifications.items['1'].description,
							badge: googlePartnerBadge,
							enlargeBadge: true,
						},
						{
							title: contentES.certifications.items['2'].title,
							description: contentES.certifications.items['2'].description,
							badge: googleBuyerBadge,
						},
					],
				},
			},
			{
				type: 'admonet-networks',
				props: {
					id: 'redes',
					textBlock: {
						eyebrow: { label: contentES.adNetworks.eyebrow },
						heading: { html: headingHtml(contentES.adNetworks.title) },
						description: {
							html: descriptionHtml(contentES.adNetworks.description),
						},
					},
					hub: { label: contentES.adNetworks.hub.label, tagline: contentES.adNetworks.hub.tagline },
					items: [
						{
							id: 'video-recompensado',
							image: { src: rewardedScreen, alt: contentES.adNetworks.items.rewarded.imageAlt },
							eyebrow: { label: contentES.adNetworks.items.rewarded.eyebrow },
							heading: { html: headingHtml(contentES.adNetworks.items.rewarded.title) },
							description: { html: descriptionHtml(contentES.adNetworks.items.rewarded.description) },
							action: { label: contentES.adNetworks.items.rewarded.button, variant: 'primary-special', size: 'medium', href: externalButtons.es.developersStartUrl || undefined, disabled: !externalButtons.es.developersStartUrl },
						},
						{
							id: 'interstitiales-app-open',
							image: { src: interstitialScreen, alt: contentES.adNetworks.items.interstitial.imageAlt },
							eyebrow: { label: contentES.adNetworks.items.interstitial.eyebrow },
							heading: { html: headingHtml(contentES.adNetworks.items.interstitial.title) },
							description: { html: descriptionHtml(contentES.adNetworks.items.interstitial.description) },
							action: { label: contentES.adNetworks.items.interstitial.button, variant: 'primary-special', size: 'medium', href: externalButtons.es.developersStartUrl || undefined, disabled: !externalButtons.es.developersStartUrl },
						},
						{
							id: 'nativos-banners',
							image: { src: nativeScreen, alt: contentES.adNetworks.items.native.imageAlt },
							eyebrow: { label: contentES.adNetworks.items.native.eyebrow },
							heading: { html: headingHtml(contentES.adNetworks.items.native.title) },
							description: { html: descriptionHtml(contentES.adNetworks.items.native.description) },
							action: { label: contentES.adNetworks.items.native.button, variant: 'primary-special', size: 'medium', href: externalButtons.es.developersStartUrl || undefined, disabled: !externalButtons.es.developersStartUrl },
						},
						{
							id: 'ofertas-muros',
							image: { src: offerwallScreen, alt: contentES.adNetworks.items.offerwall.imageAlt },
							eyebrow: { label: contentES.adNetworks.items.offerwall.eyebrow },
							heading: { html: headingHtml(contentES.adNetworks.items.offerwall.title) },
							description: { html: descriptionHtml(contentES.adNetworks.items.offerwall.description) },
							action: { label: contentES.adNetworks.items.offerwall.button, variant: 'primary-special', size: 'medium', href: externalButtons.es.developersStartUrl || undefined, disabled: !externalButtons.es.developersStartUrl },
						},
					],
				},
			},
			{
				type: 'publisher-dashboard',
				props: {
					id: 'panel',
					textBlock: {
						alignment: 'center',
						eyebrow: { label: contentES.dashboard.eyebrow },
						heading: {
							html: headingHtml(contentES.dashboard.title),
							tag: 'h2',
							size: { s: 'title-lg', l: 'display-lg' },
						},
						description: {
							html: descriptionHtml(contentES.dashboard.description),
							responsiveSize: { l: 'large' },
						},
					},
					action: {
						label: contentES.dashboard.button,
						variant: 'tertiary',
						icon: 'arrow-up-right',
						href: externalButtons.es.developersStartUrl || undefined,
						disabled: !externalButtons.es.developersStartUrl,
					},
					items: dashboardItems.map((id) => {
						const item = contentES.dashboard.items[id];

						return {
							id,
							icon: id,
							title: item.title,
							description: { html: descriptionHtml(item.description) },
							image: { src: dashboardImages[id], alt: item.imageAlt },
						};
					}),
				},
			},
			{
				type: 'process-timeline',
				props: {
					id: 'primer-pago',
					heading: headingHtml(contentES.firstPayment.title),
					steps: firstPaymentSteps.map((id) => {
						const step = contentES.firstPayment.steps[id];
						return { id, title: headingHtml(step.title), description: descriptionHtml(step.description) };
					}),
				},
			},
			{
				type: 'faq-section',
				props: {
					id: 'preguntas-frecuentes',
					heading: headingHtml(contentES.faq.title),
					items: Object.entries(contentES.faq.items).map(([id, item]) => ({
						id,
						question: item.question,
						answer: descriptionHtml(item.answer),
					})),
				},
			},
		],
	},
} satisfies Partial<Record<Locale, ModulesPageData<'developers'>>>;
