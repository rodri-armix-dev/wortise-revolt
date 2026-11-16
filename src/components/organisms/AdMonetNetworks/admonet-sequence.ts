import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { mediaQueries } from '../../../../config/breakpoints';

gsap.registerPlugin(ScrollTrigger, Observer);

// Scroll distance per panel, as a multiple of the visible panel height.
const scrollDistancePerPanel = .6;
const secondsPerTimelineUnit = 1.15;
const maximumGestureSpeed = 2.2;
const maximumOverviewSpeed = 1.5;
const reverseGestureFinishSpeed = 2.8;
const gestureTolerance = 8;
const pinEdgeBuffer = 32;
const viewportSettleDelay = 150;
const viewportGrowthDuration = .25;
const viewportGrowthProperties = [
	'--ad-formats-panel-height',
	'--ad-formats-panel-padding',
	'--ad-formats-phone-width',
	'--admonet-orbit-available-height',
	'--admonet-overview-padding',
	'--admonet-phone-center-y',
];
const overviewTiming = {
	convergeEnd: .42,
	hold: .18,
	rings: { delay: .09, duration: .18, stagger: .025 },
	center: { delay: .16, duration: .24 },
	hideCopy: .01,
	fade: .16,
	phone: { delay: .06, duration: .27, revealDuration: .16 },
	entrance: { delay: .10, duration: .24 },
	settle: .06,
};
const panelTiming = {
	exit: { delay: .08, duration: .34 },
	screen: { delay: .14, duration: .76 },
	lighting: { delay: .20, duration: .66 },
	entrance: { delay: .58, duration: .40 },
	settle: .02,
};
const motion = { copyOffset: 48, closedRingScale: .13, phoneStart: '105%' };

const easing = {
	rings: 'power2.inOut',
	orbitCenter: 'sine.inOut',
	orbitFade: 'power1.out',
	copyEntrance: 'sine.inOut',
	copyExit: 'power1.out',
	phoneEntrance: 'sine.inOut',
	phoneReveal: 'sine.inOut',
	screenChange: 'sine.inOut',
	lightingChange: 'power1.out',
	speedAdjustment: 'power2.out',
	playback: 'none',
};

const overviewFadeStart = overviewTiming.convergeEnd + overviewTiming.hold;
const phoneStart = overviewFadeStart + overviewTiming.phone.delay;
const firstEntranceStart = overviewFadeStart + overviewTiming.entrance.delay;
const firstPanelTime = Math.max(
	overviewFadeStart + overviewTiming.fade + overviewTiming.phone.revealDuration,
	phoneStart + overviewTiming.phone.duration,
	firstEntranceStart + overviewTiming.entrance.duration,
) + overviewTiming.settle;
const panelStep = Math.max(...[panelTiming.exit, panelTiming.screen, panelTiming.lighting, panelTiming.entrance]
	.map(({ delay, duration }) => delay + duration)) + panelTiming.settle;
