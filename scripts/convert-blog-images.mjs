import { readdir, mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const loadDependency = createRequire(import.meta.resolve('astro/package.json'));
const sharp = loadDependency('sharp');
const source = new URL('../exports/blog/png/', import.meta.url);
const destination = new URL('../src/assets/blog/', import.meta.url);
await mkdir(destination, { recursive: true });

for (const name of (await readdir(source)).filter((name) => name.endsWith('.png')).sort()) {
	const input = fileURLToPath(new URL(name, source));
	const output = fileURLToPath(new URL(name.replace(/\.png$/, '.webp'), destination));
	const metadata = await sharp(input).metadata();
	const before = await sharp(input).stats();
	if (metadata.width !== 1680 || metadata.height !== 1260 || !metadata.hasAlpha || before.channels[3].min !== 0) {
		throw new Error(`${name}: expected a transparent 1680 × 1260 PNG`);
	}
	await sharp(input).webp({ lossless: true, effort: 6 }).toFile(output);
	const after = await sharp(output).metadata();
	const originalAlpha = await sharp(input).extractChannel('alpha').raw().toBuffer();
	const convertedAlpha = await sharp(output).extractChannel('alpha').raw().toBuffer();
	if (!after.hasAlpha || after.width !== 1680 || after.height !== 1260 || !originalAlpha.equals(convertedAlpha)) {
		throw new Error(`${name}: WebP transparency or dimensions changed`);
	}
	console.log(`${name}: ${Math.round((await stat(input)).size / 1024)} KiB PNG → ${Math.round((await stat(output)).size / 1024)} KiB WebP; alpha preserved`);
}
