import { blogImages } from './images';
import sergioAvatar from '../../assets/blog/authors/sergio.png';
import type { Locale } from '../../i18n/config';
import type { BlogPost } from './types';
import type { BlogArticlePageData, BlogIndexPageData } from '../pages/page.types';
import type { ComponentProps } from 'astro/types';
import type ArticleCard from '../../components/molecules/ArticleCard/ArticleCard.astro';
import { getPagePath, getPageData } from '../../i18n/routes';
import { footerCTAVisuals } from '../footer-cta';
import guaranteed from '../../content/blog/es/programmatic-guaranteed.md?raw';
import body0 from '../../content/blog/es/ad-network.md?raw';
import body1 from '../../content/blog/es/ad-platforms.md?raw';
import body2 from '../../content/blog/es/programmatic-trends.md?raw';
import body3 from '../../content/blog/es/ad-blocking.md?raw';
import body4 from '../../content/blog/es/app-ads-txt.md?raw';
import body5 from '../../content/blog/es/self-serve.md?raw';
import body6 from '../../content/blog/es/cookies.md?raw';

export const blogPosts = {
	'programmatic-guaranteed': {
		id: 'programmatic-guaranteed', slug: 'programmatic-guaranteed',
		title: 'Programmatic Guaranteed: Beneficios y Prácticas Clave',
		excerpt: '¿Qué es la Programmatic Guaranteed y cómo puede ayudarte a maximizar tus ingresos? Conoce sus beneficios y prácticas clave.',
		lead: '«¿Qué es la Programmatic Guaranteed y cómo puede ayudarte a maximizar tus ingresos? Aprende las diferencias con Preferred Deals, sus beneficios clave y las mejores prácticas para monetizar tu ad inventory de forma eficiente.»',
		author: 'Sergio', date: '2024-09-13', category: 'Technical optimization',
		tags: ['Apps', 'Publishers', 'Technical'], media: { tone: 'cover', bordered: false, image: blogImages['self-serve'] }, featuredTone: 'blue', markdown: guaranteed, demo: false,
	},
	'ad-network': {
		id: 'ad-network', slug: 'ad-network',
		title: 'Cómo elegir una Ad Network que no te decepcione',
		excerpt: 'Conoce qué evaluar al elegir una red publicitaria: demanda, integración, transparencia y acompañamiento.', lead: 'Conoce qué evaluar al elegir una red publicitaria: demanda, integración, transparencia y acompañamiento.',
		author: 'Sergio', date: '2024-08-19', category: 'Technical optimization',
		tags: ['Apps', 'Publishers'], media: { tone: 'pink', bordered: true, image: blogImages['ad-network'] }, markdown: body0, demo: true,
	},
	'ad-platforms': {
		id: 'ad-platforms', slug: 'ad-platforms',
		title: 'Ad Network vs Ad Server vs Ad Exchange: ¿Cuál elegir para monetizar tu app?',
		excerpt: 'Entiende el papel de cada herramienta y cómo pueden complementarse en tu estrategia de monetización.', lead: 'Entiende el papel de cada herramienta y cómo pueden complementarse en tu estrategia de monetización.',
		author: 'Sergio', date: '2024-08-19', category: 'Technical optimization',
		tags: ['Apps', 'Publishers'], media: { tone: 'violet', bordered: true, image: blogImages['ad-platforms'] }, markdown: body1, demo: true,
	},
	'programmatic-trends': {
		id: 'programmatic-trends', slug: 'programmatic-trends',
		title: 'Programmatic Advertising: 5 Tendencias Esenciales',
		excerpt: 'Datos propios, automatización y nuevos formatos: cinco líneas de trabajo para explorar con tu equipo.', lead: 'Datos propios, automatización y nuevos formatos: cinco líneas de trabajo para explorar con tu equipo.',
		author: 'Sergio', date: '2024-08-19', category: 'Tendencias',
		tags: ['Apps', 'Publishers'], media: { tone: 'surface-accent', bordered: true, image: blogImages['programmatic-trends'] }, markdown: body2, demo: true,
	},
	'ad-blocking': {
		id: 'ad-blocking', slug: 'ad-blocking',
		title: '¿Ad Blocking Afecta tus Ingresos? 5 Formas de Superarlo',
		excerpt: 'Cinco formas de revisar tu experiencia publicitaria y construir una relación más clara con tu audiencia.', lead: 'Cinco formas de revisar tu experiencia publicitaria y construir una relación más clara con tu audiencia.',
		author: 'Sergio', date: '2024-08-19', category: 'Tendencias',
		tags: ['Apps', 'Publishers'], media: { tone: 'neutral', bordered: true, image: blogImages['ad-blocking'] }, markdown: body3, demo: true,
	},
	'app-ads-txt': {
		id: 'app-ads-txt', slug: 'app-ads-txt',
		title: 'App-ads.txt: Guía para publishers con pánico al ad fraud',
		excerpt: 'Una introducción a la autorización de vendedores y a las tareas de mantenimiento de tu inventario.', lead: 'Una introducción a la autorización de vendedores y a las tareas de mantenimiento de tu inventario.',
		author: 'Sergio', date: '2024-08-19', category: 'Publishers',
		tags: ['Apps', 'Publishers'], media: { tone: 'surface', bordered: true, image: blogImages['app-ads-txt'] }, markdown: body4, demo: true,
	},
	'self-serve': {
		id: 'self-serve', slug: 'self-serve',
		title: 'Self Serve Advertising Platforms: Guía para publishers y advertisers',
		excerpt: 'Qué tener en cuenta al diseñar una operación publicitaria más autónoma y fácil de administrar.', lead: 'Qué tener en cuenta al diseñar una operación publicitaria más autónoma y fácil de administrar.',
		author: 'Sergio', date: '2024-08-19', category: 'Publishers + advertisers',
		tags: ['Apps', 'Publishers'], media: { tone: 'violet', bordered: true, image: blogImages['self-serve'] }, markdown: body5, demo: true,
	},
	'cookies': {
		id: 'cookies', slug: 'cookies',
		title: '¿Adiós a las Cookies?',
		excerpt: 'Una oportunidad para revisar cómo conocemos a la audiencia y construimos experiencias relevantes.', lead: 'Una oportunidad para revisar cómo conocemos a la audiencia y construimos experiencias relevantes.',
		author: 'Sergio', date: '2024-08-19', category: 'Tendencias',
		tags: ['Apps', 'Publishers'], media: { tone: 'surface', bordered: true, image: blogImages['cookies'] }, markdown: body6, demo: true,
	},
} satisfies Record<string, BlogPost>;

