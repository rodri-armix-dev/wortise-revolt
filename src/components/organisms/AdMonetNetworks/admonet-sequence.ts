import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mediaQueries } from '../../../../config/breakpoints';

gsap.registerPlugin(ScrollTrigger);

const convergeEnd = .42;
const formatLighting = [
	{ ambient: 'rgba(210, 14, 78, .35)', halo: 'rgba(210, 14, 66, .65)' },
	{ ambient: '#0d2839', halo: 'rgba(14, 203, 210, .58)', fill: { edge: '#120a0d', angle: 90, start: 6.528, center: 50.317, end: 92.083 } },
	{ ambient: '#5f0322', halo: '#d10e4e', fill: { edge: '#26030e', angle: 85.359, start: 24.606, center: 53.848, end: 82.916 } },
	{ ambient: 'rgba(97, 93, 134, .35)', halo: 'rgba(210, 14, 56, .84)' },
];

function lightingFor(index: number) {
	const { ambient, halo, fill } = formatLighting[index] ?? formatLighting.at(-1)!;
	return {
		'--admonet-glow-color': ambient,
		'--admonet-glow-width': '511px',
		'--admonet-glow-height': '511px',
		'--admonet-glow-offset': '-56.5px',
		'--admonet-glow-fill': fill ? '100%' : '0%',
		'--admonet-glow-fill-edge': fill?.edge ?? '#120a0d',
		'--admonet-glow-fill-angle': `${fill?.angle ?? 90}deg`,
		'--admonet-glow-fill-start': `${fill?.start ?? 6.528}%`,
		'--admonet-glow-fill-center': `${fill?.center ?? 50.317}%`,
		'--admonet-glow-fill-end': `${fill?.end ?? 92.083}%`,
		'--admonet-halo-color': halo,
	};
}

