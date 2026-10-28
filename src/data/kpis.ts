import type { ComponentProps } from 'astro/types';
import type Kpis from '../components/organisms/Kpis/Kpis.astro';

export const kpiItems = [
	{ id: 'users', value: '320M', label: 'usuarios' },
	{ id: 'applications', value: '20.000', label: 'aplicaciones' },
	{ id: 'campaigns', value: '1.000', label: 'campañas' },
	{ id: 'countries', value: '10', label: 'países' },
] satisfies ComponentProps<typeof Kpis>['items'];
