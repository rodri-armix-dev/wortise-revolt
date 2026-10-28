const cleanups: (() => void)[] = [];

for (const marquee of document.querySelectorAll<HTMLElement>('.logo-marquee')) {
	const track = marquee.querySelector<HTMLElement>('.logo-marquee__track');
	const groups = [...marquee.querySelectorAll<HTMLElement>('.logo-marquee__group')];
	const originals = [...(groups[0]?.children ?? [])] as HTMLElement[];
	if (!track || groups.length !== 2 || !originals.length) continue;

	let repetitions = 0;
	let frame = 0;

	const update = () => {
		const gap = Number.parseFloat(getComputedStyle(groups[0]).columnGap) || 0;
		const sequenceWidth = originals.reduce((width, item) => width + item.getBoundingClientRect().width + gap, 0);
		if (!sequenceWidth) return;

		const required = Math.max(1, Math.ceil(marquee.clientWidth / sequenceWidth));
		if (required !== repetitions) {
			for (const group of groups) {
				group.querySelectorAll('.logo-marquee__item--extra').forEach((item) => item.remove());
				for (let copy = 1; copy < required; copy++) {
					for (const original of originals) {
						const item = original.cloneNode(true) as HTMLElement;
						item.classList.add('logo-marquee__item--extra');
						item.setAttribute('aria-hidden', 'true');
						item.querySelectorAll('img').forEach((image) => { image.alt = ''; });
						group.append(item);
					}
				}
			}
			repetitions = required;
		}

		// Keep a constant travel speed as the number or size of logos changes.
		track.style.animationDuration = `${sequenceWidth * required / 32}s`;
	};

	const observer = new ResizeObserver(() => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(update);
	});
	update();
	observer.observe(marquee);
	cleanups.push(() => {
		observer.disconnect();
		cancelAnimationFrame(frame);
	});
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => cleanups.forEach((cleanup) => cleanup()));
}
