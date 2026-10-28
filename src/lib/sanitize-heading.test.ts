import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sanitizeHeading } from './sanitize-heading.ts';

test('preserves plain text, entities, muted spans and editorial breaks', () => {
	assert.equal(sanitizeHeading('Marcas &amp; personas'), 'Marcas &amp; personas');
	assert.equal(
		sanitizeHeading('<span data-tone="muted">Conectamos marcas</span><br>con personas'),
		'<span data-tone="muted">Conectamos marcas</span><br />con personas',
	);
	assert.equal(sanitizeHeading(''), '');
});

test('removes executable content, links and styling while preserving title text', () => {
	assert.equal(
		sanitizeHeading('<script>alert(1)</script><style>body{display:none}</style><img src=x onerror="alert(1)"><a href="javascript:alert(1)"><strong>Marcas</strong></a>'),
		'Marcas',
	);
	assert.equal(
		sanitizeHeading('<h1>Título</h1><p>Texto</p><span class="heading__segment" style="color:red" onclick="alert(1)" data-tone="muted">atenuado</span>'),
		'TítuloTexto<span data-tone="muted">atenuado</span>',
	);
});

test('allows only the reviewed tone marker on spans', () => {
	assert.equal(
		sanitizeHeading('<span data-tone="red" data-extra="x">Texto</span><br data-tone="muted">'),
		'<span>Texto</span><br />',
	);
});
