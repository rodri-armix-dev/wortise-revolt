import type { ComponentProps } from 'astro/types';
import type Video from '../components/atoms/Video/Video.astro';
import type { Locale } from '../i18n/config';

const base = import.meta.env.BASE_URL;

export const wortiseVideos = {
	es: { src: `${base}videos/wortise/wortise-es.mp4`, label: 'Presentación de Wortise.', width: 848, height: 478, aspectRatio: '16/9' },
	en: { src: `${base}videos/wortise/wortise-en.mp4`, label: 'Introducing Wortise.', width: 848, height: 478, aspectRatio: '16/9' },
	pt: { src: `${base}videos/wortise/wortise-pt.mp4`, label: 'Apresentação da Wortise.', width: 848, height: 478, aspectRatio: '16/9' },
} satisfies Record<Locale, ComponentProps<typeof Video>>;
