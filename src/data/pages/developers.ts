import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';
import googlePartnerBadge from '../../assets/certifications/google-partner-certified-channel.png';
import googleBuyerBadge from '../../assets/certifications/google-authorized-buyer-partner.png';

export const developersPageData = {
	es: {
		key: 'developers',
		slug: 'desarrolladores',
		meta: {
			title: 'Desarrolladores | Wortise',
			description: 'Monetizá tus apps y juegos móviles con AdMonet, la plataforma de monetización de Wortise para Android e iOS.',
		},
		modules: [
			{
				type: 'developers-cover',
				props: {
					textBlock: {
						responsiveAlignment: { l: 'center' },
						eyebrow: { label: 'Monetización para Android e iOS' },
						heading: {
							html: '<span data-tone="muted">Convierte cada</span><br> sesión en ingresos',
							tag: 'h1',
							size: { s: 'display-sm', l: 'display-xl' },
						},
						description: {
							html: '<p>AdMonet es la plataforma de monetización de Wortise. Mediación con pujas en tiempo real, formatos que no arruinan la experiencia y datos para exprimir cada impresión de tus apps y juegos móviles.</p>',
						},
						actions: {
							primary: { label: 'Empezar gratis', variant: 'primary-special', size: 'large', disabled: true },
							secondary: { label: 'Ver documentación', size: 'medium', icon: 'arrow-up-right', disabled: true },
						},
					},
				},
			},
			{
				type: 'kpis',
				props: {
					variant: 'cover',
					items: [
						{ id: 'apps', value: '+20.000', label: 'Apps que usan nuestro SDK' },
						{ id: 'countries', value: '+190', label: 'Países con demanda activa' },
						{ id: 'requests', value: '+8M', label: 'Solicitudes de anuncios al mes' },
						{ id: 'uptime', value: '99,9%', label: 'Uptime del SDK' },
					],
				},
			},
			{
				type: 'certifications',
				props: {
					id: 'certificaciones',
					textBlock: {
						eyebrow: { label: 'Respaldados por Google' },
						heading: { html: 'Certificaciones oficiales' },
					},
					items: [
						{
							title: 'Google Partner Certified Channel',
							description: 'Canal certificado por Google para la venta y gestión de inventario publicitario.',
							badge: googlePartnerBadge,
							enlargeBadge: true,
						},
						{
							title: 'Google Authorized Buyer Partner',
							description: 'Acceso directo a la demanda programática de Google con estándares de calidad verificados.',
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
						eyebrow: { label: 'Más demanda · Más valor' },
						heading: { html: '<span data-tone="muted">Todas tus redes</span><br> en un solo lugar' },
						description: {
							html: '<p>Integra AdMob, AppLovin, Unity Ads y decenas de redes más desde un único SDK y un único panel. AdMonet las hace competir impresión a impresión y se queda siempre con la puja más alta, sin waterfalls manuales ni integraciones duplicadas.</p>',
						},
					},
					hub: { label: 'AdMonet', tagline: '1 SDK · mejor puja' },
				},
			},
		],
	},
} satisfies Partial<Record<Locale, ModulesPageData<'developers'>>>;
