import type { ComponentProps } from 'astro/types';
import type BlogMedia from '../../components/molecules/BlogMedia/BlogMedia.astro';
import type ArticleEnd from '../../components/organisms/ArticleEnd/ArticleEnd.astro';

export interface BlogPost {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	lead: string;
	author: string;
	authorImage?: ComponentProps<typeof ArticleEnd>['authorImage'];
	date: string;
	category: string;
	tags: string[];
	media: Pick<ComponentProps<typeof BlogMedia>, 'tone' | 'bordered' | 'image'>;
	featuredTone?: ComponentProps<typeof BlogMedia>['tone'];
	markdown: string;
	demo: boolean;
}
