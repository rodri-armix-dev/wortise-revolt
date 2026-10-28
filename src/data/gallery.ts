import type { ComponentProps } from 'astro/types';
import type ImageCarousel from '../components/molecules/ImageCarousel/ImageCarousel.astro';
import homeImage1 from '../assets/gallery/home-1.jpg';
import homeImage2 from '../assets/gallery/home-2.jpg';
import homeImage3 from '../assets/gallery/home-3.jpg';
import homeImage4 from '../assets/gallery/home-4.jpg';
import homeImage5 from '../assets/gallery/home-5.jpg';
import homeImage6 from '../assets/gallery/home-6.jpg';
import homeImage7 from '../assets/gallery/home-7.jpg';
import homeImage8 from '../assets/gallery/home-8.jpg';
import homeImage9 from '../assets/gallery/home-9.jpg';
import aboutImage1 from '../assets/gallery/about-1.jpg';
import aboutImage2 from '../assets/gallery/about-2.jpg';
import aboutImage3 from '../assets/gallery/about-3.jpg';
import aboutImage4 from '../assets/gallery/about-4.jpg';
import aboutImage5 from '../assets/gallery/about-5.jpg';
import aboutImage6 from '../assets/gallery/about-6.jpg';

export const homeGalleryItems = [
	{
		id: 'conversation',
		image: { src: homeImage1, alt: 'Dos integrantes del equipo conversando en la oficina.' },
	},
	{
		id: 'lounge',
		image: { src: homeImage2, alt: 'Espacio de descanso de Wortise junto a los ventanales.' },
	},
	{
		id: 'planning',
		image: { src: homeImage3, alt: 'Una integrante del equipo junto a una pared de planificación.' },
	},
	{
		id: 'table-football',
		image: { src: homeImage4, alt: 'Integrantes del equipo jugando al metegol.' },
	},
	{
		id: 'collaboration',
		image: { src: homeImage5, alt: 'El equipo colaborando en la oficina.' },
	},
	{
		id: 'workspace',
		image: { src: homeImage6, alt: 'Integrantes del equipo trabajando junto a los ventanales.' },
	},
	{
		id: 'laptop',
		image: { src: homeImage7, alt: 'Dos integrantes del equipo trabajando con una computadora.' },
	},
	{
		id: 'desk',
		image: { src: homeImage8, alt: 'Dos integrantes del equipo colaborando en un escritorio.' },
	},
	{
		id: 'meeting',
		image: { src: homeImage9, alt: 'Una conversación de trabajo entre integrantes del equipo.' },
	},
] satisfies ComponentProps<typeof ImageCarousel>['items'];

export const aboutGalleryItems = [
	{
		id: 'desk',
		image: { src: aboutImage1, alt: 'Dos integrantes del equipo colaborando en un escritorio.' },
	},
	{
		id: 'lounge',
		image: { src: aboutImage2, alt: 'Espacio de descanso de Wortise con el letrero de la marca.' },
	},
	{
		id: 'conversation',
		image: { src: aboutImage3, alt: 'Dos integrantes del equipo conversando en la oficina.' },
	},
	{
		id: 'table-football',
		image: { src: aboutImage4, alt: 'Integrantes del equipo jugando al metegol.' },
	},
	{
		id: 'workspace',
		image: { src: aboutImage5, alt: 'Vista del equipo trabajando en la oficina.' },
	},
	{
		id: 'laptop',
		image: { src: aboutImage6, alt: 'Dos integrantes del equipo trabajando con una computadora.' },
	},
] satisfies ComponentProps<typeof ImageCarousel>['items'];
