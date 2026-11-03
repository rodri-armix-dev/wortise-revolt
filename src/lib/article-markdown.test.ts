import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseArticleMarkdown } from './article-markdown.ts';

const known = { cta: ['tips-app'], media: ['cover'] };

test('renders Markdown and interleaved components in editorial order, keeping reference links', () => {
	const blocks = parseArticleMarkdown('## Primero\n\n[Guía][guide]\n\n[cta id="tips-app"]\n\n[media id="cover"]\n\nDespués.\n\n[guide]: https://example.com', known);
	assert.deepEqual(blocks.map(({ type }) => type), ['html', 'cta', 'media', 'html']);
	assert.ok(blocks[0].type === 'html' && blocks[0].html.includes('<h2>Primero</h2>'));
	assert.ok(blocks[0].type === 'html' && blocks[0].html.includes('href="https://example.com"'));
	assert.deepEqual(blocks[1], { type: 'cta', id: 'tips-app' });
});

test('does not interpret markers inside code, quotations or inline text', () => {
	const blocks = parseArticleMarkdown('```text\n[cta id="tips-app"]\n```\n\n> [cta id="tips-app"]\n\nTexto [cta id="tips-app"].', known);
	assert.ok(blocks.every(({ type }) => type === 'html'));
});

test('rejects missing component IDs instead of publishing an incomplete article', () => {
	assert.throws(() => parseArticleMarkdown('[cta id="missing"]', known), /Unknown article cta/);
});

test('sanitizes scripts, event handlers, style and unsafe URLs after Markdown parsing', () => {
	const blocks = parseArticleMarkdown('<script>alert(1)</script>\n\n<a href="javascript:alert(1)" target="_blank" onclick="alert(2)">Enlace</a>\n\n<img src="javascript:alert(1)" onerror="alert(2)" style="position:fixed" alt="Texto">', known);
	const html = blocks.filter((block) => block.type === 'html').map((block) => block.html).join('');
	assert.doesNotMatch(html, /<script|javascript:|onerror|onclick|style=/);
	assert.match(html, /noopener noreferrer/);
});
