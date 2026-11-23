import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mediaQueries } from '../../../../config/breakpoints';

import { particleDurations } from './particle-motion';

gsap.registerPlugin(ScrollTrigger);

const panelTimingTenths = { overview: 63, firstFormatStart: 49, format: 35, overlap: 1 };
const panelStart = (index: number) => index === 0 ? 0 : (
	panelTimingTenths.firstFormatStart
	+ (index - 1) * (panelTimingTenths.format - panelTimingTenths.overlap)
) / 10;
const panelEnd = (index: number) => index === 0 ? panelTimingTenths.overview / 10 : (
	panelTimingTenths.firstFormatStart + panelTimingTenths.format
	+ (index - 1) * (panelTimingTenths.format - panelTimingTenths.overlap)
) / 10;
const overviewEntryEnd = particleDurations.enter / 1000;
const overviewTiming = {
	exitStart: 3.7,
	rings: { delays: [.2, .3, .4, .4], duration: .4 },
	glow: { start: 4.1, duration: .8, scale: 2.49 },
	lift: { start: 4.2, duration: .8, textOffset: 489, orbitOffset: 136 },
	orbitFadeStart: 5.2,
	phone: { start: 5, duration: 1.1 },
	entrance: { start: 5.3, duration: 1, introOffset: 189, contentOffset: 110 },
};
const panelTiming = {
	exit: { duration: 1.4, textDuration: 1.1 },
	screen: { delay: .2, duration: 1.2 },
};
const motion = { copyOffset: 48, closedRingScale: .13, phoneStart: '105%' };

