import { readLegalDocument } from '../../content/documents';
import rawES from '../../../content/legal/terms/es.md?raw';
import rawEN from '../../../content/legal/terms/en.md?raw';
import rawPT from '../../../content/legal/terms/pt.md?raw';

export const termsPageData = {
	es: readLegalDocument(rawES, 'terms', 'es'),
	en: readLegalDocument(rawEN, 'terms', 'en'),
	pt: readLegalDocument(rawPT, 'terms', 'pt'),
};
