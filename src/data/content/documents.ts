import { Marked } from 'marked';
import type { BlogPost } from '../blog/types';
import type { LegalPageData } from '../pages/page.types';
import { validateContent } from './validate';

const markdown = new Marked({ gfm: true });

function isDate(value: unknown): value is string {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
	const date = new Date(value);
	return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parseDocument(source: string): { metadata: Record<string, unknown>; body: string } {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
	if (!match) throw new Error('Documento sin metadatos: se esperaba un bloque JSON entre líneas --- .');
	const metadata: unknown = JSON.parse(match[1]);
	if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) throw new Error('Metadatos inválidos.');
	return { metadata: metadata as Record<string, unknown>, body: match[2] };
}

export function readBlogDocument(source: string, id: string): Omit<BlogPost, 'media' | 'featuredTone' | 'authorImage'> {
	const { metadata, body } = parseDocument(source);
	const { tags, demo, ...text } = metadata;
	validateContent(text, { id: 'string', slug: 'string', title: 'string', excerpt: 'string', lead: 'string', author: 'string', date: 'string', category: 'string' }, `blog.${id}`);
	if (metadata.id !== id) throw new Error(`blog.${id}: identificador desconocido.`);
	if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === 'string' && tag.trim())) throw new Error(`blog.${id}: etiquetas inválidas.`);
	if (typeof demo !== 'boolean') throw new Error(`blog.${id}: demo debe ser booleano.`);
	if (!isDate(metadata.date)) throw new Error(`blog.${id}: fecha inválida.`);
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(metadata.slug))) throw new Error(`blog.${id}: slug inválido.`);
	if (!body.trim()) throw new Error(`blog.${id}: el cuerpo es obligatorio.`);
	return { ...(text as Pick<BlogPost, 'id' | 'slug' | 'title' | 'excerpt' | 'lead' | 'author' | 'date' | 'category'>), tags, demo, markdown: body };
}

export function readLegalDocument<Key extends string>(source: string, key: Key, locale: string): LegalPageData<Key> {
	const { metadata, body } = parseDocument(source);
	const { key: documentKey, template, ...content } = metadata;
	validateContent(content, {
		slug: 'string', meta: { title: 'string', description: 'string' },
		content: key === 'privacy'
			? { eyebrow: 'string', title: 'string', updatedAt: 'string', effectiveAt: 'string' }
			: { eyebrow: 'string', title: 'string', introduction: 'string' },
	}, `legal.${key}.${locale}`);
	if (documentKey !== key || template !== 'legal') throw new Error(`legal.${key}.${locale}: identificador o plantilla inválidos.`);
	if (!body.trim()) throw new Error(`legal.${key}.${locale}: el cuerpo es obligatorio.`);
	if (key === 'privacy') {
		const dates = (metadata.content as Record<string, unknown>);
		if (!isDate(dates.updatedAt) || !isDate(dates.effectiveAt)) throw new Error(`legal.${key}.${locale}: fecha inválida.`);
	}
	const data = content as Omit<LegalPageData<Key>, 'key' | 'template'>;
	return { ...data, key, template: 'legal', content: { ...data.content, html: (body.match(/^\s*/)?.[0] ?? '') + markdown.parse(body, { async: false }) } };
}
