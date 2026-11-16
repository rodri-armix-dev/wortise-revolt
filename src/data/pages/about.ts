import nextImage from '../../assets/pages/about/timeline/next.webp';
import todayImage from '../../assets/pages/about/timeline/today.webp';
import expansionImage from '../../assets/pages/about/timeline/expansion.webp';
import platformImage from '../../assets/pages/about/timeline/platform.webp';
import originImage from '../../assets/pages/about/timeline/origin.webp';
import { headingHtml, descriptionHtml } from '../content/format';
import { homeRecruitingModuleES } from '../home';
import { readContent } from '../content/validate';
import rawES from '../../content/pages/about/es.json';

import { footerCTAVisuals } from '../footer-cta';
import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';
import aboutUsCoverImage from '../../assets/pages/about/team-cover.webp';
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
				heading: { html: headingHtml(contentES.callToAction.title), tag: 'h2' },
				description: { html: descriptionHtml(contentES.callToAction.description) },
				actions: { primary: { label: contentES.callToAction.button, variant: 'primary-special', size: 'large' } },
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
						alignment: 'center',
						eyebrow: { label: contentES.hero.eyebrow },
						heading: {
							html: headingHtml(contentES.hero.title),
							tag: 'h1',
						},
					},
				},
			},
			{
				type: 'about-history',
				props: {
					textBlock: {
						eyebrow: { label: contentES.history.eyebrow },
						heading: { html: headingHtml(contentES.history.title), tag: 'h2', size: { s: 'title-lg', l: 'display-xl' } },
					},
					columns: [descriptionHtml(contentES.history.origin), descriptionHtml(contentES.history.founding)],
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
			{
				type: 'about-timeline',
				props: {
					items: Object.entries({ origin: originImage, platform: platformImage, expansion: expansionImage, today: todayImage, next: nextImage }).map(([key, src]) => {
						const item = contentES.timeline[key as keyof typeof contentES.timeline];
						return {
							year: 'year' in item ? item.year : undefined,
							title: headingHtml(item.title),
							description: descriptionHtml(item.description),
							image: { src, alt: item.imageAlt },
						};
					}),
				},
			},
			homeRecruitingModuleES,
		],
	},
} satisfies Partial<Record<Locale, AboutPageData>>;
