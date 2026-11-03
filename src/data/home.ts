import { footerCTAVisuals } from './footer-cta';
import { worldLocations } from './world';
import { kpiItems } from './kpis';
import { homeGalleryItems } from './gallery';
import wortiseW from '../assets/home/wortise-w.png';
import glow from '../assets/home/glow.svg?url';
import hbo from '../assets/brands/hbo.png';
import apple from '../assets/brands/apple.png';
import spotify from '../assets/brands/spotify.png';
import toyota from '../assets/brands/toyota.png';
import mcdonalds from '../assets/brands/mcdonalds.png';
import visa from '../assets/brands/visa.png';
import developersPreview from '../assets/audience/developers-screen.webp';
import advertisersPreview from '../assets/audience/advertisers-screen.webp';
import wortiseAdsPreview from '../assets/audience/wortise-ads-screen.webp';
import type { Locale } from '../i18n/config';
import type { ModulesPageData } from './pages/page.types';

export type HomeData = ModulesPageData<'home'>;

export const homeData = {
	es: {
		key: 'home',
		slug: '',
		meta: {
			title: 'Wortise',
			description: 'Wortise',
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
				type: 'hero',
				props: {
					content: {
						eyebrow: { label: 'Tecnología publicitaria, hecha en LATAM' },
						heading: {
							tag: 'h1',
							html: '<span data-tone="muted">Nos ocupamos de convertir tu producto </span><br>en un gran negocio',
						},
						description: {
							size: 'normal',
							html: '<p>Conectamos publishers, aplicaciones, marcas y agencias para crear campañas más inteligentes y maximizar la monetización de cada impresión.</p>',
						},
						actions: { primary: { label: 'Explorar Wortise Ads', variant: 'primary-special' } },
					},
					visual: { image: wortiseW, background: glow, effect: 'wortise-3d' },
					actionPage: 'wortise-ads',
				},
			},
			{
				type: 'logo-marquee',
				props: {
					label: 'Marcas que confían en Wortise',
					logos: [
						{ id: 'hbo', src: hbo, name: 'HBO', width: 76.313, height: 31.449 },
						{ id: 'apple', src: apple, name: 'Apple', width: 32.886, height: 40.476 },
						{ id: 'spotify', src: spotify, name: 'Spotify', width: 42.641, height: 42.686 },
						{ id: 'toyota', src: toyota, name: 'Toyota', width: 59.879, height: 60.627 },
						{ id: 'mcdonalds', src: mcdonalds, name: 'McDonald’s', width: 61.412, height: 61.466, mirrored: true },
						{ id: 'visa', src: visa, name: 'Visa', width: 91.867, height: 29.765 },
					],
				},
			},
			{
				type: 'audience-sections',
				props: {
					items: [
						{
							variant: 'developers',
							eyebrow: 'Para desarrolladores',
							heading: 'Monetización sin fricción',
							description: '<p>Integra el SDK, automatiza la operación y maximiza los ingresos de aplicaciones, juegos y sitios web.</p>',
							image: { src: developersPreview, alt: 'Ejemplo de anuncio recompensado en una aplicación.' },
							action: { label: 'Explorar para desarrolladores' },
						},
						{
							variant: 'advertisers',
							eyebrow: 'Para anunciantes',
							heading: 'Campañas que llegan mejor',
							description: '<p>Planifica, activa y optimiza campañas con datos de primera mano y formatos no intrusivos.</p>',
							image: { src: advertisersPreview, alt: 'Pantalla azul de prueba para anunciantes.' },
							action: { label: 'Explorar para anunciantes' },
						},
						{
							variant: 'wortise-ads',
							eyebrow: 'Wortise Ads',
							heading: 'De la idea al resultado en un clic',
							description: '<p>Es la primer IA de publicidad digital mobile, que diseña creativos, gestiona audiencias, lanza campañas y genera reportes de manera simple para escalar tu negocio.</p>',
							image: { src: wortiseAdsPreview, alt: 'Vista previa de optimización de campañas en Wortise Ads.' },
							action: { label: 'Explorar Wortise Ads', page: 'wortise-ads' },
						},
					],
				},
			},
			{
				type: 'world-solutions',
				props: {
					locations: worldLocations,
					content: {
						eyebrow: { label: 'Nuestras soluciones' },
						heading: {
							tag: 'h2',
							html: '<span data-tone="muted">Born in LATAM,</span><br>made for the world',
						},
						description: {
							size: 'normal',
							html: '<p>Equipos locales y tecnología propia para conectar oportunidades en mercados de toda la región y el mundo.</p>',
						},
					},
				},
			},
			{
				type: 'kpis',
				props: {
					textBlock: {
						eyebrow: { label: 'Escala comprobada' },
						heading: {
							tag: 'h2',
							html: '<span data-tone="muted">Cuando todo está conectado,</span> los resultados llegan solos.',
						},
					},
					items: kpiItems,
				},
			},
			{
				type: 'image-gallery',
				props: {
					label: 'El equipo y los espacios de Wortise',
					textBlock: {
						alignment: 'center',
						eyebrow: { label: 'Nuestro equipo' },
						heading: {
							tag: 'h2',
							html: '<span data-tone="muted">Las personas detrás</span><br>de Wortise',
						},
						description: {
							html: '<p>Un equipo diverso y global que combina tecnología, datos, producto y negocio para transformar la publicidad digital.</p>',
						},
					},
					items: homeGalleryItems,
				},
			},
			{
				type: 'recruiting-section',
				props: {
					id: 'busquedas-activas',
					textBlock: {
						eyebrow: { label: 'Búsquedas activas' },
						heading: { html: '<span data-tone="muted">Forma parte de </span>Wortise', tag: 'h2' },
						description: {
							size: 'normal',
							html: '<p>Los Wortisers se identifican por ser enfocados, curiosos y resolutivos. Si crees que encajas ¡postulate!, te estamos esperando.</p>',
						},
					},
					items: [
						// Temporary destinations for interaction previews until job URLs are available.
						{ id: 'technical-lead-1', title: 'Líder Técnico', location: 'Argentina', href: '#busquedas-activas' },
						{ id: 'technical-lead-2', title: 'Líder Técnico', location: 'Argentina', href: '#busquedas-activas' },
						{ id: 'technical-lead-3', title: 'Líder Técnico', location: 'Argentina', href: '#busquedas-activas' },
					],
					action: { label: 'Ver más búsquedas', href: '#busquedas-activas' },
				},
			},
		],
	},
	en: {
		key: 'home',
		slug: '',
		meta: {
			title: 'Wortise | Advertising and monetization',
			description: 'Connect brands with people and unlock new opportunities with Wortise.',
		},
		footerCTA: {
			actionPage: 'contact',
			...footerCTAVisuals,
			text: {
				heading: { html: 'Let’s connect your next opportunity', tag: 'h2' },
				description: { html: '<p>Tell us what you want to achieve. The Wortise team will help you find the best place to start.</p>' },
				actions: { primary: { label: 'Contact our team', href: '', variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'hero',
				props: { heading: 'Wortise' },
			},
		],
	},
} satisfies Partial<Record<Locale, HomeData>>;