const firstPanelIdleScrollHeights = .45;
const overviewExitStart = overviewTiming.exitStart;
const convergenceDuration = .7;
const panelExitStart = (index: number) => panelEnd(index) - panelTiming.exit.duration;
const panelEntryStart = (index: number) => index < 2 ? panelStart(index) : panelExitStart(index - 1);
const panelEntryEnd = (index: number) => index === 1 ? overviewTiming.entrance.start + overviewTiming.entrance.duration : panelEnd(index - 1);
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
	let trigger: ScrollTrigger | undefined;
	let catchUp: gsap.core.Tween | undefined;
	let retimeCatchUp: ((duration: number) => void) | undefined;
	let frame = 0;
	let geometry = '';
	const progressLine = root.parentElement?.querySelector<HTMLProgressElement>('[data-networks-section-progress]');
	const outline = root.parentElement?.querySelector<HTMLInputElement>('[data-networks-outline]');
	const updateOutline = () => root.toggleAttribute('data-networks-outlined', Boolean(outline?.checked));
	outline?.addEventListener('change', updateOutline, { signal });
	updateOutline();
	const durationSlider = root.parentElement?.querySelector<HTMLInputElement>('[data-networks-scrub-duration]');
	const durationValue = root.parentElement?.querySelector<HTMLOutputElement>('[data-networks-scrub-duration-value]');
	const readScrubDuration = () => durationSlider?.valueAsNumber ?? .5;
	const secondsFormat = new Intl.NumberFormat('es', { maximumFractionDigits: 2 });
	const updateDuration = () => {
		const duration = readScrubDuration();
		const label = `${secondsFormat.format(duration)} s`;
		if (durationValue) durationValue.value = label;
		durationSlider?.setAttribute('aria-valuetext', label);
		retimeCatchUp?.(duration);
	};
	durationSlider?.addEventListener('input', updateDuration, { signal });
	updateDuration();
	const reportProgress = (self: ScrollTrigger) => {
		if (progressLine) progressLine.value = self.progress * 100;
	};

	const syncParticles = (phase?: 'enter' | 'idle' | 'exit', progress = 0) => {
		if (phase) {
			particles.dataset.orbitSequencePhase = phase;
			particles.dataset.orbitSequenceFreeIdle = '';
			particles.dataset.orbitSequenceProgress = String(progress);
		} else {
			delete particles.dataset.orbitSequencePhase;
			delete particles.dataset.orbitSequenceFreeIdle;
			delete particles.dataset.orbitSequenceProgress;
		}
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
		trigger?.kill();
		trigger = undefined;
		catchUp?.kill();
		catchUp = undefined;
		retimeCatchUp = undefined;
		delete root.dataset.networksScroll;
		context?.revert();
		context = undefined;
		delete root.dataset.networksPlayback;
		setPanel(-1);
		overview.inert = false;
		syncParticles();
	};

	const trackStaticProgress = () => {
		trigger = ScrollTrigger.create({
			trigger: track,
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: reportProgress,
			onRefresh: reportProgress,
		});
		reportProgress(trigger);
	};

	const signature = () => [
		track.clientWidth, measure.clientHeight, overviewIntro.offsetHeight, stacked.matches, reduced.matches,
		...intros.map((element) => element.offsetHeight),
		...contents.map((element) => element.offsetHeight),
	].join(':');

	const rebuild = () => {
		const height = measure.clientHeight;
		reset();
		if (reduced.matches) {
			trackStaticProgress();
			geometry = signature();
			return;
		}

		const mobile = stacked.matches;
		const introHeight = Math.ceil(Math.max(...intros.map((element) => element.getBoundingClientRect().height)));
		const contentHeight = Math.ceil(Math.max(...contents.map((element) => element.getBoundingClientRect().height)));
		const panelInner = firstPanel.firstElementChild as HTMLElement;
		const gap = parseFloat(getComputedStyle(panelInner).rowGap);
		const compactPadding = parseFloat(getComputedStyle(overview).paddingBlockStart);
		const naturalOverviewGap = parseFloat(getComputedStyle(overview).rowGap);
		const minimumOverviewGap = parseFloat(getComputedStyle(root).getPropertyValue('--spacing-32'));
		const preferredOrbitHeight = 240;
		const minimumPhoneHeight = 120;
		const overviewIntroHeight = overviewIntro.offsetHeight;
		const overviewGap = mobile ? naturalOverviewGap : Math.min(naturalOverviewGap, Math.max(minimumOverviewGap, height - overviewIntroHeight - compactPadding * 2 - preferredOrbitHeight));
		const minimumMobilePadding = parseFloat(getComputedStyle(root).getPropertyValue('--spacing-24'));
		const textAndGapsHeight = introHeight + contentHeight + gap * 2;
		const padding = mobile
			? Math.max(minimumMobilePadding, Math.min(
				compactPadding,
				Math.floor((height - overviewIntroHeight - overviewGap - preferredOrbitHeight) / 2),
				Math.floor((height - minimumPhoneHeight - textAndGapsHeight) / 2),
			))
			: parseFloat(getComputedStyle(firstPanel).paddingBlockStart);
		const overviewOrbitHeight = height - overviewIntroHeight - overviewGap - (mobile ? padding : compactPadding) * 2;
		const available = height - padding * 2 - textAndGapsHeight;
		if ((mobile ? available < minimumPhoneHeight : Math.max(introHeight, contentHeight) > height - padding * 2) || overviewOrbitHeight < (mobile ? preferredOrbitHeight : 160)) {
			trackStaticProgress();
			geometry = signature();
			return;
		}

		let selected = -1;
		let lastParticleTime = -1;
		context = gsap.context(() => {
			root.dataset.networksPlayback = mobile ? 'stacked' : 'wide';
			gsap.set(root, { '--admonet-orbit-available-height': `${overviewOrbitHeight}px` });
			if (!mobile) gsap.set(root, { '--admonet-overview-gap': `${overviewGap}px` });
			if (mobile) {
				const phoneWidth = Math.min(available * 410 / 788, panelInner.clientWidth, 320);
				const phoneCenterY = padding + introHeight + gap + phoneWidth * 788 / 410 / 2;
				gsap.set(root, {
					'--ad-format-panel-content-height': `${contentHeight}px`,
					'--ad-format-panel-intro-height': `${introHeight}px`,
					'--ad-formats-panel-height': `${height}px`,
					'--ad-formats-panel-padding': `${padding}px`,
					'--ad-formats-phone-width': `${phoneWidth}px`,
					'--admonet-overview-padding': `${padding}px`,
					'--admonet-phone-center-y': `${phoneCenterY}px`,
				});
			}

			gsap.set([phone, ...panels], { autoAlpha: 0 });
			gsap.set(screens.slice(1), { yPercent: 100 });
			gsap.set(stage, { '--ad-formats-phone-y': motion.phoneStart });
			const orbitCenter = orbit.offsetTop + orbit.offsetHeight / 2;
			gsap.set(glow, {
				...lightingFor(0),
				'--admonet-glow-color': 'rgba(209, 14, 78, .26)',
				'--admonet-glow-width': '447px',
				'--admonet-glow-height': '483px',
				'--admonet-glow-offset': `${orbitCenter - overview.clientHeight / 2}px`,
				'--admonet-halo-opacity': 0,
			});

			const sequence = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
			const render = () => {
				const time = sequence.time();
				if (time !== lastParticleTime && (time <= overviewExitStart + convergenceDuration || lastParticleTime <= overviewExitStart + convergenceDuration)) {
					lastParticleTime = time;
					if (time < overviewEntryEnd) syncParticles('enter', time / overviewEntryEnd);
					else if (time < overviewExitStart) {
						if (particles.dataset.orbitSequencePhase !== 'idle') syncParticles('idle');
					} else syncParticles('exit', Math.min(1, (time - overviewExitStart) / convergenceDuration));
				}
				const index = panels.reduce((active, _, position) => {
					const index = position + 1;
					const midpoint = index === 1
						? (overviewTiming.entrance.start + panelEntryEnd(index)) / 2
						: panelEntryStart(index) + panelTiming.exit.textDuration / 2;
					return time >= midpoint ? position + 1 : active;
				}, 0);
				if (index === selected) return;
				selected = index;
				overview.inert = index !== 0;
				setPanel(index);
			};
			sequence.eventCallback('onUpdate', render);

			const addOverviewExit = () => {
				const rings = ['outer', 'middle', 'inner', 'core'];
				rings.forEach((ring, index) => {
					const property = `--admonet-orbit-${ring}`;
					sequence.fromTo(orbit, { [property]: 1 }, { [property]: motion.closedRingScale, duration: overviewTiming.rings.duration }, overviewExitStart + overviewTiming.rings.delays[index]);
				});
				sequence.to(overviewIntro, {
					y: mobile ? -(overviewIntro.offsetTop + overviewIntro.offsetHeight) : -overviewTiming.lift.textOffset,
					duration: overviewTiming.lift.duration,
				}, overviewTiming.lift.start)
					.to(orbit, { y: mobile ? overview.clientHeight / 2 - orbitCenter : -overviewTiming.lift.orbitOffset, duration: overviewTiming.lift.duration }, overviewTiming.lift.start)
					.to(glow, { '--admonet-glow-offset': '0px', duration: overviewTiming.lift.duration }, overviewTiming.lift.start);
			};
			const addHold = (start: number, duration: number) => {
				sequence.to({}, { duration }, start);
			};
			const addEntrance = (index: number, start: number) => {
				sequence.set(panels[index], { autoAlpha: 1 }, start);
				sequence.fromTo([intros[index], contents[index]], { y: stage.clientHeight }, {
					y: 0,
					duration: panelTiming.exit.textDuration,
				}, start);
			};
			const addExit = (index: number, start: number) => {
				sequence.to([intros[index], contents[index]], { y: -stage.clientHeight, duration: panelTiming.exit.textDuration }, start);
			};
			const addPhoneEntrance = () => {
				const { start, duration } = overviewTiming.phone;
				sequence.to(stage, { '--ad-formats-phone-y': '0%', duration }, start)
					.to(glow, { ...lightingFor(0), '--admonet-glow-scale': 1, duration }, start)
					.set(phone, { autoAlpha: 1 }, start)
					.to(glow, { '--admonet-halo-opacity': 1, duration }, start);
			};
			const addFirstEntrance = () => {
				const { start, duration, introOffset, contentOffset } = overviewTiming.entrance;
				sequence.set(panels[0], { autoAlpha: 1 }, start);
				sequence.fromTo(intros[0], { autoAlpha: 0, y: mobile ? motion.copyOffset : introOffset }, { autoAlpha: 1, y: 0, duration }, start);
				sequence.fromTo(contents[0], { autoAlpha: 0, y: mobile ? motion.copyOffset : contentOffset }, { autoAlpha: 1, y: 0, duration }, start);
			};
			const addScreenChange = (index: number, start: number) => {
				sequence.to(screens[index], { yPercent: -100, duration: panelTiming.screen.duration }, start + panelTiming.screen.delay)
					.to(screens[index + 1], { yPercent: 0, duration: panelTiming.screen.duration }, start + panelTiming.screen.delay);
			};

			addOverviewExit();
			sequence.to(orbit, {
				autoAlpha: 0,
				duration: panelEnd(0) - overviewTiming.orbitFadeStart,
			}, overviewTiming.orbitFadeStart);
			sequence.fromTo(glow, { '--admonet-glow-scale': 1 }, {
				'--admonet-glow-scale': overviewTiming.glow.scale,
				duration: overviewTiming.glow.duration,
			}, overviewTiming.glow.start);
			addPhoneEntrance();
			addFirstEntrance();

			panels.slice(1).forEach((_, index) => {
				const start = panelEntryStart(index + 2);
				addScreenChange(index, start);
				addExit(index, start);
				addEntrance(index + 1, start);
				sequence.to(glow, { ...lightingFor(index + 1), duration: panelTiming.screen.duration }, start + panelTiming.screen.delay);
			});

			const lastEntryEnd = panelEntryEnd(panels.length);
			addHold(lastEntryEnd, panelEnd(panels.length) - lastEntryEnd);
			root.dataset.networksScroll = '';
			const duration = sequence.duration();
			const heightsPerSecond = (panels.length + 1) / duration;
			const idleStart = panelEntryEnd(1);
			const idleEnd = panels.length === 1 ? panelEnd(1) : panelExitStart(1);
			const idleScrollStart = idleStart * heightsPerSecond;
			const idleScrollEnd = idleScrollStart + firstPanelIdleScrollHeights;
			const scrollHeights = idleScrollEnd + (duration - idleEnd) * heightsPerSecond;
			const timeAt = (progress: number) => {
				const distance = progress * scrollHeights;
				if (distance < idleScrollStart) return distance / heightsPerSecond;
				if (distance < idleScrollEnd) {
					return gsap.utils.interpolate(idleStart, idleEnd, (distance - idleScrollStart) / firstPanelIdleScrollHeights);
				}
				return idleEnd + (distance - idleScrollEnd) / heightsPerSecond;
			};

			gsap.set(root, { '--admonet-scroll-heights': scrollHeights });
			const playhead = { progress: 0 };
			const follow = gsap.quickTo(playhead, 'progress', {
				duration: readScrubDuration(),
				ease: 'none',
				onUpdate: () => { sequence.time(timeAt(playhead.progress)); },
			});
			catchUp = follow.tween;
			let targetProgress = 0;
			retimeCatchUp = (duration) => {
				const currentProgress = playhead.progress;
				follow.tween.pause().duration(duration);
				if (Math.abs(targetProgress - currentProgress) > 1e-6) follow(targetProgress, currentProgress);
			};
			const refresh = (self: ScrollTrigger) => {
				follow.tween.pause();
				targetProgress = self.progress;
				playhead.progress = self.progress;
				sequence.time(timeAt(self.progress));
				reportProgress(self);
			};
			trigger = ScrollTrigger.create({
				trigger: track,
				start: 'top top',
				end: () => `+=${measure.clientHeight * scrollHeights}`,
				onUpdate: (self) => {
					reportProgress(self);
					targetProgress = self.progress;
					follow(targetProgress);
				},
				onRefresh: refresh,
			});
			refresh(trigger);
			render();
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

	rebuild();
	return () => {
		events.abort();
		delete root.dataset.networksOutlined;
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