function mount(root: HTMLElement) {
	const track = root.querySelector<HTMLElement>('[data-networks-track]');
	const stage = root.querySelector<HTMLElement>('[data-networks-stage]');
	const measure = root.querySelector<HTMLElement>('[data-networks-measure]');
	const overview = root.querySelector<HTMLElement>('[data-networks-overview]');
	const overviewIntro = root.querySelector<HTMLElement>('[data-networks-intro]');
	const orbit = root.querySelector<HTMLElement>('[data-networks-orbit-scene]');
	const particles = orbit?.querySelector<HTMLElement>('orbit-particles');
	const glow = root.querySelector<HTMLElement>('[data-networks-glow]');
	const phone = root.querySelector<HTMLElement>('[data-networks-phone]');
	const panels = [...root.querySelectorAll<HTMLElement>('[data-networks-panel]')];
	const screens = [...root.querySelectorAll<HTMLElement>('[data-networks-screen]')];
	const intros = [...root.querySelectorAll<HTMLElement>('[data-format-intro] > *')];
	const contents = [...root.querySelectorAll<HTMLElement>('[data-format-content] > *')];
	const firstPanel = panels[0]?.firstElementChild as HTMLElement | undefined;
	if (!track || !stage || !measure || !overview || !overviewIntro || !orbit || !particles || !glow || !phone || !firstPanel || screens.length !== panels.length) return;

	const stacked = matchMedia(mediaQueries.osm);
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	const events = new AbortController();
	const { signal } = events;
	let context: gsap.Context | undefined;
	let transition: gsap.core.Tween | undefined;
	let trigger: ScrollTrigger | undefined;
	let frame = 0;
	let geometry = '';
	let rebuilding = false;

	const syncParticles = (progress?: number) => {
		if (progress === undefined) delete particles.dataset.orbitSequenceProgress;
		else particles.dataset.orbitSequenceProgress = String(progress);
		particles.dispatchEvent(new Event('orbit-sequence'));
	};

	const setPanel = (index: number) => {
		panels.forEach((panel, position) => {
			panel.inert = index >= 0 && position + 1 !== index;
			if (panel.inert) panel.setAttribute('aria-hidden', 'true');
			else panel.removeAttribute('aria-hidden');
		});
		phone.setAttribute('aria-hidden', String(index <= 0));
		screens.forEach((screen, position) => screen.setAttribute('aria-hidden', String(position + 1 !== index)));
		if (index < 0) delete root.dataset.networksActive;
		else root.dataset.networksActive = String(index);
	};

	const reset = () => {
		transition?.kill();
		transition = undefined;
		context?.revert();
		context = undefined;
		trigger = undefined;
		delete root.dataset.networksPlayback;
		setPanel(-1);
		overview.inert = false;
		syncParticles();
	};

	const signature = () => [
		track.clientWidth, measure.clientHeight, overviewIntro.offsetHeight, stacked.matches, reduced.matches,
		...intros.map((element) => element.offsetHeight),
		...contents.map((element) => element.offsetHeight),
	].join(':');

	const rebuild = () => {
		const previous = trigger?.isActive ? trigger.progress : undefined;
		rebuilding = true;
		reset();
		if (reduced.matches) {
			geometry = signature();
			rebuilding = false;
			return;
		}

		const mobile = stacked.matches;
		const height = measure.clientHeight;
		const introHeight = Math.max(...intros.map((element) => element.offsetHeight));
		const contentHeight = Math.max(...contents.map((element) => element.offsetHeight));
		const textHeight = Math.max(introHeight, contentHeight);
		const gap = parseFloat(getComputedStyle(firstPanel.firstElementChild!).rowGap);
		const overviewGap = parseFloat(getComputedStyle(overview).rowGap);
		const compactPadding = parseFloat(getComputedStyle(root).getPropertyValue('--admonet-compact-panel-padding'));
		const overviewOrbitHeight = height - overviewIntro.offsetHeight - overviewGap - compactPadding * 2;
		const padding = mobile
			? compactPadding
			: parseFloat(getComputedStyle(firstPanel).paddingBlockStart);
		const available = height - (padding + textHeight + gap) * 2;
		if ((mobile ? available < 120 : textHeight > height - padding * 2) || overviewOrbitHeight < 240) {
			geometry = signature();
			rebuilding = false;
			return;
		}

		const distancePerStage = height * 1.2;
		const distance = distancePerStage * (panels.length + 1);
		let requested = -1;
		let selected = -1;
		let lastProgress = -1;

		context = gsap.context(() => {
			root.dataset.networksPlayback = mobile ? 'sticky' : 'pin';
			gsap.set(root, { '--admonet-orbit-available-height': `${overviewOrbitHeight}px` });
			if (mobile) {
				gsap.set(root, {
					'--admonet-track-distance': `${distance}px`,
					'--ad-formats-text-height': `${textHeight}px`,
					'--ad-formats-phone-width': `${Math.min(available * 410 / 788, 320)}px`,
				});
			}

			gsap.set([phone, ...panels], { autoAlpha: 0 });
			gsap.set(screens.slice(1), { yPercent: 100 });
			gsap.set(stage, { '--ad-formats-phone-y': '105%' });
			const orbitCenter = orbit.offsetTop + orbit.offsetHeight / 2;
			gsap.set(glow, {
				...lightingFor(0),
				'--admonet-glow-color': 'rgba(209, 14, 78, .26)',
				'--admonet-glow-width': '447px',
				'--admonet-glow-height': '483px',
				'--admonet-glow-offset': `${orbitCenter - overview.clientHeight / 2}px`,
				'--admonet-halo-opacity': 0,
			});

			const timeline = gsap.timeline({ paused: true });
			const render = () => {
				const time = timeline.time();
				const progress = Math.min(1, time / convergeEnd);
				if (progress !== lastProgress) {
					lastProgress = progress;
					syncParticles(progress);
				}
				const index = Math.round(time);
				if (index === selected) return;
				selected = index;
				overview.inert = index !== 0;
				setPanel(index);
			};
			timeline.eventCallback('onUpdate', render);

			// Figma closes the outer paths first, then introduces the device and its copy.
			const rings = ['outer', 'middle', 'inner', 'core'];
			rings.forEach((ring, index) => {
				const property = `--admonet-orbit-${ring}`;
				timeline.fromTo(orbit, { [property]: 1 }, { [property]: .13, duration: .18, ease: 'power2.inOut' }, .09 + index * .025);
			});
			timeline.to([overviewIntro, orbit], { autoAlpha: 0, duration: .16 }, .42)
				.addLabel('phone-visible', '>')
				.to(stage, { '--ad-formats-phone-y': '0%', duration: .45, ease: 'sine.inOut' }, .48)
				.to(glow, { ...lightingFor(0), duration: .45, ease: 'sine.inOut' }, .48)
				.to(phone, { autoAlpha: 1, duration: .16, ease: 'sine.inOut' }, 'phone-visible')
				.to(glow, { '--admonet-halo-opacity': 1, duration: .16, ease: 'sine.inOut' }, 'phone-visible')
				.fromTo(panels[0], { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: .34, ease: 'sine.inOut' }, .50);

			panels.slice(1).forEach((panel, index) => {
				const start = index + 1;
				timeline.to(screens[index], { yPercent: -100, duration: .76, ease: 'sine.inOut' }, start + .14)
					.to(screens[index + 1], { yPercent: 0, duration: .76, ease: 'sine.inOut' }, start + .14)
					.to(panels[index], { autoAlpha: 0, y: -48, duration: .34 }, start + .08)
					.fromTo(panel, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: .40, ease: 'sine.inOut' }, start + .58)
					.to(glow, { ...lightingFor(index + 1), duration: .66 }, start + .2)
					.to({}, { duration: .02 }, start + .98);
			});

			const update = (self: ScrollTrigger, immediate = false) => {
				if (rebuilding && !immediate) return;
				const index = Math.min(panels.length, Math.floor(self.progress * (panels.length + 1)));
				if (index === requested && !immediate) return;
				requested = index;
				transition?.kill();
				if (immediate || !self.isActive) {
					timeline.time(index);
					render();
					return;
				}
				// A reversal continues from the current frame, including the screen inside the device.
				transition = timeline.tweenTo(index, {
					duration: gsap.utils.clamp(.18, 1.8, Math.abs(index - timeline.time()) * 1.15),
					ease: 'none',
				});
			};

			trigger = ScrollTrigger.create({
				trigger: track,
				start: 'top top',
				end: `+=${distance}`,
				pin: mobile ? false : stage,
				pinSpacing: !mobile,
				onUpdate: (self) => update(self),
				onToggle: (self) => update(self),
			});
			rebuilding = false;
			if (previous !== undefined) {
				window.scrollTo({ top: trigger.start + previous * distance, behavior: 'instant' });
				ScrollTrigger.update();
			}
			update(trigger, true);
		}, root);
		geometry = signature();
	};

	const schedule = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			if (geometry !== signature()) rebuild();
		});
	};
	const observer = new ResizeObserver(schedule);
	[track, measure, overviewIntro, ...intros, ...contents].forEach((element) => observer.observe(element));
	[stacked, reduced].forEach((media) => media.addEventListener('change', schedule, { signal }));

	const followAnchor = () => {
		const index = panels.findIndex((panel) => `#${panel.firstElementChild?.id}` === location.hash);
		if (!trigger || index < 0) return;
		const progress = (index + 1.25) / (panels.length + 1);
		window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: 'instant' });
		ScrollTrigger.update();
	};
	window.addEventListener('hashchange', followAnchor, { signal });
	rebuild();
	followAnchor();
	return () => {
		events.abort();
		observer.disconnect();
		cancelAnimationFrame(frame);
		reset();
	};
}

const cleanups: (() => void)[] = [];
let disposed = false;
void document.fonts.ready.then(() => {
	if (disposed) return;
	document.querySelectorAll<HTMLElement>('.admonet-networks').forEach((root) => {
		const cleanup = mount(root);
		if (cleanup) cleanups.push(cleanup);
	});
});

if (import.meta.hot) import.meta.hot.dispose(() => {
	disposed = true;
	cleanups.forEach((cleanup) => cleanup());
});
