const initializedHeaders = new WeakSet<HTMLElement>();

function initializeHeaders() {
	for (const header of document.querySelectorAll<HTMLElement>('[data-header]')) {
		if (initializedHeaders.has(header)) continue;
		initializedHeaders.add(header);
		header.addEventListener('wortise:navigation-open', (event) => {
			const source = event.target;
			if (!(source instanceof HTMLElement) || source.closest('[data-header]') !== header) return;
			for (const disclosure of header.querySelectorAll<HTMLElement>('[data-navigation-disclosure]')) {
				if (disclosure !== source && disclosure.closest('[data-header]') === header) {
					disclosure.dispatchEvent(new Event('wortise:navigation-close'));
				}
			}
		});
	}
}

initializeHeaders();
document.addEventListener('astro:page-load', initializeHeaders);
