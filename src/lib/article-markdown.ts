import { Marked, type TokensList, type Token } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { richTextPolicy } from './sanitize-rich-text.ts';

export type ArticleBlock = { type: 'html'; html: string } | { type: 'cta' | 'media'; id: string };

const markdown = new Marked({ async: false, gfm: true });

export function parseArticleMarkdown(source: string, known: { cta: readonly string[]; media: readonly string[] }): ArticleBlock[] {
	const tokens = markdown.lexer(source);
	const blocks: ArticleBlock[] = [];
	let pending: Token[] = [];
	const flush = () => {
		if (!pending.length) return;
		const chunk = Object.assign(pending, { links: tokens.links }) as TokensList;
		const html = sanitizeHtml(markdown.parser(chunk), {
			...richTextPolicy,
			allowedTags: [...richTextPolicy.allowedTags as string[], 'h2', 'h3', 'h4', 'hr', 'pre', 'img', 'figure', 'figcaption'],
			allowedAttributes: { ...richTextPolicy.allowedAttributes, img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'] },
			allowedSchemesByTag: { img: ['https', 'http'] },
			transformTags: {
				...richTextPolicy.transformTags,
				img: (_tag, attributes) => ({ tagName: 'img', attribs: { ...attributes, loading: 'lazy', decoding: 'async' } }),
			},
		});
		if (html.trim()) blocks.push({ type: 'html', html });
		pending = [];
	};
	for (const token of tokens) {
		const marker = token.type === 'paragraph' ? /^\[(cta|media) id="([a-z0-9-]+)"\]$/.exec(token.raw.trim()) : null;
		if (!marker) {
			pending.push(token);
			continue;
		}
		flush();
		const type = marker[1] as 'cta' | 'media';
		const id = marker[2];
		if (!known[type].includes(id)) throw new Error(`Unknown article ${type}: ${id}`);
		blocks.push({ type, id });
	}
	flush();
	return blocks;
}
