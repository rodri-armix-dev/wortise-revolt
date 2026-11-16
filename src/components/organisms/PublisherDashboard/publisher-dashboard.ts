import { mediaQueries } from '../../../../config/breakpoints';

const desktopMotion = window.matchMedia(`${mediaQueries.l} and (prefers-reduced-motion: no-preference)`);

for (const dashboard of document.querySelectorAll<HTMLElement>('[data-publisher-dashboard]')) {
	const items = [...dashboard.querySelectorAll<HTMLElement>('[data-dashboard-item]')];
	const slides = [...dashboard.querySelectorAll<HTMLElement>('[data-dashboard-slide]')];
	let frame: number | undefined;
	let activeId: string | undefined;

	function update() {
		frame = undefined;
		const center = window.innerHeight / 2;
		let closest: HTMLElement | undefined;
		let closestDistance = Infinity;

		for (const item of items) {
			const bounds = item.getBoundingClientRect();
			const distance = Math.abs((bounds.top + bounds.bottom) / 2 - center);
			if (distance < closestDistance) {
				closest = item;
				closestDistance = distance;
			}
		}

		const nextId = closest?.dataset.dashboardItem;
		if (activeId === nextId) return;

		activeId = nextId;
		for (const slide of slides) {
			slide.toggleAttribute('data-active', slide.dataset.dashboardSlide === activeId);
		}
	}

	function scheduleUpdate() {
		frame ??= window.requestAnimationFrame(update);
	}

	function syncMotion() {
		dashboard.toggleAttribute('data-dashboard-motion', desktopMotion.matches);

		if (desktopMotion.matches) {
			window.addEventListener('scroll', scheduleUpdate, { passive: true });
			window.addEventListener('resize', scheduleUpdate);
			scheduleUpdate();
			return;
		}

		window.removeEventListener('scroll', scheduleUpdate);
		window.removeEventListener('resize', scheduleUpdate);
		if (frame !== undefined) window.cancelAnimationFrame(frame);
		frame = undefined;
	}

	desktopMotion.addEventListener('change', syncMotion);
	syncMotion();
}
