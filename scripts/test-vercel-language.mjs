import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { transpileModule, ModuleKind } from 'typescript';
import middleware from '../.vercel/output/functions/language.func/index.js';
import { languageRedirect, selectLanguage } from '../.vercel/output/functions/language.func/negotiation.js';
import * as settings from '../.vercel/output/functions/language.func/config.js';

const launch = process.argv.includes('--launch');
const base = process.argv.find((arg) => arg.startsWith('--base='))?.slice(7) ?? '/';
const full = { es: '/es/', en: '/en/' };
const all = { ...full, pt: '/pt/' };
for (const [header, cookie, homes, expected] of [
	['en-US,en;q=0.9,es;q=0.8', '', full, 'en'],
	['es;q=0.2,en;q=0.9', '', full, 'en'],
	['en;q=0.7,es;q=0.7', '', full, 'en'],
	['pt-BR,en;q=0.8', '', full, 'en'],
	['pt-BR,en;q=0.8', '', all, 'pt'],
	['PT-pt', '', all, 'pt'],
	['fr,de;q=0.5', '', full, 'es'],
	['en;q=0,es;q=0.8', '', full, 'es'],
	['es;q=0,*;q=0.5', '', full, 'en'],
	['en;q=bad,es;q=0.5', '', full, 'es'],
	['en;q=1.5,es;q=0.5', '', full, 'es'],
	['', '', full, 'es'],
	['en', 'other=x; wortise_locale=es', full, 'es'],
	['en', 'wortise_locale=pt', full, 'en'],
	['es', 'wortise_locale=pt', all, 'pt'],
	['en', 'wortise_locale=fr', full, 'en'],
	['en', 'wortise_locale=%ZZ', full, 'en'],
]) assert.equal(selectLanguage(header, cookie, homes), expected, `${header} / ${cookie}`);

const origin = 'https://wortise.example';
for (const [header, cookie, expected] of [
	['en-US', '', 'en'],
	['pt-BR,en;q=0.9', '', launch ? 'pt' : 'en'],
	['es', 'wortise_locale=en', 'en'],
	['fr', '', 'es'],
]) {
	const response = middleware(new Request(`${origin}${base}?utm_source=test`, { headers: { 'Accept-Language': header, Cookie: cookie } }));
	assert.equal(response.status, 307);
	assert.equal(response.headers.get('location'), `${origin}${base}${expected}/?utm_source=test`);
	assert.equal(response.headers.get('cache-control'), 'private, no-store');
	assert.equal(response.headers.get('vary'), 'Accept-Language, Cookie');
}
for (const path of ['es/', 'en/', 'pt/', 'unknown/', 'es/unknown/', 'favicon.svg']) {
	const response = middleware(new Request(`${origin}${base}${path}`, { headers: { 'Accept-Language': 'en' } }));
	assert.equal(response.headers.get('location'), null);
	assert.equal(response.headers.get('x-middleware-next'), '1');
}
assert.equal(middleware(new Request(`${origin}${base}`, { method: 'HEAD' })).status, 307);
assert.equal(middleware(new Request(`${origin}${base}`, { method: 'POST' })).headers.get('location'), null);
assert.equal(languageRedirect(new Request(`${origin}/preview/`, { headers: { 'Accept-Language': 'en' } }), {
	basePath: '/preview/', homes: { es: '/preview/es/', en: '/preview/en/' },
}).headers.get('location'), `${origin}/preview/en/`);

const output = new URL('../.vercel/output/', import.meta.url);
const routing = JSON.parse(await readFile(new URL('config.json', output), 'utf8'));
assert.equal(routing.version, 3);
assert.ok(new RegExp(routing.routes[0].src).test(base));
assert.ok(!new RegExp(routing.routes[0].src).test(`${base}es/`));
assert.deepEqual(await readdir(new URL('functions/', output)), ['language.func']);
for (const locale of launch ? ['es', 'en', 'pt'] : ['es', 'en']) {
	const html = await readFile(new URL(`static/${base.slice(1)}${locale}/index.html`, output), 'utf8');
	assert.ok(html.includes('data-language-choice="en"'));
	assert.equal(html.includes('data-language-choice="pt"'), launch);
	assert.equal((html.match(/data-language-choice="en"/g) ?? []).length, launch ? 1 : 2);
}
if (!launch) await assert.rejects(access(new URL(`static/${base.slice(1)}pt/index.html`, output)));

// Exercise the actual selector script with browser storage available and blocked.
const source = await readFile(new URL('../src/i18n/preference.ts', import.meta.url), 'utf8');
const compiled = transpileModule(source.replace('import.meta.env.BASE_URL', JSON.stringify(base)), {
	compilerOptions: { module: ModuleKind.CommonJS },
}).outputText;
let listener;
let cookie = '';
let blocked = false;
let choice = 'en';
class Element {
	closest() { return choice ? { dataset: { languageChoice: choice }, href: `${origin}${base}${choice}/` } : null; }
}
runInNewContext(compiled, {
	exports: {}, require: () => settings, Element, URL,
	location: { origin, protocol: 'https:' },
	document: {
		addEventListener: (name, callback) => { assert.equal(name, 'click'); listener = callback; },
		set cookie(value) { if (blocked) throw new Error('Storage blocked'); cookie = value; },
	},
});
listener({ target: new Element() });
assert.equal(cookie, `wortise_locale=en; Path=${base}; Max-Age=31536000; SameSite=Lax; Secure`);
cookie = '';
choice = 'invalid';
listener({ target: new Element() });
assert.equal(cookie, '');
choice = 'pt';
blocked = true;
assert.doesNotThrow(() => listener({ target: new Element() }));
console.log(`Vercel language routing and selector preferences passed (${launch ? 'launch' : 'full'}, base ${base}).`);
