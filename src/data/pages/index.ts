import { contactPageData } from './contact';
import { homeData } from '../home';
import { aboutPageData } from './about';
import { developersPageData } from './developers';
import { wortiseAdsPageData } from './wortise-ads';
import type { Locale } from '../../i18n/config';
import type { EditorialPageData } from './page.types';
import { termsPageData } from './legal/terms';
import { privacyPageData } from './legal/privacy';
import { sdkTermsPageData } from './legal/sdk-terms';
import { blogPageData, blogArticlePages } from '../blog';

// Register each page once. A missing locale means its translation is unpublished.
export const pageData = {
	home: homeData,
	about: aboutPageData,
	developers: developersPageData,
	'wortise-ads': wortiseAdsPageData,
	contact: contactPageData,
	terms: termsPageData,
	privacy: privacyPageData,
	'sdk-terms': sdkTermsPageData,
	blog: blogPageData,
	...blogArticlePages,
} satisfies Record<string, Partial<Record<Locale, EditorialPageData>>>;

export type Page = keyof typeof pageData;
export type LocalizedPages = Partial<Record<Locale, EditorialPageData>>;
