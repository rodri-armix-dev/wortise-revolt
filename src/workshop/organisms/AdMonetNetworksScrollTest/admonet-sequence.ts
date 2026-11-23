import { gsap } from 'gsap';
import { mediaQueries } from '../../../../config/breakpoints';

import { particleDurations } from './particle-motion';

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
	lighting: { delay: .7, duration: .4 },
};
const motion = { copyOffset: 48, closedRingScale: .13, phoneStart: '105%' };

const easing = {
	rings: 'power2.inOut',
	orbitCenter: 'sine.inOut',
	orbitFade: 'power1.out',
	copyEntrance: 'sine.inOut',
	copyExit: 'sine.inOut',
	phoneEntrance: 'sine.inOut',
	phoneReveal: 'sine.inOut',
	screenChange: 'sine.inOut',
	lightingChange: 'power1.out',
};

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
	let timeline: gsap.core.Timeline | undefined;
	let scrollTween: gsap.core.Tween | undefined;
	let scrollPanel: number | undefined;
	let scrollFrame = 0;
	let visible = false;
	let pausedByUser = false;
	let reversed = false;
	let frame = 0;
	let geometry = '';

	const controls = root.parentElement;
	const toggle = controls?.querySelector('[data-networks-toggle]');
	const reverse = controls?.querySelector('[data-networks-reverse]');
	const playIcon = toggle?.querySelector<HTMLElement>('[data-networks-play-icon]');
	const pauseIcon = toggle?.querySelector<HTMLElement>('[data-networks-pause-icon]');
	const phases = controls?.querySelectorAll<HTMLElement>('[data-networks-phase]');
	const loopSelect = controls?.querySelector<HTMLSelectElement>('[data-networks-loop]');
	const playbackMode = controls?.querySelector<HTMLSelectElement>('[data-networks-mode]');
	let manual = playbackMode?.value === 'manual';
	const manualControls = controls?.querySelectorAll<HTMLButtonElement | HTMLSelectElement>('[data-networks-toggle], [data-networks-restart], [data-networks-reverse], [data-networks-loop]');
	const phaseBounds = (phase: HTMLElement) => {
		const index = Number(phase.dataset.networksPanelIndex);
		const entry = panelEntryStart(index);
		const idle = index === 0 ? overviewEntryEnd : panelEntryEnd(index);
		const exit = index === 0 ? overviewExitStart : index === panels.length ? panelEnd(index) : panelExitStart(index);
		const exitEnd = panelEnd(index);
		const bounds = { E: [entry, idle], I: [idle, exit], S: [exit, exitEnd] } as const;
		return bounds[phase.dataset.networksPhase as keyof typeof bounds];
	};
	let loopBounds: readonly [number, number] | undefined;
	const rewindPlayback = () => timeline?.time(reversed ? (loopBounds?.[1] ?? timeline.duration()) : (loopBounds?.[0] ?? 0));
	const durationFormat = new Intl.NumberFormat('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
	let measuredDuration = -1;
	const updateProgress = (time: number, duration: number) => {
		const updateRuler = measuredDuration !== duration;
		measuredDuration = duration;
		phases?.forEach((phase) => {
			const [start, end] = phaseBounds(phase);
			if (updateRuler) {
				const seconds = end - start;
				phase.style.setProperty('--timeline-phase-seconds', String(seconds));
				const marker = phase.querySelector<HTMLElement>('[data-networks-panel-marker]');
				if (marker) {
					const panelIndex = Number(phase.dataset.networksPanelIndex);
					const nominalStart = panelStart(panelIndex);
					marker.style.setProperty('--timeline-marker-seconds', String(nominalStart - start));
					marker.title = `Inicio de P${panelIndex} · ${durationFormat.format(nominalStart)} s`;
				}
				if (phase === phase.parentElement?.firstElementChild) {
					phase.parentElement.style.setProperty('--timeline-panel-start', String(start));
				}
				const label = phase.querySelector('[data-networks-duration]');
				if (label) label.textContent = `${durationFormat.format(seconds)} s`;
			}
			const progress = end > start ? gsap.utils.clamp(0, 1, (time - start) / (end - start)) : 0;
			phase.style.setProperty('--timeline-progress', `${progress * 100}%`);
		});
	};
	const atPlaybackEnd = () => timeline?.progress() === (reversed ? 0 : 1);
	const isPlaying = () => Boolean(timeline && !timeline.paused() && !atPlaybackEnd());
	const syncControls = () => {
		manualControls?.forEach((control) => { control.disabled = !manual || !timeline; });
		const playing = isPlaying();
		const label = playing ? 'Pausa' : 'Reproducir';
		toggle?.setAttribute('aria-label', label);
		toggle?.setAttribute('title', label);
		if (playIcon) playIcon.hidden = playing;
		if (pauseIcon) pauseIcon.hidden = !playing;
		reverse?.setAttribute('aria-pressed', String(reversed));
	};
	const syncPlayback = () => {
		if (manual) timeline?.reversed(reversed).paused(!visible || pausedByUser);
		syncControls();
	};

	const syncParticles = (phase?: 'enter' | 'idle' | 'exit', progress = 0) => {
		if (phase) {
			particles.dataset.orbitSequencePhase = phase;
			particles.dataset.orbitSequenceProgress = String(progress);
		} else {
			delete particles.dataset.orbitSequencePhase;
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

	const updateScrollPanel = () => {
		if (manual || !timeline) return;
		const top = track.getBoundingClientRect().top;
		const index = gsap.utils.clamp(-1, panels.length, Math.floor(-top / measure.clientHeight));
		if (index === scrollPanel) return;

		const previous = scrollPanel;
		scrollPanel = index;
		const wasMoving = scrollTween?.isActive();
		scrollTween?.kill();
		scrollTween = undefined;

		const idleStart = index < 0 ? 0 : index === 0 ? overviewEntryEnd : panelEntryEnd(index);
		const idleEnd = index <= 0
			? (index === 0 ? overviewExitStart : 0)
			: index === panels.length ? panelEnd(index) : panelExitStart(index);

		if (!wasMoving && previous !== undefined && previous >= 0 && index >= 0) {
			const boundary = index > previous
				? (previous === 0 ? overviewExitStart : panelExitStart(previous))
				: (previous === 0 ? overviewEntryEnd : panelEntryEnd(previous));
			timeline.time(boundary);
		}

		const current = timeline.time();
		const target = gsap.utils.clamp(idleStart, idleEnd, current);
		const distance = Math.abs(target - current);
		if (distance < .001) return;
		const skipsPanels = previous !== undefined && Math.abs(index - previous) > 1;
		scrollTween = timeline.tweenTo(target, {
			duration: skipsPanels ? Math.min(distance, panelTiming.exit.duration) : distance,
			ease: 'none',
		});
	};

	const scheduleScroll = () => {
		if (scrollFrame) return;
		scrollFrame = requestAnimationFrame(() => {
			scrollFrame = 0;
			updateScrollPanel();
		});
	};

	const reset = () => {
		scrollTween?.kill();
		scrollTween = undefined;
		scrollPanel = undefined;
		delete root.dataset.networksScroll;
		context?.revert();
		context = undefined;
		timeline = undefined;
		updateProgress(0, 0);
		syncControls();
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
		const previousTime = timeline?.time() ?? 0;
		const height = measure.clientHeight;
		reset();
		if (reduced.matches) {
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

			const sequence = gsap.timeline({ paused: true });
			timeline = sequence;
			const render = () => {
				const time = sequence.time();
				if (manual && loopBounds && !sequence.paused()) {
					const [start, end] = loopBounds;
					if (reversed ? time <= start : time >= end) {
						rewindPlayback();
						return;
					}
				}
				updateProgress(time, sequence.duration());
				if (time !== lastParticleTime && (time <= overviewExitStart + convergenceDuration || lastParticleTime <= overviewExitStart + convergenceDuration)) {
					lastParticleTime = time;
					if (time < overviewEntryEnd) syncParticles('enter', time / overviewEntryEnd);
					else if (time < overviewExitStart) {
						const idleProgress = (time - overviewEntryEnd) / (overviewExitStart - overviewEntryEnd);
						syncParticles('idle', idleProgress);
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
			sequence.eventCallback('onComplete', syncControls);
			sequence.eventCallback('onReverseComplete', syncControls);

			const addOverviewExit = () => {
				const rings = ['outer', 'middle', 'inner', 'core'];
				rings.forEach((ring, index) => {
					const property = `--admonet-orbit-${ring}`;
					sequence.fromTo(orbit, { [property]: 1 }, { [property]: motion.closedRingScale, duration: overviewTiming.rings.duration, ease: easing.rings }, overviewExitStart + overviewTiming.rings.delays[index]);
				});
				sequence.to(overviewIntro, {
					y: mobile ? -(overviewIntro.offsetTop + overviewIntro.offsetHeight) : -overviewTiming.lift.textOffset,
					duration: overviewTiming.lift.duration,
					ease: easing.orbitCenter,
				}, overviewTiming.lift.start)
					.to(orbit, { y: mobile ? overview.clientHeight / 2 - orbitCenter : -overviewTiming.lift.orbitOffset, duration: overviewTiming.lift.duration, ease: easing.orbitCenter }, overviewTiming.lift.start)
					.to(glow, { '--admonet-glow-offset': '0px', duration: overviewTiming.lift.duration, ease: easing.orbitCenter }, overviewTiming.lift.start);
			};
			const addHold = (start: number, duration: number) => {
				sequence.to({}, { duration }, start);
			};
			const addEntrance = (index: number, start: number) => {
				sequence.set(panels[index], { autoAlpha: 1 }, start);
				sequence.fromTo([intros[index], contents[index]], { y: stage.clientHeight }, {
					y: 0,
					duration: panelTiming.exit.textDuration,
					ease: easing.copyEntrance,
				}, start);
			};
			const addExit = (index: number, start: number) => {
				sequence.to([intros[index], contents[index]], { y: -stage.clientHeight, duration: panelTiming.exit.textDuration, ease: easing.copyExit }, start);
			};
			const addPhoneEntrance = () => {
				const { start, duration } = overviewTiming.phone;
				sequence.to(stage, { '--ad-formats-phone-y': '0%', duration, ease: easing.phoneEntrance }, start)
					.to(glow, { ...lightingFor(0), '--admonet-glow-scale': 1, duration, ease: easing.phoneEntrance }, start)
					.set(phone, { autoAlpha: 1 }, start)
					.to(glow, { '--admonet-halo-opacity': 1, duration, ease: easing.phoneReveal }, start);
			};
			const addFirstEntrance = () => {
				const { start, duration, introOffset, contentOffset } = overviewTiming.entrance;
				sequence.set(panels[0], { autoAlpha: 1 }, start);
				sequence.fromTo(intros[0], { autoAlpha: 0, y: mobile ? motion.copyOffset : introOffset }, { autoAlpha: 1, y: 0, duration, ease: easing.copyEntrance }, start);
				sequence.fromTo(contents[0], { autoAlpha: 0, y: mobile ? motion.copyOffset : contentOffset }, { autoAlpha: 1, y: 0, duration, ease: easing.copyEntrance }, start);
			};
			const addScreenChange = (index: number, start: number) => {
				sequence.to(screens[index], { yPercent: -100, duration: panelTiming.screen.duration, ease: easing.screenChange }, start + panelTiming.screen.delay)
					.to(screens[index + 1], { yPercent: 0, duration: panelTiming.screen.duration, ease: easing.screenChange }, start + panelTiming.screen.delay);
			};

			addOverviewExit();
			sequence.to(orbit, {
				autoAlpha: 0,
				duration: panelEnd(0) - overviewTiming.orbitFadeStart,
				ease: easing.orbitCenter,
			}, overviewTiming.orbitFadeStart);
			sequence.fromTo(glow, { '--admonet-glow-scale': 1 }, {
				'--admonet-glow-scale': overviewTiming.glow.scale,
				duration: overviewTiming.glow.duration,
				ease: easing.orbitCenter,
			}, overviewTiming.glow.start);
			addPhoneEntrance();
			addFirstEntrance();

			panels.slice(1).forEach((_, index) => {
				const start = panelEntryStart(index + 2);
				addScreenChange(index, start);
				addExit(index, start);
				addEntrance(index + 1, start);
				sequence.to(glow, { ...lightingFor(index + 1), duration: panelTiming.lighting.duration, ease: easing.lightingChange }, start + panelTiming.lighting.delay);
			});

			const lastEntryEnd = panelEntryEnd(panels.length);
			addHold(lastEntryEnd, panelEnd(panels.length) - lastEntryEnd);
			sequence.time(previousTime);
			if (!manual) {
				root.dataset.networksScroll = '';
				gsap.set(root, { '--admonet-scroll-panels': panels.length + 1 });
				updateScrollPanel();
			}
			render();
			syncPlayback();
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

	playbackMode?.addEventListener('change', () => {
		const wasPinned = root.hasAttribute('data-networks-scroll') && track.getBoundingClientRect().top <= 0 && track.getBoundingClientRect().bottom >= stage.clientHeight;
		manual = playbackMode.value === 'manual';
		pausedByUser = false;
		reversed = false;
		loopBounds = undefined;
		if (loopSelect) loopSelect.value = '';
		rebuild();
		if (manual && wasPinned) stage.scrollIntoView({ block: 'center', behavior: 'instant' });
	}, { signal });

	toggle?.addEventListener('click', () => {
		pausedByUser = isPlaying();
		if (!pausedByUser && atPlaybackEnd()) rewindPlayback();
		syncPlayback();
	}, { signal });
	reverse?.addEventListener('click', () => {
		reversed = !reversed;
		pausedByUser = false;
		if (atPlaybackEnd()) rewindPlayback();
		syncPlayback();
	}, { signal });
	controls?.querySelector('[data-networks-restart]')?.addEventListener('click', () => {
		reversed = false;
		pausedByUser = false;
		rewindPlayback();
		syncPlayback();
	}, { signal });
	loopSelect?.addEventListener('change', () => {
		const phase = Array.from(phases ?? []).find((element) => (
			`P${element.dataset.networksPanelIndex}${element.dataset.networksPhase}` === loopSelect.value
		));
		loopBounds = phase ? phaseBounds(phase) : undefined;
		if (loopBounds) {
			rewindPlayback();
			pausedByUser = false;
		}
		syncPlayback();
	}, { signal });
	const center = () => {
		if (root.hasAttribute('data-networks-scroll')) {
			window.scrollTo({ top: Math.ceil(window.scrollY + track.getBoundingClientRect().top), behavior: 'smooth' });
		} else {
			stage.scrollIntoView({ block: 'center', behavior: reduced.matches ? 'instant' : 'smooth' });
		}
	};
	controls?.querySelector('[data-networks-center]')?.addEventListener('click', () => center(), { signal });

	const visibility = new IntersectionObserver(([entry]) => {
		visible = entry.intersectionRatio >= .5;
		syncPlayback();
	}, { threshold: .5 });
	visibility.observe(stage);
	window.addEventListener('scroll', scheduleScroll, { passive: true, signal });
	rebuild();
	return () => {
		events.abort();
		observer.disconnect();
		cancelAnimationFrame(frame);
		cancelAnimationFrame(scrollFrame);
		visibility.disconnect();
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
