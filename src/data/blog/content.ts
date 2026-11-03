import type { ComponentProps } from 'astro/types';
import type TextBlock from '../../components/molecules/TextBlock/TextBlock.astro';
import type EditorialCTA from '../../components/molecules/EditorialCTA/EditorialCTA.astro';
import type BlogMedia from '../../components/molecules/BlogMedia/BlogMedia.astro';
import { parseArticleMarkdown } from '../../lib/article-markdown';
import type { BlogPost } from './types';

export const blogIntro = {
	eyebrow: { label: 'Wortise Blog · Ideas para crecer' },
	heading: { html: 'Tecnología, publicidad y producto. <span data-tone="muted">Sin ruido.</span>', tag: 'h1', id: 'blog-heading' },
	description: { html: '<p>Conectamos publishers, aplicaciones, marcas y agencias para crear campañas más inteligentes y maximizar la monetización de cada impresión.</p>' },
} satisfies ComponentProps<typeof TextBlock>;

export const blogNewsletter = {
	title: 'No te pierdas nada importante.',
	description: '<p>Suscribite y recibí nuestras novedades y artículos más recientes en tu email.</p>',
};

export function getArticleContent(post: BlogPost) {
	const ctas: Record<string, ComponentProps<typeof EditorialCTA>> = {
		'tips-app': { eyebrow: 'Guía gratuita', title: 'Descarga nuestros Tips para mejorar tu app', action: { label: 'Descargar tips', disabled: true } },
	};
	const media: Record<string, ComponentProps<typeof BlogMedia>> = {
		'programmatic-illustration': { ...post.media, aspectRatio: '16/9' },
	};
	const blocks = parseArticleMarkdown(post.markdown, { cta: Object.keys(ctas), media: Object.keys(media) });
	return { blocks, ctas, media };
}
