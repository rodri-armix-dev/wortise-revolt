import { readContent } from './content/validate';
import rawES from '../content/global/calls-to-action/es.json';

import type { ComponentProps } from 'astro/types';
import type FooterCTA from '../components/organisms/FooterCTA/FooterCTA.astro';
import background from '../assets/global/footer/footer-cta-background.jpg';
import symbol from '../assets/global/branding/wortise-logo.webp';

const contentES = readContent(rawES, 'global/calls-to-action/es');

// Shared artwork; editorial CTA content belongs to each page.
export const footerCTAVisuals = {
	logo: { src: symbol, href: contentES.branding.logo.href, alt: contentES.branding.logo.alt },
	background,
} satisfies Pick<ComponentProps<typeof FooterCTA>, 'logo' | 'background'>;
