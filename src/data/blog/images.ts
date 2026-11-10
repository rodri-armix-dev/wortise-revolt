import { readContent } from '../content/validate';
import rawES from '../../content/pages/blog/es.json';

import type { ComponentProps } from 'astro/types';
import type Image from '../../components/atoms/Image/Image.astro';
import adNetwork from '../../assets/blog/articles/ad-network.webp';
import adPlatforms from '../../assets/blog/articles/ad-platforms.webp';
import trends from '../../assets/blog/articles/programmatic-trends.webp';
import adBlocking from '../../assets/blog/articles/ad-blocking.webp';
import appAds from '../../assets/blog/articles/app-ads-txt.webp';
import selfServe from '../../assets/blog/articles/self-serve.webp';
import cookies from '../../assets/blog/articles/cookies.webp';

const contentES = readContent(rawES, 'pages/blog/es');

export const blogImages = {
	'ad-network': { src: adNetwork, alt: contentES.images['ad-network'].alt },
	'ad-platforms': { src: adPlatforms, alt: contentES.images['ad-platforms'].alt },
	'programmatic-trends': { src: trends, alt: contentES.images['programmatic-trends'].alt },
	'ad-blocking': { src: adBlocking, alt: contentES.images['ad-blocking'].alt },
	'app-ads-txt': { src: appAds, alt: contentES.images['app-ads-txt'].alt },
	'self-serve': { src: selfServe, alt: contentES.images['self-serve'].alt },
	cookies: { src: cookies, alt: contentES.images.cookies.alt },
} satisfies Record<string, ComponentProps<typeof Image>>;
