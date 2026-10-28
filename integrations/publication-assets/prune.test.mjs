import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { pruneUnusedAssets } from './prune.mjs';

test('keeps transitive CSS, fonts, dynamic JS imports and assets with a base path', async () => {
	const root = await mkdtemp(join(tmpdir(), 'wortise-assets-'));
	try {
		await mkdir(join(root, '_astro'));
		const files = {
			'index.html': '<link href="/preview/_astro/page.css"><script src="/preview/_astro/app.js"></script>',
			'_astro/page.css': '@font-face{src:url(./font.woff2?v=1)}',
			'_astro/font.woff2': 'font',
			'_astro/app.js': 'import("./lazy.js");',
			'_astro/lazy.js': 'const image="/preview/_astro/image.svg";',
			'_astro/image.svg': '<svg/>',
			'_astro/unused.js': 'unused',
			'_astro/unused.jpg': 'unused',
			'.DS_Store': 'unused',
			'favicon.ico': 'icon',
		};
		await Promise.all(Object.entries(files).map(([path, text]) => writeFile(join(root, path), text)));
		assert.deepEqual((await pruneUnusedAssets(root)).sort(), ['.DS_Store', '_astro/unused.jpg', '_astro/unused.js']);
		assert.equal((await readdir(join(root, '_astro'))).length, 5);
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});

test('supports explicit entries for runtime-computed assets', async () => {
	const root = await mkdtemp(join(tmpdir(), 'wortise-assets-'));
	try {
		await writeFile(join(root, 'index.html'), '<main/>');
		await writeFile(join(root, 'runtime.webp'), 'image');
		assert.deepEqual(await pruneUnusedAssets(root, ['runtime.webp']), []);
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});
