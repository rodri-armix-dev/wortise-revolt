import gsap from 'gsap';

const visibilityThreshold = 0.5;
const groupStagger = 0.18;
const entranceStart = 0.06;

export function observeKpis() {
	if (!('IntersectionObserver' in window)) return;

	const media = gsap.matchMedia();
	media.add('(prefers-reduced-motion: no-preference)', (context) => {
		const cleanups: (() => void)[] = [];

		for (const metrics of document.querySelectorAll('.kpis__metrics')) {
			const line = metrics.querySelector('.kpis__line');
			const items = Array.from(metrics.querySelectorAll('.kpis__item'));
			const timelines = items.map((item, index) => {
				const value = item.querySelector('.kpis__value');
				const template = value?.querySelector<HTMLTemplateElement>('template[data-kpi-odometer]');
				const digitWindow = template?.content.firstElementChild;
				const content = item.querySelectorAll('.kpis__value, .kpis__label');
				const overlays: Element[] = [];

				const restoreValue = () => {
					for (const overlay of overlays) overlay.remove();
					value?.removeAttribute('data-kpi-rolling');
				};

				const timeline = gsap.timeline({ paused: true, onComplete: restoreValue });
				if (line && index < 4) {
					const reveal = `--kpis-reveal-${index + 1}`;
					timeline.fromTo(line, { [reveal]: '-30%' }, { [reveal]: '100%', duration: 0.85, ease: 'power2.out' }, 0);
				}

				if (value && digitWindow) {
					value.setAttribute('data-kpi-rolling', '');
					value.querySelectorAll<HTMLElement>('[data-kpi-digit]').forEach((digit, digitIndex) => {
						const overlay = digitWindow.cloneNode(true) as Element;
						const reel = overlay.firstElementChild!;
						const turns = 1 + digitIndex % 3;
						const steps = turns * 10 + Number(digit.dataset.kpiDigit);

						digit.append(overlay);
						overlays.push(overlay);
						timeline.to(reel, {
							'--kpis-reel-offset': -steps,
							duration: 1 + digitIndex * 0.09,
							ease: 'power3.out',
						}, entranceStart);
					});
				}

				gsap.set(content, { opacity: 0, y: 8 });
				timeline.to(content, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'opacity,transform' }, entranceStart);

				cleanups.push(restoreValue);
				return timeline;
			});

			const observer = new IntersectionObserver((entries) => {
				const visible = new Set(entries.filter(({ intersectionRatio }) => intersectionRatio >= visibilityThreshold).map(({ target }) => target));
				context.add(() => {
					const batch = gsap.timeline();
					let delay = 0;

					items.forEach((item, index) => {
						if (!visible.has(item)) return;
						observer.unobserve(item);
						batch.call(() => { timelines[index].play(); }, [], delay);
						delay += groupStagger;
					});
				});
			}, { threshold: visibilityThreshold });

			items.forEach((item) => observer.observe(item));
			cleanups.push(() => observer.disconnect());
		}

		return () => cleanups.forEach((cleanup) => cleanup());
	});

	if (import.meta.hot) import.meta.hot.dispose(() => media.revert());
}
