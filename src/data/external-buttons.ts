import rawES from '../content/global/buttons/es.json';
import rawEN from '../content/global/buttons/en.json';
import rawPT from '../content/global/buttons/pt.json';
import { readContent } from './content/validate';

export const externalButtons = {
	es: readContent(rawES, 'global/buttons/es'),
	en: readContent(rawEN, 'global/buttons/en'),
	pt: readContent(rawPT, 'global/buttons/pt'),
};
