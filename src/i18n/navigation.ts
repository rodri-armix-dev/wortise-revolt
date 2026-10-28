import { langMenuData, type LanguageItem } from '../data/navigation';
import { getPageFromPath, getPagePath } from './routes';

export { getLocaleFromPath } from './routes';

export function getLanguageItems(pathname: string, basePath = import.meta.env.BASE_URL): LanguageItem[] {
	const currentPage = getPageFromPath(pathname, basePath);

	return langMenuData.map((item) => {
		const href = currentPage ? getPagePath(item.code, currentPage, basePath) : undefined;
		return { ...item, href: href ?? '', available: href !== undefined };
	});
}
