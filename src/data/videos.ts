import { readContent } from './content/validate';
import rawES from '../content/pages/wortise-ads/es.json';
import rawEN from '../content/pages/wortise-ads/en.json';
import rawPT from '../content/pages/wortise-ads/pt.json';

import type { ComponentProps } from 'astro/types';
import type Video from '../components/atoms/Video/Video.astro';
import type { Locale } from '../i18n/config';

const contentES = readContent(rawES, 'pages/wortise-ads/es');
const contentEN = readContent(rawEN, 'pages/wortise-ads/en');
const contentPT = readContent(rawPT, 'pages/wortise-ads/pt');

const base = import.meta.env.BASE_URL;

export const wortiseVideos = {
	es: { src: `${base}pages/wortise-ads/presentation-es.mp4`, label: contentES.video.label, width: 848, height: 478, aspectRatio: '16/9' },
	en: { src: `${base}pages/wortise-ads/presentation-en.mp4`, label: contentEN.video.label, width: 848, height: 478, aspectRatio: '16/9' },
	pt: { src: `${base}pages/wortise-ads/presentation-pt.mp4`, label: contentPT.video.label, width: 848, height: 478, aspectRatio: '16/9' },
} satisfies Record<Locale, ComponentProps<typeof Video>>;
