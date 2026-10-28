import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { getViteConfig } from 'astro/config';

// Use Astro's own Vite runtime to exercise real content imports and import.meta.env.
// Middleware mode and disabled HMR keep this harness off the project's dev port.
process.env.NODE_ENV = 'test';
// Astro skips its HTTP app when running a module-only test harness.
process.env.VITEST = 'true';
const require = createRequire(import.meta.resolve('astro/package.json'));
const { createServer } = await import(require.resolve('vite'));

for (const { mode, development } of [
	{ mode: 'development', development: true },
	{ mode: 'launch', development: true },
	{ mode: 'production', development: false },
	{ mode: 'launch', development: false },
]) {
	process.env.NODE_ENV = development ? 'test' : 'production';
	const config = await getViteConfig({
		mode,
		server: { middlewareMode: true, hmr: false, watch: null, ws: false },
		logLevel: 'silent',
	})({ mode, command: 'serve' });
	const server = await createServer(config);
	try {
		const routes = await server.ssrLoadModule('/src/i18n/routes.ts');
		const navigation = await server.ssrLoadModule('/src/i18n/navigation.ts');
		const { pageData } = await server.ssrLoadModule('/src/data/pages/index.ts');
		const launch = mode === 'launch';
		const adsPath = launch ? '/es/' : '/es/wortise-ads/';
		assert.equal(routes.getPagePath('es', 'wortise-ads'), adsPath);
		assert.equal(routes.getPagePath('en', 'wortise-ads'), launch ? '/en/' : '/en/wortise-ads/');
		assert.equal(routes.getPagePath('pt', 'wortise-ads'), launch ? '/pt/' : '/pt/wortise-ads/');
		assert.equal(routes.getPagePath('es', 'about'), launch ? undefined : '/es/nosotros/');
		assert.equal(routes.getPagePath('en', 'home'), launch ? undefined : '/en/');
		assert.equal(routes.getPagePath('es', 'ui'), development && !launch ? '/es/ui/' : undefined);
		assert.equal(routes.getPageFromPath('/es/ui/'), development && !launch ? 'ui' : undefined);
		assert.equal(routes.getPagePath('es', 'ui', '/preview/'), development && !launch ? '/preview/es/ui/' : undefined);
		assert.ok(navigation.getLanguageItems('/es/ui/').every((item) => development && !launch ? true : !item.available && !item.href));
		assert.equal(routes.getPageFromPath('/es/unknown/'), undefined);
		assert.ok(navigation.getLanguageItems('/es/unknown/').every((item) => !item.available && !item.href));
		assert.equal(routes.getPageFromPath(adsPath), 'wortise-ads');
		assert.equal(routes.getPagePath('es', 'wortise-ads', '/preview/'), `/preview${adsPath}`);
		assert.equal(routes.getPageFromPath(`/preview${adsPath}`, '/preview/'), 'wortise-ads');
		assert.deepEqual(navigation.getLanguageItems(`/preview${adsPath}`, '/preview/').map(({ code, available, href }) => ({ code, available, href })), [
			{ code: 'es', available: true, href: `/preview${adsPath}` },
			{ code: 'en', available: true, href: launch ? '/preview/en/' : '/preview/en/wortise-ads/' },
			{ code: 'pt', available: true, href: launch ? '/preview/pt/' : '/preview/pt/wortise-ads/' },
		]);
		if (launch) {
			assert.deepEqual(routes.getPublishedPages().map(({ locale, page }) => [locale, page.key, page.slug]), [
				['es', 'wortise-ads', ''],
				['en', 'wortise-ads', ''],
				['pt', 'wortise-ads', ''],

			]);
			assert.equal(routes.getPageFromPath('/es/wortise-ads/'), undefined);
		}


		const { getSiteData: getLegalSiteData } = await server.ssrLoadModule('/src/data/site.ts');
		if (launch) {
			for (const key of ['contact', 'terms', 'privacy', 'sdk-terms']) {
				for (const locale of ['es', 'en', 'pt']) {
					assert.equal(routes.getPagePath(locale, key), undefined);
					assert.equal(routes.getPagePath(locale, key, '/preview/'), undefined);
				}
			}
		} else {
			// Contact publishes only complete translations, in both profiles and with a base path.
			assert.equal(routes.getPagePath('es', 'contact'), '/es/contacto/');
			assert.equal(routes.getPagePath('en', 'contact'), undefined);
			assert.equal(routes.getPagePath('pt', 'contact'), undefined);
			assert.equal(routes.getPagePath('es', 'contact', '/preview/'), '/preview/es/contacto/');
			assert.equal(routes.getPageFromPath('/preview/es/contacto/', '/preview/'), 'contact');
			assert.deepEqual(navigation.getLanguageItems('/es/contacto/').map(({ available }) => available), [true, false, false]);
			assert.deepEqual(navigation.getLanguageItems('/preview/es/contacto/', '/preview/').map(({ available }) => available), [true, false, false]);
			assert.ok(!pageData.contact.es.footerCTA);
			const { getContactAction } = await server.ssrLoadModule('/src/data/navigation.ts');
			assert.equal(getContactAction('es').href, 'https://wortise.com/es/contact/');
			assert.equal(getContactAction('en').disabled, false);
			const { getSiteData: getContactSiteData } = await server.ssrLoadModule('/src/data/site.ts');
			assert.equal(getContactSiteData('es', '/es/contacto/').footer.brand.contact.href, 'https://wortise.com/es/contact/');
			assert.deepEqual(getContactSiteData('es', '/es/contacto/').footer.languages.items.map(({ available }) => available), [true, false, false]);
			const englishContact = { ...pageData.contact.es, slug: 'contact' };
			pageData.contact.en = englishContact;
			assert.equal(routes.getPagePath('en', 'contact'), '/en/contact/');
			assert.equal(navigation.getLanguageItems('/es/contacto/')[1].available, true);
			delete pageData.contact.en;


			// Legal translations resolve localized slugs, shell links and both language selectors.
			const { sanitizeLegalDocument } = await server.ssrLoadModule('/src/lib/sanitize-legal-document.ts');
			const { sanitizeRichText } = await server.ssrLoadModule('/src/lib/sanitize-rich-text.ts');
			const html = '<h2 onclick="bad()">Título</h2><hr><h3>Subtítulo</h3><p style="color:red">Texto <a href="https://example.com" target="_blank">enlace</a></p><script>bad()</script><iframe src="https://example.com"></iframe>';
			const safe = sanitizeLegalDocument(html);
			assert.ok(safe.includes('<h2>Título</h2><hr /><h3>Subtítulo</h3>'));
			assert.ok(safe.includes('rel="noopener noreferrer"'));
			assert.ok(!/onclick|style=|<script|<iframe/.test(safe));
			assert.ok(!sanitizeLegalDocument('<a href="javascript:bad()">x</a>').includes('href='));
			assert.ok(!/<h2|<hr|<h3/.test(sanitizeRichText(html)));
			for (const key of ['terms', 'privacy', 'sdk-terms']) {
				const sourceHtml = pageData[key].es.content.html;
				for (const locale of ['es', 'en', 'pt']) {
					const data = pageData[key][locale];
					const path = `/${locale}/${data.slug}/`;
					assert.equal(routes.getPagePath(locale, key), path);
					assert.equal(routes.getPageFromPath(path), key);
					assert.equal(routes.getPagePath(locale, key, '/preview/'), `/preview${path}`);
					assert.equal(routes.getPageFromPath(`/preview${path}`, '/preview/'), key);
					assert.equal(data.template, 'legal');
					assert.ok(!('modules' in data));
					assert.ok(getLegalSiteData(locale, path).footer.legal.items.some(({ href }) => href === `https://wortise.com/${locale}/${key === 'privacy' ? 'privacy-policy' : key}/`));
					assert.deepEqual(navigation.getLanguageItems(path).map(({ available }) => available), [true, true, true]);
					// Preserve every paragraph, heading, separator, legal link and numbered clause.
					assert.deepEqual(data.content.html.match(/<\/?[a-z][^>]*>/g), sourceHtml.match(/<\/?[a-z][^>]*>/g));
					assert.deepEqual(data.content.html.match(/<(?:p|h[234])>\d+(?:\.\d+)*\./g), sourceHtml.match(/<(?:p|h[234])>\d+(?:\.\d+)*\./g));
					assert.equal(data.content.updatedAt, pageData[key].es.content.updatedAt);
					assert.equal(data.content.effectiveAt, pageData[key].es.content.effectiveAt);
					if (locale !== 'es') assert.notEqual(data.content.html, sourceHtml);
				}
			}

		}

		// External links stay available in launch without publishing local routes.
		const { getContactAction: getExternalContactAction } = await server.ssrLoadModule('/src/data/navigation.ts');
		const { getDestinationHref } = await server.ssrLoadModule('/src/data/destinations.ts');
		for (const locale of ['es', 'en', 'pt']) {
			assert.equal(getExternalContactAction(locale).href, `https://wortise.com/${locale}/contact/`);
			assert.equal(getExternalContactAction(locale).disabled, false);
			const footer = getLegalSiteData(locale, adsPath).footer;
			assert.equal(footer.brand.contact.href, `https://wortise.com/${locale}/contact/`);
			for (const [key, slug] of [['sdk-terms', 'sdk-terms'], ['terms', 'terms'], ['privacy', 'privacy-policy']]) {
				assert.equal(getDestinationHref(locale, key), `https://wortise.com/${locale}/${slug}/`);
				assert.ok(footer.legal.items.some(({ href }) => href === `https://wortise.com/${locale}/${slug}/`));
			}
		}

		// An unpublished translation stays unavailable, including in the footer selector.
		const englishAds = pageData['wortise-ads'].en;
		delete pageData['wortise-ads'].en;
		assert.equal(routes.getPagePath('en', 'wortise-ads'), undefined);
		assert.equal(navigation.getLanguageItems(adsPath).find(({ code }) => code === 'en').available, false);
		assert.equal(getLegalSiteData('es', adsPath).footer.languages.items.find(({ code }) => code === 'en').href, '');
		pageData['wortise-ads'].en = { ...englishAds, slug: 'ads-platform' };
		const translatedPath = launch ? '/en/' : '/en/ads-platform/';
		assert.equal(routes.getPagePath('en', 'wortise-ads'), translatedPath);
		assert.equal(navigation.getLanguageItems(adsPath).find(({ code }) => code === 'en').href, translatedPath);
		assert.ok(routes.getPublishedPages().some(({ locale, page }) => locale === 'en' && page.key === 'wortise-ads'));
		pageData['wortise-ads'].en = englishAds;

		// Exercise registration of an additional legal destination.
		const { legalPages, publicationProfiles } = await server.ssrLoadModule('/config/publication.ts');
		const { getSiteData } = await server.ssrLoadModule('/src/data/site.ts');
		legalPages.push({ page: 'about', labels: { es: 'Test legal' } });
		publicationProfiles.launch.pages.push('about');
		assert.equal(routes.getPagePath('es', 'about'), '/es/nosotros/');
		assert.ok(getSiteData('es', adsPath).footer.legal.items.some(({ href, label }) => href === '/es/nosotros/' && label === 'Test legal'));
		assert.ok(routes.getPublishedPages().some(({ page }) => page.key === 'about'));
		legalPages.pop();
		publicationProfiles.launch.pages.pop();
		console.log(`Publication routing: ${mode} (${development ? 'development' : 'production'}) passed`);
	} finally {
		await server.close();
	}
}
