import type { ComponentProps } from 'astro/types';
import type FooterCTA from '../components/organisms/FooterCTA/FooterCTA.astro';
import background from '../assets/footer/footer-cta-background.jpg';
import symbol from '../assets/logo.png';

// Shared artwork; editorial CTA content belongs to each page.
export const footerCTAVisuals = {
	logo: { src: symbol, href: '', alt: 'Wortise' },
	background,
} satisfies Pick<ComponentProps<typeof FooterCTA>, 'logo' | 'background'>;
