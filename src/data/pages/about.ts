import { footerCTAVisuals } from '../footer-cta';
import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';
import aboutUsCoverImage from '../../assets/images/about-us-cover.png';
import { kpiItems } from '../kpis';
import { aboutGalleryItems } from '../gallery';

export const aboutPageKey = 'about' as const;

export type AboutPageData = ModulesPageData<typeof aboutPageKey>;

export const aboutPageData = {
	es: {
		key: aboutPageKey,
		slug: 'nosotros',
		meta: {
			title: 'Nosotros | Wortise',
			description: 'Conocé más sobre Wortise.',
		},
		footerCTA: {
			actionPage: 'contact',
			...footerCTAVisuals,
			text: {
				heading: { html: 'Conectemos tu próxima oportunidad', tag: 'h2' },
				description: { html: '<p>Cuéntanos qué quieres lograr. El equipo de Wortise te ayuda a encontrar el mejor punto de partida.</p>' },
				actions: { primary: { label: 'Contactar al equipo', href: '', variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'about-us-cover',
				props: {
					image: {
						src: aboutUsCoverImage,
						alt: 'Equipo de Wortise trabajando en la oficina.',
						radius: 'normal',
						loading: 'eager',
					},
					textBlock: {
						alignment: 'left',
						responsiveAlignment: { m: 'center' },
						eyebrow: { label: 'Wortise' },
						heading: {
							html: 'Conectamos grandes marcas con personas',
							tag: 'h1',
						},
						description: {
							html: '<p>Posicionamos marcas en la rutina diaria de más de 320 millones de usuarios únicos, dentro de la red de aplicaciones en español más grande del mundo.</p>',
						},
					},
				},
			},
			{
				type: 'kpis',
				props: {
					variant: 'vision',
					textBlock: {
						eyebrow: { label: 'Nosotros' },
						heading: {
							tag: 'h2',
							html: '<span data-tone="muted">Nuestra visión se basa en un mundo en el que la publicidad se </span>construya desde el contexto y vaya más allá del seguimiento',
						},
					},
					items: kpiItems,
				},
			},
			{
				type: 'image-gallery',
				props: {
					variant: 'office',
					label: 'La vida en las oficinas de Wortise',
					items: aboutGalleryItems,
				},
			},
		],
	},
} satisfies Partial<Record<Locale, AboutPageData>>;
