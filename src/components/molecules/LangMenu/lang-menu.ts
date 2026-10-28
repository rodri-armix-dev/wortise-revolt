const controllers = new WeakMap<HTMLElement, (expanded: boolean) => void>();

function initializeLangMenus() {
	for (const menu of document.querySelectorAll<HTMLElement>('[data-lang-menu]')) {
		if (controllers.has(menu)) continue;
		const toggle = menu.querySelector<HTMLButtonElement>('.lang-menu__toggle');
		const list = menu.querySelector<HTMLUListElement>('.lang-menu__list');
		if (!toggle || !list) continue;

		const setExpanded = (isExpanded: boolean) => {
			toggle.setAttribute('aria-expanded', String(isExpanded));
			toggle.setAttribute('aria-label', (isExpanded ? toggle.dataset.closeLabel : toggle.dataset.openLabel) ?? '');
			list.hidden = !isExpanded;
			if (isExpanded) menu.dispatchEvent(new CustomEvent('wortise:navigation-open', { bubbles: true }));
		};

		controllers.set(menu, setExpanded);
		menu.addEventListener('wortise:navigation-close', () => setExpanded(false));
		toggle.addEventListener('click', () => {
			setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
		});
		
		menu.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !list.hidden) {
				setExpanded(false);
				toggle.focus();
			}
		});
		
		menu.addEventListener('focusout', (event) => {
			if (!(event.relatedTarget instanceof Node) || !menu.contains(event.relatedTarget)) {
				setExpanded(false);
			}
		});
	}
}

document.addEventListener('click', (event) => {
	if (!(event.target instanceof Node)) return;
	for (const menu of document.querySelectorAll<HTMLElement>('[data-lang-menu]')) {
		if (menu.contains(event.target)) continue;
		controllers.get(menu)?.(false);
	}
});

initializeLangMenus();
document.addEventListener('astro:page-load', initializeLangMenus);

