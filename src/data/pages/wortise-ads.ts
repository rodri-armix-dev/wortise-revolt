import { wortiseVideos } from '../videos';
import { footerCTAVisuals } from '../footer-cta';
import efficiencyImage from '../../assets/ads/sections/efficiency-screen.webp';
import projectionImage from '../../assets/ads/sections/projection-screen.webp';
import creativeImage from '../../assets/ads/sections/creative-screen.webp';
import reportingImage from '../../assets/ads/sections/reporting-screen.webp';
import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';

const demoBookingUrl = 'https://calendar.app.google/nPPiSdVqnJfVH9rf6';

export const wortiseAdsPageKey = 'wortise-ads' as const;

export type WortiseAdsPageData = ModulesPageData<typeof wortiseAdsPageKey>;

export const wortiseAdsPageData = {
	es: {
		key: wortiseAdsPageKey,
		slug: 'wortise-ads',
		meta: {
			title: 'Wortise Ads | Wortise',
			description: 'Conocé Wortise Ads.',
		},
		footerCTA: {
			...footerCTAVisuals,
			text: {
				heading: { html: 'Monetiza<br>tus cuentas', tag: 'h2' },
				description: { html: '<p>Transformamos cada centavo de inversión total, en un beneficio para tu agencia.</p>' },
				actions: { primary: { label: 'Agenda una Demo', href: demoBookingUrl, target: '_blank', variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'ads-cover',
				props: {
					textBlock: {
						heading: {
							tag: 'h1',
							html: '<span data-tone="muted">Wortise Ads:</span><br>De la idea al resultado en un clic',
						},
						description: {
							html: '<p>Es la primer IA de publicidad digital mobile, que diseña creativos, gestiona audiencias, lanza campañas y genera reportes de manera simple para escalar tu negocio.</p>',
						},
						actions: {
							primary: { label: 'Agenda una Demo', href: demoBookingUrl, target: '_blank', variant: 'primary-special', size: 'large' },
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
							heading: 'Crea tus campañas en minutos',
							badge: 'Más eficiencia',
							image: { src: efficiencyImage, alt: 'Anuncio de Vanish dentro de un teléfono.' },
							description: { html: '<p><strong>Modo Asistido:</strong> 100% automatizado donde la IA lidera la estrategia y ejecución sin fricción.<br><strong>Modo Manual:</strong> Vos definís objetivos y nuestra tecnología calibra la configuración para alcanzarlos.</p>' },
							action: { label: 'Agenda una Demo', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-assisted', label: 'Modo Asistido' },
								{ position: 'bottom-start', icon: 'ads-manual', label: 'Modo Manual' },
							],
						},
						{
							id: 'projection',
							variant: 'projection',
							heading: 'Proyección y data pre-inversión',
							badge: 'Más proyección',
							image: { src: projectionImage, alt: 'Anuncio de la fragancia Angel Elixir de Mugler dentro de un teléfono.' },
							description: { html: '<p>Garantiza la eficiencia de tu presupuesto con estimaciones precisas de alcance e impresiones antes de activar la pauta.<br>Inversión basada en datos, no en supuestos.</p>' },
							action: { label: 'Agenda una Demo', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', value: '+100k', label: 'alcance estimado' },
								{ position: 'bottom-start', value: '+500k', label: 'impresiones estimadas' },
								{ position: 'side-end', icon: 'ads-audience' },
							],
						},
						{
							id: 'creative',
							variant: 'creative',
							heading: 'Diseño creativo autónomo',
							badge: 'Más impacto',
							image: { src: creativeImage, alt: 'Anuncio interactivo de Giorgio Armani con una tarjeta para raspar dentro de un teléfono.' },
							description: { html: '<p>Nuestra IA no solo diseña, sino que adapta dinámicamente cada pieza creativa para maximizar el impacto en cada formato y audiencia.</p>' },
							action: { label: 'Agenda una Demo', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-design', label: 'Diseño creativo' },
								{ position: 'bottom-start', icon: 'ads-impact', label: 'Más impacto' },
							],
						},
						{
							id: 'reporting',
							variant: 'reporting',
							heading: 'Reporting estratégico 24/7',
							badge: 'Más control',
							image: { src: reportingImage, alt: 'Anuncios de un video de Olivia Rodrigo y del iPhone 15 dentro de un teléfono.' },
							description: { html: '<p>Transparencia total mediante dashboards en tiempo real. Cada cliente gestiona sus propias métricas y resultados.</p>' },
							action: { label: 'Agenda una Demo', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-start', icon: 'ads-views', label: '10.450 vistas' },
								{ position: 'bottom-end', value: '18 s', label: 'Permanencia promedio' },
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
		slug: 'wortise-ads',
		meta: {
			title: 'Wortise Ads | Wortise',
			description: 'Discover Wortise Ads.',
		},
		footerCTA: {
			...footerCTAVisuals,
			text: {
				heading: { html: 'Monetize<br>your accounts', tag: 'h2' },
				description: { html: '<p>We turn every cent of your total investment into a benefit for your agency.</p>' },
				actions: { primary: { label: 'Book a Demo', href: demoBookingUrl, target: '_blank', variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'ads-cover',
				props: {
					textBlock: {
						heading: {
							tag: 'h1',
							html: '<span data-tone="muted">Wortise Ads:</span><br>From idea to results in one click',
						},
						description: {
							html: '<p>The first AI for mobile digital advertising that designs creatives, manages audiences, launches campaigns and generates reports with ease to scale your business.</p>',
						},
						actions: {
							primary: { label: 'Book a Demo', href: demoBookingUrl, target: '_blank', variant: 'primary-special', size: 'large' },
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
							heading: 'Create your campaigns in minutes',
							badge: 'Greater efficiency',
							image: { src: efficiencyImage, alt: 'Vanish ad displayed on a phone.' },
							description: { html: '<p><strong>Assisted Mode:</strong> Fully automated, with AI leading seamless strategy and execution.<br><strong>Manual Mode:</strong> You set the goals, and our technology fine-tunes the settings to achieve them.</p>' },
							action: { label: 'Book a Demo', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-assisted', label: 'Assisted Mode' },
								{ position: 'bottom-start', icon: 'ads-manual', label: 'Manual Mode' },
							],
						},
						{
							id: 'projection',
							variant: 'projection',
							heading: 'Forecasts and data before you invest',
							badge: 'Better forecasting',
							image: { src: projectionImage, alt: 'Ad for Mugler’s Angel Elixir fragrance displayed on a phone.' },
							description: { html: '<p>Make your budget work efficiently with accurate reach and impression estimates before launching your ads.<br>Investment based on data, not assumptions.</p>' },
							action: { label: 'Book a Demo', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', value: '+100k', label: 'estimated reach' },
								{ position: 'bottom-start', value: '+500k', label: 'estimated impressions' },
								{ position: 'side-end', icon: 'ads-audience' },
							],
						},
						{
							id: 'creative',
							variant: 'creative',
							heading: 'Autonomous creative design',
							badge: 'Greater impact',
							image: { src: creativeImage, alt: 'Interactive Giorgio Armani ad with a scratch card displayed on a phone.' },
							description: { html: '<p>Our AI goes beyond design, dynamically adapting each creative to maximize its impact across every format and audience.</p>' },
							action: { label: 'Book a Demo', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-design', label: 'Creative design' },
								{ position: 'bottom-start', icon: 'ads-impact', label: 'Greater impact' },
							],
						},
						{
							id: 'reporting',
							variant: 'reporting',
							heading: 'Strategic reporting 24/7',
							badge: 'Greater control',
							image: { src: reportingImage, alt: 'Ads for an Olivia Rodrigo video and the iPhone 15 displayed on a phone.' },
							description: { html: '<p>Complete transparency through real-time dashboards. Each client manages their own metrics and results.</p>' },
							action: { label: 'Book a Demo', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-start', icon: 'ads-views', label: '10,450 views' },
								{ position: 'bottom-end', value: '18 s', label: 'Average time spent' },
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
		slug: 'wortise-ads',
		meta: {
			title: 'Wortise Ads | Wortise',
			description: 'Conheça o Wortise Ads.',
		},
		footerCTA: {
			...footerCTAVisuals,
			text: {
				heading: { html: 'Monetize<br>suas contas', tag: 'h2' },
				description: { html: '<p>Transformamos cada centavo do investimento total em um benefício para sua agência.</p>' },
				actions: { primary: { label: 'Agende uma demonstração', href: demoBookingUrl, target: '_blank', variant: 'primary-special', size: 'large' } },
			},
		},
		modules: [
			{
				type: 'ads-cover',
				props: {
					textBlock: {
						heading: {
							tag: 'h1',
							html: '<span data-tone="muted">Wortise Ads:</span><br>Da ideia ao resultado em um clique',
						},
						description: {
							html: '<p>A primeira IA de publicidade digital mobile que cria peças, gerencia públicos, lança campanhas e gera relatórios de forma simples para escalar seu negócio.</p>',
						},
						actions: {
							primary: { label: 'Agende uma demonstração', href: demoBookingUrl, target: '_blank', variant: 'primary-special', size: 'large' },
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
							heading: 'Crie suas campanhas em minutos',
							badge: 'Mais eficiência',
							image: { src: efficiencyImage, alt: 'Anúncio da Vanish exibido em um celular.' },
							description: { html: '<p><strong>Modo Assistido:</strong> 100% automatizado, com a IA conduzindo a estratégia e a execução sem complicações.<br><strong>Modo Manual:</strong> Você define os objetivos e nossa tecnologia ajusta as configurações para alcançá-los.</p>' },
							action: { label: 'Agende uma demonstração', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-assisted', label: 'Modo Assistido' },
								{ position: 'bottom-start', icon: 'ads-manual', label: 'Modo Manual' },
							],
						},
						{
							id: 'projection',
							variant: 'projection',
							heading: 'Projeções e dados antes de investir',
							badge: 'Mais previsibilidade',
							image: { src: projectionImage, alt: 'Anúncio da fragrância Angel Elixir da Mugler exibido em um celular.' },
							description: { html: '<p>Garanta a eficiência do seu orçamento com estimativas precisas de alcance e impressões antes de ativar os anúncios.<br>Investimento baseado em dados, não em suposições.</p>' },
							action: { label: 'Agende uma demonstração', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', value: '+100k', label: 'alcance estimado' },
								{ position: 'bottom-start', value: '+500k', label: 'impressões estimadas' },
								{ position: 'side-end', icon: 'ads-audience' },
							],
						},
						{
							id: 'creative',
							variant: 'creative',
							heading: 'Design criativo autônomo',
							badge: 'Mais impacto',
							image: { src: creativeImage, alt: 'Anúncio interativo da Giorgio Armani com uma raspadinha exibido em um celular.' },
							description: { html: '<p>Nossa IA vai além do design: adapta dinamicamente cada peça criativa para maximizar o impacto em cada formato e público.</p>' },
							action: { label: 'Agende uma demonstração', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-end', icon: 'ads-design', label: 'Design criativo' },
								{ position: 'bottom-start', icon: 'ads-impact', label: 'Mais impacto' },
							],
						},
						{
							id: 'reporting',
							variant: 'reporting',
							heading: 'Relatórios estratégicos 24/7',
							badge: 'Mais controle',
							image: { src: reportingImage, alt: 'Anúncios de um vídeo da Olivia Rodrigo e do iPhone 15 exibidos em um celular.' },
							description: { html: '<p>Transparência total por meio de dashboards em tempo real. Cada cliente gerencia suas próprias métricas e resultados.</p>' },
							action: { label: 'Agende uma demonstração', href: demoBookingUrl, target: '_blank', variant: 'primary' },
							annotations: [
								{ position: 'top-start', icon: 'ads-views', label: '10.450 visualizações' },
								{ position: 'bottom-end', value: '18 s', label: 'Tempo médio de permanência' },
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
