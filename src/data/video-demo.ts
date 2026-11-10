import type { ComponentProps } from 'astro/types';
import type Video from '../components/atoms/Video/Video.astro';
import type VideoSection from '../components/organisms/VideoSection/VideoSection.astro';

const base = import.meta.env.BASE_URL;

// Temporary demo media: replace these records with the approved editorial videos.
export const landscapeVideoDemo = {
	src: `${base}development/videos/landscape-16x9.mp4`,
	label: 'Video de prueba horizontal: tránsito en la ciudad.',
	width: 1920,
	height: 1080,
} satisfies ComponentProps<typeof Video>;

export const portraitVideoDemo = {
	src: `${base}development/videos/portrait-9x16.mp4`,
	label: 'Video de prueba vertical: olas en el mar.',
	width: 1080,
	height: 1920,
	aspectRatio: '9/16',
} satisfies ComponentProps<typeof Video>;

export const videoSectionDemo = {
	video: landscapeVideoDemo,
} satisfies ComponentProps<typeof VideoSection>;
