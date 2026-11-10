import { externalButtons } from '../external-buttons';
import type { Locale } from '../../i18n/config';
import { headingHtml, descriptionHtml } from '../content/format';
import { readContent } from '../content/validate';
import rawES from '../../content/pages/blog/es.json';

import type { ComponentProps } from 'astro/types';
import type TextBlock from '../../components/molecules/TextBlock/TextBlock.astro';
import type EditorialCTA from '../../components/molecules/EditorialCTA/EditorialCTA.astro';
import type BlogMedia from '../../components/molecules/BlogMedia/BlogMedia.astro';
import { parseArticleMarkdown } from '../../lib/article-markdown';
import type { BlogPost } from './types';

const contentES = readContent(rawES, 'pages/blog/es');

export const blogIntro = {
	eyebrow: { label: contentES.hero.eyebrow },
	heading: { html: headingHtml(contentES.hero.title), tag: 'h1', id: 'blog-heading' },
	description: { html: descriptionHtml(contentES.hero.description) },
} satisfies ComponentProps<typeof TextBlock>;

export const blogNewsletter = {
	title: contentES.newsletter.title,
	description: descriptionHtml(contentES.newsletter.description),
};

export function getArticleContent(post: BlogPost, locale: Locale) {
	const ctas: Record<string, ComponentProps<typeof EditorialCTA>> = {
		'tips-app': { eyebrow: contentES.downloads['tips-app'].eyebrow, title: contentES.downloads['tips-app'].title, action: { label: contentES.downloads['tips-app'].button, href: externalButtons[locale].downloadTipsUrl || undefined, disabled: !externalButtons[locale].downloadTipsUrl } },
	};
	const media: Record<string, ComponentProps<typeof BlogMedia>> = {
		'programmatic-illustration': { ...post.media, aspectRatio: '16/9' },
	};
	const blocks = parseArticleMarkdown(post.markdown, { cta: Object.keys(ctas), media: Object.keys(media) });
	return { blocks, ctas, media };
}
