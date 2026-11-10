import { readLegalDocument } from '../../content/documents';
import rawES from '../../../content/legal/sdk-terms/es.md?raw';
import rawEN from '../../../content/legal/sdk-terms/en.md?raw';
import rawPT from '../../../content/legal/sdk-terms/pt.md?raw';

export const sdkTermsPageData = {
	es: readLegalDocument(rawES, 'sdk-terms', 'es'),
	en: readLegalDocument(rawEN, 'sdk-terms', 'en'),
	pt: readLegalDocument(rawPT, 'sdk-terms', 'pt'),
};
