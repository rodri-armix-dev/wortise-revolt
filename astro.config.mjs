// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { defaultLocale, locales } from './src/i18n/config.ts';
import { sharedBreakpointsImporter } from './config/breakpoints.ts';
import { prepareScss, projectScssImporter } from './config/scss.ts';
import publicationAssets from './integrations/publication-assets/integration.ts';
import viewportToolbar from './integrations/viewport-toolbar/integration.ts';
import vercelLanguage from './integrations/vercel-language/integration.ts';

// https://astro.build/config
export default defineConfig({
	integrations: [viewportToolbar(), publicationAssets(), vercelLanguage()],
	vite: {
		plugins: [{
			name: 'wortise-vite-cache',
			config(_config, { command, mode }) {
				// Builds, tests and other profiles must not invalidate a running dev server's dependencies.
				const cacheKey = [command, mode, process.env.NODE_ENV ?? 'development'].map(encodeURIComponent).join('-');
				return { cacheDir: fileURLToPath(new URL(`./node_modules/.vite/${cacheKey}/`, import.meta.url)) };
			},
		}],
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: prepareScss,
					importers: [sharedBreakpointsImporter, projectScssImporter],
				},
			},
		},
	},
	i18n: {
		defaultLocale,
		locales: [...locales],
		routing: {
			prefixDefaultLocale: true,
		},
	},
});