const panelTime = (index: number) => index === 0 ? 0 : firstPanelTime + (index - 1) * panelStep;
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
	let playbackSpeedTween: gsap.core.Tween | undefined;
	let gestureObserver: Observer | undefined;
	let scrollLock: Observer | undefined;
	let desktopSlide = 0;
	let anchorSlide: number | undefined;
	let gestureEvents: AbortController | undefined;
	let trigger: ScrollTrigger | undefined;
	let frame = 0;
	let viewportTimer: number | undefined;
	let viewportWidth = track.clientWidth;
	let viewportHeight = measure.clientHeight;
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
		scrollLock?.kill();
		scrollLock = undefined;
		gestureObserver?.kill();
		gestureObserver = undefined;
		gestureEvents?.abort();
		playbackSpeedTween?.kill();
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

	const rebuild = (settledViewport = false) => {
		const previous = trigger?.isActive ? trigger.progress : undefined;
		const height = measure.clientHeight;
		const growthFrom = settledViewport && previous !== undefined && height > stage.clientHeight
			? Object.fromEntries(viewportGrowthProperties.map((property) => [property, root.style.getPropertyValue(property)]))
			: undefined;
		viewportWidth = track.clientWidth;
		viewportHeight = height;
		rebuilding = true;
		reset();
		if (reduced.matches) {
			geometry = signature();
			rebuilding = false;
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
			rebuilding = false;
			return;
		}

		const distancePerStage = height * scrollDistancePerPanel;
		const distance = distancePerStage * (panels.length + 1);
		let requested = -1;
		let selected = -1;
		let lastProgress = -1;

		context = gsap.context(() => {
			root.dataset.networksPlayback = mobile ? 'sticky' : 'pin';
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
					'--admonet-sticky-height': `${height}px`,
					'--admonet-track-distance': `${distance}px`,
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

			const timeline = gsap.timeline({ paused: true });
			const render = () => {
				const time = timeline.time();
				const progress = Math.min(1, time / overviewTiming.convergeEnd);
				if (progress !== lastProgress) {
					lastProgress = progress;
					syncParticles(progress);
				}
				const index = time < firstPanelTime
					? Math.round(time / firstPanelTime)
					: 1 + Math.round((time - firstPanelTime) / panelStep);
				if (index === selected) return;
				selected = index;
				overview.inert = index !== 0;
				setPanel(index);
			};
			timeline.eventCallback('onUpdate', render);

			const addOverviewExit = (start: number) => {
				const rings = ['outer', 'middle', 'inner', 'core'];
				rings.forEach((ring, index) => {
					const property = `--admonet-orbit-${ring}`;
					timeline.fromTo(orbit, { [property]: 1 }, { [property]: motion.closedRingScale, duration: overviewTiming.rings.duration, ease: easing.rings }, start + overviewTiming.rings.delay + index * overviewTiming.rings.stagger);
				});
				timeline.to(overviewIntro, {
					y: -(overviewIntro.offsetTop + overviewIntro.offsetHeight),
					duration: overviewTiming.center.duration,
					ease: easing.orbitCenter,
				}, start + overviewTiming.center.delay)
					.to(orbit, { y: overview.clientHeight / 2 - orbitCenter, duration: overviewTiming.center.duration, ease: easing.orbitCenter }, start + overviewTiming.center.delay)
					.to(glow, { '--admonet-glow-offset': '0px', duration: overviewTiming.center.duration, ease: easing.orbitCenter }, start + overviewTiming.center.delay)
					.to(overviewIntro, { autoAlpha: 0, duration: overviewTiming.hideCopy, ease: easing.orbitCenter }, start + overviewTiming.center.delay + overviewTiming.center.duration);
			};
			const addHold = (start: number, duration: number) => {
				timeline.to({}, { duration }, start);
			};
			const addEntrance = (panel: HTMLElement, start: number, duration: number) => {
				timeline.fromTo(panel, { autoAlpha: 0, y: motion.copyOffset }, { autoAlpha: 1, y: 0, duration, ease: easing.copyEntrance }, start);
			};
			const addExit = (panel: HTMLElement, start: number) => {
				timeline.to(panel, { autoAlpha: 0, y: -motion.copyOffset, duration: panelTiming.exit.duration, ease: easing.copyExit }, start);
			};
			const addPhoneEntrance = (start: number) => {
				timeline.to(stage, { '--ad-formats-phone-y': '0%', duration: overviewTiming.phone.duration, ease: easing.phoneEntrance }, start)
					.to(glow, { ...lightingFor(0), duration: overviewTiming.phone.duration, ease: easing.phoneEntrance }, start)
					.to(phone, { autoAlpha: 1, duration: overviewTiming.phone.revealDuration, ease: easing.orbitFade }, overviewFadeStart + overviewTiming.fade)
					.to(glow, { '--admonet-halo-opacity': 1, duration: overviewTiming.phone.revealDuration, ease: easing.orbitFade }, overviewFadeStart + overviewTiming.fade);
			};
			const addScreenChange = (index: number, start: number) => {
				timeline.to(screens[index], { yPercent: -100, duration: panelTiming.screen.duration, ease: easing.screenChange }, start + panelTiming.screen.delay)
					.to(screens[index + 1], { yPercent: 0, duration: panelTiming.screen.duration, ease: easing.screenChange }, start + panelTiming.screen.delay);
			};

			addOverviewExit(0);
			addHold(overviewTiming.convergeEnd, overviewTiming.hold);
			timeline.to(orbit, { autoAlpha: 0, duration: overviewTiming.fade, ease: easing.orbitFade }, overviewFadeStart);
			addPhoneEntrance(phoneStart);
			addEntrance(panels[0], firstEntranceStart, overviewTiming.entrance.duration);
			addHold(firstPanelTime - overviewTiming.settle, overviewTiming.settle);

			panels.slice(1).forEach((panel, index) => {
				const start = panelTime(index + 1);
				addScreenChange(index, start);
				addExit(panels[index], start + panelTiming.exit.delay);
				addEntrance(panel, start + panelTiming.entrance.delay, panelTiming.entrance.duration);
				timeline.to(glow, { ...lightingFor(index + 1), duration: panelTiming.lighting.duration, ease: easing.lightingChange }, start + panelTiming.lighting.delay);
				addHold(start + panelStep - panelTiming.settle, panelTiming.settle);
			});

			let positioning = false;
			let lockedScroll = 0;
			const setPlaybackSpeed = (speed: number, speedLimit = maximumGestureSpeed) => {
				if (!transition) return;
				const maximum = Math.min(panelTime(requested), timeline.time()) < firstPanelTime ? maximumOverviewSpeed : speedLimit;
				playbackSpeedTween?.kill();
				playbackSpeedTween = gsap.to(transition, {
					timeScale: Math.min(maximum, speed),
					duration: .12,
					ease: easing.speedAdjustment,
					overwrite: true,
				});
			};
			const gestureSpeed = (self: Observer) => 1 + gsap.utils.clamp(0, 1, (Math.abs(self.velocityY) / height - .5) / 2.5) * (maximumGestureSpeed - 1);
			const release = (direction: number) => {
				gestureObserver?.disable();
				scrollLock?.disable();
				positioning = true;
				window.scrollTo({ top: direction > 0 ? trigger!.end + 2 : trigger!.start - 2, behavior: 'instant' });
				ScrollTrigger.update();
				positioning = false;
			};
			const stopPlayback = () => {
				playbackSpeedTween?.kill();
				transition?.kill();
				transition = undefined;
			};
			const showPanel = (index: number) => {
				stopPlayback();
				timeline.time(panelTime(index));
				render();
			};
			const playToPanel = (index: number, duration: number) => {
				stopPlayback();
				transition = timeline.tweenTo(panelTime(index), {
					duration,
					ease: easing.playback,
					onComplete: () => {
						playbackSpeedTween?.kill();
						transition = undefined;
					},
				});
			};
			const selectSlide = (direction: number, speed = 1) => {
				if (!trigger?.isActive) return;
				if (transition) {
					const playbackDirection = Math.sign(panelTime(requested) - timeline.time());
					if (direction === playbackDirection) setPlaybackSpeed(speed);
					else setPlaybackSpeed(reverseGestureFinishSpeed, reverseGestureFinishSpeed);
					return;
				}
				const next = requested + direction;
				if (next < 0 || next > panels.length) {
					release(direction);
					return;
				}
				requested = next;
				desktopSlide = next;
				const duration = Math.abs(panelTime(next) - timeline.time()) * secondsPerTimelineUnit;
				playToPanel(next, duration);
				setPlaybackSpeed(speed);
			};
			const panelAtScroll = (self: ScrollTrigger) => Math.min(panels.length, Math.floor(self.progress * (panels.length + 1)));

			const syncSlides = (self: ScrollTrigger, immediate: boolean) => {
				if (gestureObserver?.isEnabled && !immediate) return;
				if (anchorSlide !== undefined) requested = anchorSlide;
				else if (previous !== undefined && immediate) requested = desktopSlide;
				else if (self.isActive) requested = self.direction < 0 ? panels.length : 0;
				else requested = panelAtScroll(self);

				anchorSlide = undefined;
				desktopSlide = requested;
				showPanel(requested);
				if (self.isActive) {
					positioning = true;
					const buffer = Math.min(pinEdgeBuffer, (self.end - self.start) / 2);
					lockedScroll = gsap.utils.clamp(self.start + buffer, self.end - buffer, window.scrollY);
					window.scrollTo({ top: lockedScroll, behavior: 'instant' });
					ScrollTrigger.update();
					scrollLock?.enable();
					gestureObserver?.enable();
					positioning = false;
				} else {
					gestureObserver?.disable();
					scrollLock?.disable();
				}
			};

			const syncScrollPanels = (self: ScrollTrigger, immediate: boolean) => {
				const index = panelAtScroll(self);
				if (index === requested && !immediate) return;
				requested = index;
				if (immediate || !self.isActive) {
					showPanel(index);
					return;
				}
				const duration = Math.abs(panelTime(index) - timeline.time()) * secondsPerTimelineUnit;
				playToPanel(index, gsap.utils.clamp(.18, 1.8, duration));
			};

			const syncPlayback = mobile ? syncScrollPanels : syncSlides;
			const update = (self: ScrollTrigger, immediate = false) => {
				if (positioning || (rebuilding && !immediate)) return;
				syncPlayback(self, immediate);
			};

			trigger = ScrollTrigger.create({
				anticipatePin: 1,
				trigger: track,
				start: 'top top',
				end: `+=${distance}`,
				pin: mobile ? false : stage,
				pinSpacing: !mobile,
				onUpdate: (self) => update(self),
				onToggle: (self) => update(self),
			});
			if (!mobile) {
				let pageScrollLock: gsap.Context | undefined;
				scrollLock = Observer.create({
					target: window,
					type: 'wheel,scroll,touch',
					debounce: false,
					preventDefault: true,
					allowClicks: true,
					onEnable: () => {
						pageScrollLock = gsap.context(() => {
							gsap.set(document.documentElement, { overflowY: 'hidden', scrollbarGutter: 'stable' });
						});
					},
					onDisable: () => {
						pageScrollLock?.revert();
						pageScrollLock = undefined;
					},
					onChangeY: () => {
						if (positioning || !scrollLock?.isEnabled || Math.abs(window.scrollY - lockedScroll) < 1) return;
						window.scrollTo({ top: lockedScroll, behavior: 'instant' });
					},
				});
				scrollLock.disable();
				gestureObserver = Observer.create({
					target: window,
					type: 'wheel,touch',
					preventDefault: true,
					allowClicks: true,
					wheelSpeed: -1,
					tolerance: gestureTolerance,
					onUp: (self) => selectSlide(1, gestureSpeed(self)),
					onDown: (self) => selectSlide(-1, gestureSpeed(self)),
					onWheel: (self) => {
						if (Math.sign(-self.velocityY) === Math.sign(panelTime(requested) - timeline.time())) setPlaybackSpeed(gestureSpeed(self));
					},
					onStop: () => setPlaybackSpeed(1),
				});
				gestureObserver.disable();
				gestureEvents = new AbortController();
				window.addEventListener('keydown', (event) => {
					if (!gestureObserver?.isEnabled || event.ctrlKey || event.metaKey || event.altKey) return;
					if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
					if (['Home', 'End', 'Escape'].includes(event.key)) {
						gestureObserver.disable();
						scrollLock?.disable();
						if (event.key === 'Escape') release(requested < panels.length / 2 ? -1 : 1);
						return;
					}
					const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey ? -1 : 1) : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
					if (!direction) return;
					event.preventDefault();
					selectSlide(direction);
				}, { signal: gestureEvents.signal });
			}

			rebuilding = false;
			if (previous !== undefined) {
				window.scrollTo({ top: trigger.start + previous * distance, behavior: 'instant' });
				ScrollTrigger.update();
			}
			update(trigger, true);
			if (growthFrom) {
				const growthTo = Object.fromEntries(viewportGrowthProperties.map((property) => [property, root.style.getPropertyValue(property)]));
				gsap.fromTo(root, growthFrom, { ...growthTo, duration: viewportGrowthDuration, ease: 'power2.out' });
			}
		}, root);
		geometry = signature();
	};

	const schedule = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			clearTimeout(viewportTimer);
			if (geometry === signature()) return;
			if (root.dataset.networksPlayback === 'sticky' && !reduced.matches && stacked.matches
				&& track.clientWidth === viewportWidth && measure.clientHeight !== viewportHeight) {
				viewportTimer = window.setTimeout(() => rebuild(true), viewportSettleDelay);
			} else rebuild();
		});
	};
	const observer = new ResizeObserver(schedule);
	[track, measure, overviewIntro, ...intros, ...contents].forEach((element) => observer.observe(element));
	[stacked, reduced].forEach((media) => media.addEventListener('change', schedule, { signal }));

	const followAnchor = () => {
		const index = panels.findIndex((panel) => `#${panel.firstElementChild?.id}` === location.hash);
		if (!trigger || index < 0) return;
		gestureObserver?.disable();
		scrollLock?.disable();
		anchorSlide = index + 1;
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
		clearTimeout(viewportTimer);
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
