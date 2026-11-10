import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import { rm } from 'node:fs/promises';
import { getPublicationProfile } from '../../config/publication';
import { pruneUnusedAssets } from './prune.mjs';

export default function publicationAssets(): AstroIntegration {
	let prune = false;
	return {
		name: 'wortise-publication-assets',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({ vite: { plugins: [{
					name: 'wortise-publication-profile',
					configResolved(config) {
						prune = getPublicationProfile(config.mode).pruneUnusedAssets;
					},
				}] } });
			},
			'astro:build:done': async ({ dir, logger }) => {
				await rm(new URL('development/videos/', dir), { recursive: true, force: true });
				if (!prune) return;
				const removed = await pruneUnusedAssets(fileURLToPath(dir));
				logger.info(`Removed ${removed.length} unused launch assets.`);
			},
		},
	};
}
