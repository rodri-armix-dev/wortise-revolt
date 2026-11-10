import { readContent } from './content/validate';
import homeRaw from '../content/pages/home/es.json';
import aboutRaw from '../content/pages/about/es.json';

import type { ComponentProps } from 'astro/types';
import type ImageCarousel from '../components/molecules/ImageCarousel/ImageCarousel.astro';
import homeImage1 from '../assets/pages/home/team-conversation.jpg';
import homeImage2 from '../assets/pages/home/team-lounge.jpg';
import homeImage3 from '../assets/pages/home/team-planning.jpg';
import homeImage4 from '../assets/pages/home/team-table-football.jpg';
import homeImage5 from '../assets/pages/home/team-collaboration.jpg';
import homeImage6 from '../assets/pages/home/team-workspace.jpg';
import homeImage7 from '../assets/pages/home/team-laptop.jpg';
import homeImage8 from '../assets/pages/home/team-desk.jpg';
import homeImage9 from '../assets/pages/home/team-meeting.jpg';
import aboutImage1 from '../assets/pages/about/team-desk.jpg';
import aboutImage2 from '../assets/pages/about/team-lounge.jpg';
import aboutImage3 from '../assets/pages/about/team-conversation.jpg';
import aboutImage4 from '../assets/pages/about/team-table-football.jpg';
import aboutImage5 from '../assets/pages/about/team-workspace.jpg';
import aboutImage6 from '../assets/pages/about/team-laptop.jpg';

const homeContent = readContent(homeRaw, 'pages/home/es');
const aboutContent = readContent(aboutRaw, 'pages/about/es');

export const homeGalleryItems = [
	{
		id: 'conversation',
		image: { src: homeImage1, alt: homeContent.gallery.conversation.imageAlt },
	},
	{
		id: 'lounge',
		image: { src: homeImage2, alt: homeContent.gallery.lounge.imageAlt },
	},
	{
		id: 'planning',
		image: { src: homeImage3, alt: homeContent.gallery.planning.imageAlt },
	},
	{
		id: 'table-football',
		image: { src: homeImage4, alt: homeContent.gallery['table-football'].imageAlt },
	},
	{
		id: 'collaboration',
		image: { src: homeImage5, alt: homeContent.gallery.collaboration.imageAlt },
	},
	{
		id: 'workspace',
		image: { src: homeImage6, alt: homeContent.gallery.workspace.imageAlt },
	},
	{
		id: 'laptop',
		image: { src: homeImage7, alt: homeContent.gallery.laptop.imageAlt },
	},
	{
		id: 'desk',
		image: { src: homeImage8, alt: homeContent.gallery.desk.imageAlt },
	},
	{
		id: 'meeting',
		image: { src: homeImage9, alt: homeContent.gallery.meeting.imageAlt },
	},
] satisfies ComponentProps<typeof ImageCarousel>['items'];

export const aboutGalleryItems = [
	{
		id: 'desk',
		image: { src: aboutImage1, alt: aboutContent.gallery.desk.imageAlt },
	},
	{
		id: 'lounge',
		image: { src: aboutImage2, alt: aboutContent.gallery.lounge.imageAlt },
	},
	{
		id: 'conversation',
		image: { src: aboutImage3, alt: aboutContent.gallery.conversation.imageAlt },
	},
	{
		id: 'table-football',
		image: { src: aboutImage4, alt: aboutContent.gallery['table-football'].imageAlt },
	},
	{
		id: 'workspace',
		image: { src: aboutImage5, alt: aboutContent.gallery.workspace.imageAlt },
	},
	{
		id: 'laptop',
		image: { src: aboutImage6, alt: aboutContent.gallery.laptop.imageAlt },
	},
] satisfies ComponentProps<typeof ImageCarousel>['items'];
