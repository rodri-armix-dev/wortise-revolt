import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { getViteConfig } from 'astro/config';

process.env.NODE_ENV = 'test';
process.env.VITEST = 'true';
const require = createRequire(import.meta.resolve('astro/package.json'));
const { createServer } = await import(require.resolve('vite'));
const config = await getViteConfig({ mode: 'launch', server: { middlewareMode: true, hmr: false, watch: null, ws: false }, logLevel: 'silent' })({ mode: 'launch', command: 'serve' });
const server = await createServer(config);
try {
	const { externalButtons } = await server.ssrLoadModule('/src/data/external-buttons.ts');
	// Distinct values catch accidental reuse of Spanish destinations in another locale.
	for (const locale of ['es', 'en', 'pt']) {
		for (const field of ['demoUrl', 'createAccountUrl', 'contactUrl', 'careersUrl', 'loginUrl', 'whatsappUrl', 'instagramUrl', 'linkedinUrl', 'facebookUrl', 'sdkDocumentationUrl', 'developersStartUrl', 'glossaryUrl', 'helpUrl', 'downloadTipsUrl', 'telegramUrl']) {
			externalButtons[locale][field] = `https://example.com/${locale}/${field}`;
		}
		externalButtons[locale].emailUrl = `mailto:${locale}@example.com`;
	}
	const { wortiseAdsPageData } = await server.ssrLoadModule('/src/data/pages/wortise-ads.ts');
	const { getContactAction, getMainMenuItems } = await server.ssrLoadModule('/src/data/navigation.ts');
	const { getDestinationHref } = await server.ssrLoadModule('/src/data/destinations.ts');
	const { getSiteData } = await server.ssrLoadModule('/src/data/site.ts');
	for (const locale of ['es', 'en', 'pt']) {
		const links = externalButtons[locale];
		const page = wortiseAdsPageData[locale];
		assert.equal(page.footerCTA.text.actions.primary.href, links.demoUrl);
		assert.equal(page.modules.find((module) => module.type === 'ads-cover').props.textBlock.actions.primary.href, links.demoUrl);
		assert.ok(page.modules.find((module) => module.type === 'ads-sections').props.items.every((item) => item.action.href === links.demoUrl));
		assert.equal(getContactAction(locale).href, links.createAccountUrl);
		assert.equal(getDestinationHref(locale, 'contact'), links.contactUrl);
		assert.equal(getMainMenuItems(locale).find((item) => item.id === 'resources').children.find((item) => item.id === 'sdk-documentation').href, links.sdkDocumentationUrl);
		const site = getSiteData(locale, `/${locale}/`);
		assert.equal(site.whatsapp.href, links.whatsappUrl);
		assert.equal(site.footer.brand.contact.href, links.contactUrl);
		assert.equal(site.footer.menus.find((menu) => menu.variant === 'actions').items[1].href, links.demoUrl);
		assert.equal(site.footer.social.items[0].href, links.instagramUrl);
		assert.ok(site.footer.legal.items.some((item) => item.href === links.helpUrl));
	}
	const { homeData } = await server.ssrLoadModule('/src/data/home.ts');
	assert.equal(homeData.es.modules.find((module) => module.type === 'recruiting-section').props.action.href, externalButtons.es.careersUrl);
	const { developersPageData } = await server.ssrLoadModule('/src/data/pages/developers.ts');
	const developerButtons = developersPageData.es.modules[0].props.textBlock.actions;
	assert.equal(developerButtons.primary.href, externalButtons.es.developersStartUrl);
	assert.equal(developerButtons.primary.disabled, false);
	assert.equal(developerButtons.secondary.href, externalButtons.es.sdkDocumentationUrl);
	const { contactPageData } = await server.ssrLoadModule('/src/data/pages/contact.ts');
	assert.equal(contactPageData.es.modules[0].props.emailHref, externalButtons.es.emailUrl);
	assert.equal(contactPageData.es.modules[0].props.telegramHref, externalButtons.es.telegramUrl);
	externalButtons.en.contactUrl = '';
	assert.equal(getDestinationHref('en', 'contact'), undefined);
	assert.equal(getSiteData('en', '/en/').footer.brand.contact.disabled, true);
	assert.equal(getDestinationHref('es', 'contact'), externalButtons.es.contactUrl);
	console.log('Global button destinations passed: locale isolation, page CTAs, navigation, footer, careers, teams, contact and blank destinations.');
} finally {
	await server.close();
}
