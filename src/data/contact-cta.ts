import rawES from '../content/global/calls-to-action/es.json';
import rawEN from '../content/global/calls-to-action/en.json';
import { readContent } from './content/validate';

export const contactCTA = {
	es: readContent(rawES, 'global/calls-to-action/es').contact,
	en: readContent(rawEN, 'global/calls-to-action/en').contact,
};
