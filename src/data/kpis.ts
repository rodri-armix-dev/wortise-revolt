import { readContent } from './content/validate';
import rawES from '../content/global/statistics/es.json';

import type { ComponentProps } from 'astro/types';
import type Kpis from '../components/organisms/Kpis/Kpis.astro';

const contentES = readContent(rawES, 'global/statistics/es');

export const kpiItems = [
	{ id: 'users', value: contentES.statistics.users.value, label: contentES.statistics.users.label },
	{ id: 'applications', value: contentES.statistics.applications.value, label: contentES.statistics.applications.label },
	{ id: 'campaigns', value: contentES.statistics.campaigns.value, label: contentES.statistics.campaigns.label },
	{ id: 'countries', value: contentES.statistics.countries.value, label: contentES.statistics.countries.label },
] satisfies ComponentProps<typeof Kpis>['items'];
