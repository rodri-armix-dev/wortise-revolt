import { headingHtml, descriptionHtml } from '../content/format';
import { contactCTA } from '../contact-cta';
import { readContent } from '../content/validate';
import rawES from '../../content/pages/blog/es.json';
import { readBlogDocument } from '../content/documents';
import { blogImages } from './images';
import sergioAvatar from '../../assets/blog/authors/sergio.webp';
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

const contentES = readContent(rawES, 'pages/blog/es');
export const blogPosts = {
	'programmatic-guaranteed': {
		...readBlogDocument(guaranteed, 'programmatic-guaranteed'),
		media: { tone: 'cover', bordered: false, image: blogImages['self-serve'] }, featuredTone: 'blue',
	},
	'ad-network': {
		...readBlogDocument(body0, 'ad-network'),
		media: { tone: 'pink', bordered: true, image: blogImages['ad-network'] },
	},
	'ad-platforms': {
		...readBlogDocument(body1, 'ad-platforms'),
		media: { tone: 'violet', bordered: true, image: blogImages['ad-platforms'] },
	},
	'programmatic-trends': {
		...readBlogDocument(body2, 'programmatic-trends'),
		media: { tone: 'surface-accent', bordered: true, image: blogImages['programmatic-trends'] },
	},
	'ad-blocking': {
		...readBlogDocument(body3, 'ad-blocking'),
		media: { tone: 'neutral', bordered: true, image: blogImages['ad-blocking'] },
	},
	'app-ads-txt': {
		...readBlogDocument(body4, 'app-ads-txt'),
		media: { tone: 'surface', bordered: true, image: blogImages['app-ads-txt'] },
	},
	'self-serve': {
		...readBlogDocument(body5, 'self-serve'),
		media: { tone: 'violet', bordered: true, image: blogImages['self-serve'] },
	},
	'cookies': {
		...readBlogDocument(body6, 'cookies'),
		media: { tone: 'surface', bordered: true, image: blogImages['cookies'] },
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
				heading: { html: headingHtml(contactCTA.es.title), tag: 'h2' },
				description: { html: descriptionHtml(contactCTA.es.description) },
				actions: { primary: { label: contactCTA.es.button, variant: 'primary-special', size: 'large' } },
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
	es: { key: 'blog', slug: contentES.page.slug, template: 'blog', meta: { title: contentES.page.meta.title, description: contentES.page.meta.description } },
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
