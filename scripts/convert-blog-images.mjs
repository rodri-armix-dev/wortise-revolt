import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';

const loadDependency = createRequire(import.meta.resolve('astro/package.json'));
const sharp = loadDependency('sharp');
const [inputDirectory, outputDirectory = 'src/assets/blog/articles'] = process.argv.slice(2);
if (!inputDirectory) throw new Error('Uso: node scripts/convert-blog-images.mjs <carpeta-originales> [carpeta-destino]');
const source = resolve(inputDirectory);
const destination = resolve(outputDirectory);
if (source === destination) throw new Error('Usar carpetas distintas para originales y resultados.');
await mkdir(destination, { recursive: true });

for (const name of (await readdir(source)).filter((name) => /\.(png|jpe?g)$/i.test(name)).sort()) {
	const original = await readFile(join(source, name));
	const result = await sharp(original).webp({ lossless: true, effort: 6 }).toBuffer();
	const before = await sharp(original).ensureAlpha().raw().toBuffer();
	const after = await sharp(result).ensureAlpha().raw().toBuffer();
	if (!before.equals(after)) throw new Error(`${name}: la conversión alteró los píxeles.`);
	if (result.length >= original.length) {
		console.log(`${name}: conservar original; WebP no reduce el peso.`);
		continue;
	}
	await writeFile(join(destination, name.replace(/\.(png|jpe?g)$/i, '.webp')), result);
	console.log(`${name}: ${original.length} → ${result.length} bytes; píxeles conservados.`);
}
