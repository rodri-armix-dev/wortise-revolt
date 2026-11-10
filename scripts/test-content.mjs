import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { getViteConfig } from 'astro/config';

process.env.NODE_ENV = 'test';
process.env.VITEST = 'true';
const require = createRequire(import.meta.resolve('astro/package.json'));
const { createServer } = await import(require.resolve('vite'));
const config = await getViteConfig({ server: { middlewareMode: true, hmr: false, watch: null, ws: false }, logLevel: 'silent' })({ mode: 'development', command: 'serve' });
const server = await createServer(config);
async function walk(directory) {
	return (await Promise.all((await readdir(directory, { withFileTypes: true })).map((entry) => entry.isDirectory()
		? walk(`${directory}/${entry.name}`) : `${directory}/${entry.name}`))).flat();
}
try {
	const { readContent, validateContent } = await server.ssrLoadModule('/src/data/content/validate.ts');
	const { headingHtml, descriptionHtml } = await server.ssrLoadModule('/src/data/content/format.ts');
	assert.match(headingHtml('*Muted*\nTitle'), /<span data-tone="muted">Muted<\/span><br\s*\/?>Title/);
	assert.ok(!headingHtml('<script>alert(1)</script>').includes('<script>'));
	assert.match(descriptionHtml('**Important**\nNext line'), /<strong>Important<\/strong><br\s*\/?>Next line/);
	assert.ok(!descriptionHtml('[Link](javascript:alert(1))').includes('href="javascript:'));
	assert.ok(!descriptionHtml('<img src=x onerror=alert(1)>').includes('<img'));
	assert.throws(() => validateContent({ buttonUrl: 'javascript:alert(1)' }, { buttonUrl: 'string' }));
	const { parseDocument, readBlogDocument, readLegalDocument } = await server.ssrLoadModule('/src/data/content/documents.ts');
	const contracts = JSON.parse(await readFile('src/data/content/contracts.json', 'utf8'));
	for (const id of Object.keys(contracts)) readContent(JSON.parse(await readFile(`src/content/${id}.json`, 'utf8')), id);
	assert.throws(() => JSON.parse('{"title":}'));
	assert.throws(() => validateContent({}, { title: 'string' }));
	assert.throws(() => validateContent({ title: '' }, { title: 'string' }));
	assert.throws(() => validateContent({ title: 42 }, { title: 'string' }));
	assert.throws(() => validateContent({ title: 'Texto', extra: 'Desconocido' }, { title: 'string' }));
	assert.throws(() => validateContent({ href: 'javascript:alert(1)' }, { href: 'string' }));
	assert.throws(() => validateContent({ href: 'https://' }, { href: 'string' }));
	assert.throws(() => readContent({}, 'pages/unknown/es'));
	assert.throws(() => parseDocument('Sin metadatos'));
	assert.throws(() => parseDocument('---\n{invalid}\n---\nBody'));
	for (const file of (await walk('src/content/blog')).filter((file) => file.endsWith('.md') && !file.endsWith('README.md'))) {
		const id = file.split('/').at(-1).replace('.md', '');
		const source = await readFile(file, 'utf8');
		readBlogDocument(source, id);
		assert.throws(() => readBlogDocument(source, 'unknown'));
	}
	for (const file of (await walk('src/content/legal')).filter((file) => file.endsWith('.md') && !file.endsWith('README.md'))) {
		const parts = file.split('/');
		readLegalDocument(await readFile(file, 'utf8'), parts.at(-2), parts.at(-1).replace('.md', ''));
	}
	const { pageData } = await server.ssrLoadModule('/src/data/pages/index.ts');
	assert.deepEqual(Object.keys(pageData.about), ['es']);
	assert.deepEqual(Object.keys(pageData.developers), ['es']);
	assert.deepEqual(Object.keys(pageData['wortise-ads']), ['es', 'en', 'pt']);
	assert.equal(pageData.home.pt, undefined);
	assert.equal(pageData.blog.en, undefined);
	// Every literal local asset import and CSS URL must resolve after renaming.
	for (const directory of ['src', 'config', 'scripts', 'integrations']) {
		for (const file of (await walk(directory)).filter((file) => /\.(ts|astro|scss|mjs)$/.test(file))) {
			const source = await readFile(file, 'utf8');
			for (const match of source.matchAll(/(?:from\s*|import\s*|url\(\s*)['"]([^'"\n]+)['"]/g)) {
				const target = match[1].split('?')[0];
				if (target.startsWith('.') && target.includes('assets/')) assert.ok((await stat(resolve(dirname(file), target))).isFile(), `${file}: ${target}`);
			}
		}
	}
	console.log(`Content contracts passed: ${Object.keys(contracts).length} JSON documents, articles, legal pages, missing translations and asset references.`);
} finally {
	await server.close();
}