export type BlogPostId = keyof typeof blogPosts;

function articlePage<Key extends string>(key: Key, post: BlogPost): Partial<Record<Locale, BlogArticlePageData<Key>>> {
	return { es: {
		key, slug: `blog/${post.slug}`, template: 'blog-article',
		meta: { title: `${post.title} | Wortise Blog`, description: post.excerpt },
		content: { ...post, authorImage: post.authorImage ?? (post.author === 'Sergio' ? { src: sergioAvatar, alt: '' } : undefined) },
		footerCTA: {
			...footerCTAVisuals, actionPage: 'contact',
			text: {
				heading: { html: 'Conectemos tu próxima oportunidad', tag: 'h2' },
				description: { html: '<p>Cuéntanos qué quieres lograr. El equipo de Wortise te ayuda a encontrar el mejor punto de partida.</p>' },
				actions: { primary: { label: 'Contactar al equipo', variant: 'primary-special', size: 'large' } },
			},
		},
	} };
}

export const blogArticlePages = {
	'blog-programmatic-guaranteed': articlePage('blog-programmatic-guaranteed', blogPosts['programmatic-guaranteed']),
	'blog-ad-network': articlePage('blog-ad-network', blogPosts['ad-network']),
	'blog-ad-platforms': articlePage('blog-ad-platforms', blogPosts['ad-platforms']),
	'blog-programmatic-trends': articlePage('blog-programmatic-trends', blogPosts['programmatic-trends']),
	'blog-ad-blocking': articlePage('blog-ad-blocking', blogPosts['ad-blocking']),
	'blog-app-ads-txt': articlePage('blog-app-ads-txt', blogPosts['app-ads-txt']),
	'blog-self-serve': articlePage('blog-self-serve', blogPosts['self-serve']),
	'blog-cookies': articlePage('blog-cookies', blogPosts['cookies']),
};

export const blogPageData = {
	es: { key: 'blog', slug: 'blog', template: 'blog', meta: { title: 'Blog | Wortise', description: 'Tecnología, publicidad y producto. Ideas para crecer con Wortise.' } },
} satisfies Partial<Record<Locale, BlogIndexPageData<'blog'>>>;

export function getBlogCard(locale: Locale, id: BlogPostId): ComponentProps<typeof ArticleCard> | undefined {
	const key = `blog-${id}` as keyof typeof blogArticlePages;
	const page = getPageData(locale, key);
	if (!page || page.template !== 'blog-article') return undefined;
	const post = page.content;
	const href = getPagePath(locale, key);
	return href ? { title: post.title, excerpt: post.excerpt, author: post.author, date: post.date, category: post.category, ...post.media, featuredTone: post.featuredTone, href, locale } : undefined;
}

export function getBlogCards(locale: Locale, ids: readonly BlogPostId[]) {
	return ids.flatMap((id) => { const card = getBlogCard(locale, id); return card ? [card] : []; });
}

export const featuredPostIds: BlogPostId[] = ['ad-blocking', 'cookies', 'programmatic-guaranteed'];
export const storyPostIds: BlogPostId[] = ['ad-network', 'ad-platforms', 'programmatic-trends', 'ad-blocking', 'app-ads-txt', 'self-serve', 'cookies', 'programmatic-guaranteed'];
