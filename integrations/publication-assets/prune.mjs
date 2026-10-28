import { readdir, readFile, rm } from 'node:fs/promises';
import { basename, extname, join, relative } from 'node:path';

const textExtensions = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.xml', '.txt', '.webmanifest']);
const defaultEntries = new Set(['favicon.ico', 'favicon.svg', 'robots.txt', 'manifest.webmanifest']);

// Follow literal asset filenames transitively through HTML, CSS, JS and SVG.
// Matching basenames conservatively retains collisions, encoded URLs and query strings.
// Runtime-computed asset names must be declared as explicit entries by the caller.
export async function pruneUnusedAssets(directory, entries = []) {
	async function walk(folder) {
		const children = await readdir(folder, { withFileTypes: true });
		const paths = await Promise.all(children.map((child) => child.isDirectory()
			? walk(join(folder, child.name))
			: child.isFile() ? [join(folder, child.name)] : []));
		return paths.flat();
	}

	const files = await walk(directory);
	const roots = new Set([...defaultEntries, ...entries]);
	const retained = new Set(files.filter((file) => {
		const path = relative(directory, file);
		return extname(file) === '.html' || roots.has(path) || /^sitemap.*\.xml$/.test(basename(file));
	}));
	const queue = [...retained];
	for (const file of queue) {
		if (!textExtensions.has(extname(file))) continue;
		const content = await readFile(file, 'utf8');
		for (const candidate of files) {
			if (retained.has(candidate) || basename(candidate).startsWith('.')) continue;
			const name = basename(candidate);
			if (content.includes(name) || content.includes(encodeURIComponent(name))) {
				retained.add(candidate);
				queue.push(candidate);
			}
		}
	}

	const removed = files.filter((file) => !retained.has(file));
	await Promise.all(removed.map((file) => rm(file)));
	return removed.map((file) => relative(directory, file));
}
