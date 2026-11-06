import { mediaQueries } from '../../../../config/breakpoints';

const controllers = new WeakMap<HTMLElement, (expanded: boolean) => void>();
const desktop = window.matchMedia(mediaQueries.xl);

function initializeMobileMenus() {
	for (const menu of document.querySelectorAll<HTMLElement>('[data-mobile-menu]')) {
		if (controllers.has(menu)) continue;
		const toggle = menu.querySelector<HTMLButtonElement>('.mobile-menu__toggle');
		const panel = menu.querySelector<HTMLElement>('.mobile-menu__panel');
		if (!toggle || !panel) continue;

		const closeSubmenus: (() => void)[] = [];
		for (const submenuToggle of panel.querySelectorAll<HTMLButtonElement>('[data-submenu-toggle]')) {
			const item = submenuToggle.closest('li');
			const sublist = item?.querySelector<HTMLElement>('.mobile-menu__sublist');
			if (!item || !sublist) continue;
			const setSubmenuExpanded = (expanded: boolean) => {
				submenuToggle.setAttribute('aria-expanded', String(expanded));
				submenuToggle.setAttribute('aria-label', (expanded ? submenuToggle.dataset.closeLabel : submenuToggle.dataset.openLabel) ?? '');
				sublist.hidden = !expanded;
			};
			closeSubmenus.push(() => setSubmenuExpanded(false));
			submenuToggle.addEventListener('click', () => setSubmenuExpanded(sublist.hidden));
			item.addEventListener('keydown', (event) => {
				if (event.key === 'Escape' && !sublist.hidden) {
					event.stopPropagation();
					setSubmenuExpanded(false);
					submenuToggle.focus();
				}
			});
		}

		const setExpanded = (expanded: boolean) => {
			toggle.setAttribute('aria-expanded', String(expanded));
			toggle.setAttribute('aria-label', (expanded ? toggle.dataset.closeLabel : toggle.dataset.openLabel) ?? '');
			panel.hidden = !expanded;
			if (!expanded) closeSubmenus.forEach((close) => close());
			if (expanded) menu.dispatchEvent(new CustomEvent('wortise:navigation-open', { bubbles: true }));
		};
		controllers.set(menu, setExpanded);
		menu.addEventListener('wortise:navigation-close', () => setExpanded(false));
		toggle.addEventListener('click', () => setExpanded(panel.hidden));
		menu.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !panel.hidden) {
				setExpanded(false);
				toggle.focus();
			}
		});
		menu.addEventListener('focusout', (event) => {
			if (!(event.relatedTarget instanceof Node) || !menu.contains(event.relatedTarget)) setExpanded(false);
		});
		panel.addEventListener('click', (event) => {
			if (event.target instanceof Element && event.target.closest('a')) setExpanded(false);
		});
		if (desktop.matches) setExpanded(false);
	}
}

document.addEventListener('click', (event) => {
	if (!(event.target instanceof Node)) return;
	for (const menu of document.querySelectorAll<HTMLElement>('[data-mobile-menu]')) {
		if (!menu.contains(event.target)) controllers.get(menu)?.(false);
	}
});

desktop.addEventListener('change', () => {
	if (!desktop.matches) return;
	for (const menu of document.querySelectorAll<HTMLElement>('[data-mobile-menu]')) controllers.get(menu)?.(false);
});

initializeMobileMenus();
document.addEventListener('astro:page-load', initializeMobileMenus);
