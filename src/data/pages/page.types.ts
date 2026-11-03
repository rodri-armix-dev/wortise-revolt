import type { ComponentProps } from 'astro/types';
import type FooterCTA from '../../components/organisms/FooterCTA/FooterCTA.astro';
import ModulesPage from '../../components/templates/ModulesPage/ModulesPage.astro';
import type LegalPage from '../../components/templates/LegalPage/LegalPage.astro';
import type { BlogPost } from '../blog/types';

interface BasePageData<Key extends string = string> {
	key: Key;
	slug: string;
	meta: {
		title: string;
		description?: string;
	};
}

export interface ModulesPageData<Key extends string = string> extends BasePageData<Key> {
	template?: 'modules';
	footerCTA?: ComponentProps<typeof FooterCTA>;
	modules: ComponentProps<typeof ModulesPage>['modules'];
}

export interface LegalPageData<Key extends string = string> extends BasePageData<Key> {
	template: 'legal';
	content: Omit<ComponentProps<typeof LegalPage>, 'locale'>;
}

export interface BlogIndexPageData<Key extends string = string> extends BasePageData<Key> {
	template: 'blog';
}

export interface BlogArticlePageData<Key extends string = string> extends BasePageData<Key> {
	template: 'blog-article';
	content: BlogPost;
	footerCTA?: ComponentProps<typeof FooterCTA>;
}

export type EditorialPageData = ModulesPageData | LegalPageData | BlogIndexPageData | BlogArticlePageData;
