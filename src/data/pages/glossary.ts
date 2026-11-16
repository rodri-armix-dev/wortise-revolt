import rawEN from '../../content/pages/glossary/en.json';
import rawES from '../../content/pages/glossary/es.json';
import rawPT from '../../content/pages/glossary/pt.json';
import type { Locale } from '../../i18n/config';
import { descriptionHtml, headingHtml } from '../content/format';
import { readContent } from '../content/validate';
import type { GlossaryPageData } from './page.types';

export interface GlossaryGroup {
	letter: string;
	terms: readonly { name: string; definition: string }[];
}

export interface GlossaryContent {
	intro: { eyebrow: string; heading: string; description: string; searchLabel: string };
	letterNav: { eyebrow: string; heading: string; label: string };
	dictionary: { eyebrow: string; heading: string; updatedLabel: string; groups: readonly GlossaryGroup[] };
}

function createGlossaryPage(source: typeof rawES): GlossaryPageData<'glossary'> {
	const { slug, meta, intro, letterNav, dictionary } = source;

	return {
		key: 'glossary',
		slug,
		template: 'glossary',
		meta,
		content: {
			intro: {
				...intro,
				heading: headingHtml(intro.heading),
				description: descriptionHtml(intro.description),
			},
			letterNav: {
				...letterNav,
				heading: headingHtml(letterNav.heading),
			},
			dictionary,
		},
	};
}

export const glossaryPageData = {
	es: createGlossaryPage(readContent(rawES, 'pages/glossary/es')),
	en: createGlossaryPage(readContent(rawEN, 'pages/glossary/en')),
	pt: createGlossaryPage(readContent(rawPT, 'pages/glossary/pt')),
} satisfies Record<Locale, GlossaryPageData<'glossary'>>;
