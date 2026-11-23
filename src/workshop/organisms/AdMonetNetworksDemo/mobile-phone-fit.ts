import { mediaQueries } from '../../../../config/breakpoints';
import { isIPhoneSafari } from '../../lib/iphone-safari';

const mobile = window.matchMedia(mediaQueries.osm);
const iphoneSafari = isIPhoneSafari(navigator.userAgent);

for (const demo of document.querySelectorAll<HTMLElement>('.networks-scroll')) {
	demo.toggleAttribute('data-iphone-safari', iphoneSafari);
	const stage = demo.querySelector<HTMLElement>('.networks-scroll__stage');
	const phone = demo.querySelector<HTMLElement>('.networks-scroll__phone');
	const intros = Array.from(demo.querySelectorAll<HTMLElement>('[data-format-intro]'));
	const contents = Array.from(demo.querySelectorAll<HTMLElement>('[data-format-content]'));
	const inner = intros[0]?.parentElement;
	const panel = inner?.closest<HTMLElement>('[data-format-panel]');
	const visual = inner?.querySelector<HTMLElement>('[data-format-visual]');
	if (!stage || !phone || !inner || !panel || !visual || !intros.length || intros.length !== contents.length) continue;

	const update = () => {
		const layout = getComputedStyle(inner);
		const gap = Number.parseFloat(layout.rowGap);
		if (getComputedStyle(phone).display === 'none') {
			const style = getComputedStyle(panel);
			const available = Number.parseFloat(style.minHeight) - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom) - 2 * gap;
			const textHeight = Math.max(...intros.map((intro, index) => intro.offsetHeight + contents[index].offsetHeight));
			demo.style.setProperty('--networks-scroll-measured-phone-height', `${Math.max(0, available - textHeight)}px`);
			demo.style.removeProperty('--networks-scroll-measured-phone-center');
			return;
		}
		const stageTop = stage.getBoundingClientRect().top;
		const row = layout.gridTemplateRows.startsWith('subgrid') ? visual.getBoundingClientRect() : undefined;
		const top = (row?.top ?? Math.max(...intros.map((intro) => intro.getBoundingClientRect().bottom)) + gap) - stageTop;
		const bottom = (row?.bottom ?? Math.min(...contents.map((content) => content.getBoundingClientRect().top)) - gap) - stageTop;

		// Use the one interval that is free in every format.
		const height = bottom - top;
		if (height > 0 && Number.isFinite(height)) {
			demo.style.setProperty('--networks-scroll-measured-phone-height', `${height}px`);
			demo.style.setProperty('--networks-scroll-measured-phone-center', `${(top + bottom) / 2}px`);
		} else {
			clearMeasurement();
		}
	};

	const clearMeasurement = () => {
		demo.style.removeProperty('--networks-scroll-measured-phone-height');
		demo.style.removeProperty('--networks-scroll-measured-phone-center');
	};

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const observer = new ResizeObserver(update);
	const sync = () => {
		observer.disconnect();
		if (mobile.matches) {
			for (const element of [stage, panel, inner, visual, ...intros, ...contents]) observer.observe(element);
			update();
		} else {
			clearMeasurement();
		}
	};

	mobile.addEventListener('change', sync);
	reducedMotion.addEventListener('change', sync);
	sync();
}
