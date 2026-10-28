import { mediaQueries } from '../../../../config/breakpoints';

const controllers = new WeakMap<HTMLElement, (expanded: boolean) => void>();

function initializeMainMenus() {
	for (const item of document.querySelectorAll<HTMLElement>('[data-main-menu] .main-menu__item')) {
		if (controllers.has(item)) continue;
		const toggle = item.querySelector<HTMLButtonElement>('.main-menu__toggle');
		const submenu = item.querySelector<HTMLElement>('.main-menu__submenu');
		if (!toggle || !submenu) continue;

		const setExpanded = (expanded: boolean) => {
			toggle.setAttribute('aria-expanded', String(expanded));
			toggle.setAttribute('aria-label', (expanded ? toggle.dataset.closeLabel : toggle.dataset.openLabel) ?? '');
			submenu.hidden = !expanded;
			item.classList.toggle('main-menu__item--expanded', expanded);
			if (expanded) item.dispatchEvent(new CustomEvent('wortise:navigation-open', { bubbles: true }));
		};
		controllers.set(item, setExpanded);
		item.addEventListener('wortise:navigation-close', () => setExpanded(false));
		toggle.addEventListener('click', () => setExpanded(submenu.hidden));
		item.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !submenu.hidden) {
				setExpanded(false);
				toggle.focus();
			}
		});
		item.addEventListener('focusout', (event) => {
			if (!(event.relatedTarget instanceof Node) || !item.contains(event.relatedTarget)) setExpanded(false);
		});
		submenu.addEventListener('click', (event) => {
			if (event.target instanceof Element && event.target.closest('a')) setExpanded(false);
		});
	}
}

function closeMainMenus(except?: Node) {
	for (const item of document.querySelectorAll<HTMLElement>('[data-main-menu] .main-menu__item')) {
		if (!except || !item.contains(except)) controllers.get(item)?.(false);
	}
}

document.addEventListener('click', (event) => {
	if (event.target instanceof Node) closeMainMenus(event.target);
});
window.matchMedia(mediaQueries.xl).addEventListener('change', () => closeMainMenus());
initializeMainMenus();
document.addEventListener('astro:page-load', initializeMainMenus);
