import { mediaQueries } from '../../../../config/breakpoints';

const controllers = new WeakMap<HTMLElement, (expanded: boolean) => void>();
const desktop = window.matchMedia(mediaQueries.xl);

function initializeMobileMenus() {
	for (const menu of document.querySelectorAll<HTMLElement>('[data-mobile-menu]')) {
		if (controllers.has(menu)) continue;
		const toggle = menu.querySelector<HTMLButtonElement>('.mobile-menu__toggle');
		const panel = menu.querySelector<HTMLElement>('.mobile-menu__panel');
		if (!toggle || !panel) continue;

		const setExpanded = (expanded: boolean) => {
			toggle.setAttribute('aria-expanded', String(expanded));
			toggle.setAttribute('aria-label', (expanded ? toggle.dataset.closeLabel : toggle.dataset.openLabel) ?? '');
			panel.hidden = !expanded;
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
