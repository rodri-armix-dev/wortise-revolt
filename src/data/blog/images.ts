import type { ComponentProps } from 'astro/types';
import type Image from '../../components/atoms/Image/Image.astro';
import adNetwork from '../../assets/blog/ad-network.webp';
import adPlatforms from '../../assets/blog/ad-platforms.webp';
import trends from '../../assets/blog/programmatic-trends.webp';
import adBlocking from '../../assets/blog/ad-blocking.webp';
import appAds from '../../assets/blog/app-ads-txt.webp';
import selfServe from '../../assets/blog/self-serve.webp';
import cookies from '../../assets/blog/cookies.webp';

export const blogImages = {
	'ad-network': { src: adNetwork, alt: 'Órbitas y una trayectoria publicitaria en rosa.' },
	'ad-platforms': { src: adPlatforms, alt: 'Escudo azul con un símbolo de protección.' },
	'programmatic-trends': { src: trends, alt: 'Curva de crecimiento rosa con una marca de verificación.' },
	'ad-blocking': { src: adBlocking, alt: 'Tres bloques grises conectados por una línea discontinua.' },
	'app-ads-txt': { src: appAds, alt: 'Panel rosa con una lista y un botón de añadir.' },
	'self-serve': { src: selfServe, alt: 'Dos controles azules conectados.' },
	cookies: { src: cookies, alt: 'Símbolo rosa de bloqueo dentro de un círculo.' },
} satisfies Record<string, ComponentProps<typeof Image>>;
