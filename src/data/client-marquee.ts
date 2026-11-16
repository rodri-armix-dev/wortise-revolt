import type { ComponentProps } from 'astro/types';
import type LogoMarquee from '../components/molecules/LogoMarquee/LogoMarquee.astro';
import contentES from '../content/pages/home/es.json';
import hbo from '../assets/pages/home/hbo.webp';
import apple from '../assets/pages/home/apple.webp';
import spotify from '../assets/pages/home/spotify.webp';
import toyota from '../assets/pages/home/toyota.webp';
import mcdonalds from '../assets/pages/home/mcdonalds.webp';
import visa from '../assets/pages/home/visa.webp';

export const clientMarqueeES = {
	label: contentES.clients.label,
	logos: [
		{ id: 'hbo', src: hbo, name: contentES.clients.logos.hbo.name, width: 76.313, height: 31.449 },
		{ id: 'apple', src: apple, name: contentES.clients.logos.apple.name, width: 32.886, height: 40.476 },
		{ id: 'spotify', src: spotify, name: contentES.clients.logos.spotify.name, width: 42.641, height: 42.686 },
		{ id: 'toyota', src: toyota, name: contentES.clients.logos.toyota.name, width: 59.879, height: 60.627 },
		{ id: 'mcdonalds', src: mcdonalds, name: contentES.clients.logos.mcdonalds.name, width: 61.412, height: 61.466, mirrored: true },
		{ id: 'visa', src: visa, name: contentES.clients.logos.visa.name, width: 91.867, height: 29.765 },
	],
} satisfies ComponentProps<typeof LogoMarquee>;
