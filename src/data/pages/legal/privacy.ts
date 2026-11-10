import { readLegalDocument } from '../../content/documents';
import rawES from '../../../content/legal/privacy/es.md?raw';
import rawEN from '../../../content/legal/privacy/en.md?raw';
import rawPT from '../../../content/legal/privacy/pt.md?raw';

export const privacyPageData = {
	es: readLegalDocument(rawES, 'privacy', 'es'),
	en: readLegalDocument(rawEN, 'privacy', 'en'),
	pt: readLegalDocument(rawPT, 'privacy', 'pt'),
};
