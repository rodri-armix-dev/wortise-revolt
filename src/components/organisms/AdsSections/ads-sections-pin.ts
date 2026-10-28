import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isRefreshing, revealProperty } from './ads-sections-motion';
import { appendDesktopMotion, desktopProfiles } from './ads-sections-desktop-motion';
import { desktopMotionTracks } from './ads-sections-desktop-data';
import type { AdsElements, Controller } from './ads-sections-motion';

export function createPinController(elements: AdsElements, options: { reduced: boolean; rebuilding: () => boolean }): Controller | undefined {
	const { root, scene, phoneLayout, items } = elements;
	// Normal document flow is also the reduced-motion and insufficient-height fallback.
	if (options.reduced) return;
	const height = phoneLayout.clientHeight;
	const padding = parseFloat(getComputedStyle(items[0].section).paddingTop);
	const measurements = items.map(({ intro, content, visual }) => {
		const heading = intro.querySelector<HTMLElement>('.ads-sections-item__heading')!;
		const card = intro.querySelector<HTMLElement>('.ads-sections-item__title-card')!;
		const gap = parseFloat(getComputedStyle(card).rowGap);
		return { heading: heading.offsetHeight, expanded: card.offsetHeight, collapsed: card.offsetHeight - heading.offsetHeight - gap, content: content.getBoundingClientRect(), visual: visual.getBoundingClientRect() };
	});
	const stackGap = parseFloat(getComputedStyle(items[0].intro).rowGap);
	let preceding = 0;
	const maximumStack = Math.max(...measurements.map(({ expanded, collapsed }, index) => {
		const total = preceding + expanded + index * stackGap;
		preceding += collapsed;
		return total;
	}));
	if (maximumStack > height - padding * 2 || measurements.some(({ content }) => content.height > height - padding * 2)) return;
	const panel = items[0].panel.getBoundingClientRect();
	const intro = items[0].intro.getBoundingClientRect();
	const visual = measurements[0].visual;
	const glowX = intro.right + Math.max(0, visual.left - intro.right) / 8;
	root.style.setProperty('--ads-sections-glow-x', `${glowX - panel.left}px`);
	root.style.setProperty('--ads-sections-glow-y', `${height / 2}px`);
	root.style.setProperty('--ads-sections-phone-left', `${visual.left - panel.left}px`);
	root.style.setProperty('--ads-sections-phone-top', `${visual.top - panel.top}px`);
	root.style.setProperty('--ads-sections-phone-width', `${visual.width}px`);
	root.style.setProperty('--ads-sections-item-phone-width', `${visual.width}px`);
	root.style.setProperty('--ads-sections-item-annotations-fade-duration', '0s');
	root.dataset.enhanced = '';
	root.dataset.pinning = 'fixed';
	root.dataset.stack = '';
	scene.append(...items.map(({ glow }) => glow), phoneLayout);
	const scrollDistanceMultiplier = 0.75;
	const distancePerPanel = height * 1.6 * scrollDistanceMultiplier;
	const annotations = items.map(({ visual }) => [...visual.querySelectorAll<HTMLElement>('.ads-sections-item__annotation')]);
	const headings = items.map(({ intro }) => intro.querySelector<HTMLElement>('.ads-sections-item__heading')!);
	const profileFor = (index: number) => desktopProfiles[Math.min(index, desktopProfiles.length - 1)];
	const relativeScale = (index: number) => items[index].intro.offsetWidth / 367;
	let active = -1;
	let animationFrom = -1;
	let animationTo = -1;
	let animation: gsap.core.Timeline | undefined;
	let requested = -1;
	let catchingUp = false;
	let speedTween: gsap.core.Tween | undefined;
	let velocityDecay: gsap.core.Tween | undefined;
	let velocityBoost = 1;
	let velocityDirection = 0;
	let backlogSpeed = 1;
	let lastPlaybackSpeed = Number.NaN;
	const catchUpSeconds = 0.5;
	const maximumSpeed = 8;
	const animationSpeedMultiplier = 1.25;
	const maximumVelocityBoost = 3;
	// Normalize velocity to scene heights/second so L, XL and XXL feel alike.
	const velocityStart = 1;
	const velocityFull = 4;
	const setPlaybackSpeed = (speed: number) => {
		if (!animation || (animation.reversed() ? animation.time() <= 0 : animation.time() >= animation.duration())) return;
		const direction = animation.reversed() ? -1 : 1;
		const anticipation = velocityDirection === direction ? velocityBoost : 1;
		const target = direction * animationSpeedMultiplier * Math.min(maximumSpeed, Math.max(1, speed, anticipation));
		if (Math.abs(target - lastPlaybackSpeed) < 0.05) return;
		lastPlaybackSpeed = target;
		speedTween?.kill();
		speedTween = gsap.to(animation, { timeScale: target, duration: 0.12, ease: 'power2.out', overwrite: true });
	};
	let trigger: ScrollTrigger;
	let introTrigger: ScrollTrigger;
	let ready = false;
	let context: gsap.Context;
	const resetVelocity = () => {
		velocityDecay?.kill();
		velocityBoost = 1;
		velocityDirection = 0;
	};
	const sampleVelocity = () => {
		const velocity = trigger.getVelocity();
		velocityDirection = Math.sign(velocity);
		const intensity = Math.min(1, Math.max(0, (Math.abs(velocity) / height - velocityStart) / (velocityFull - velocityStart)));
		velocityBoost = 1 + intensity * (maximumVelocityBoost - 1);
		context.add(() => {
			velocityDecay?.kill();
			// A pause removes anticipation, but retains any actual animation backlog.
			velocityDecay = gsap.delayedCall(0.25, () => {
				velocityBoost = 1;
				velocityDirection = 0;
				if (ready) context.add(() => setPlaybackSpeed(catchingUp ? backlogSpeed : 1));
			});
			setPlaybackSpeed(catchingUp ? backlogSpeed : 1);
		});
	};
	const updateAccess = () => items.forEach(({ content, visual, cards }, index) => {
		const visible = index === active && Number(gsap.getProperty(content, 'opacity')) >= 0.999;
		content.style.pointerEvents = visible ? '' : 'none';
		visual.setAttribute('aria-hidden', String(index !== active));
		cards.forEach((card) => card.querySelectorAll<HTMLElement>('a, button, input, select, textarea').forEach((control) => { control.inert = !visible; }));
	});
	const settle = (index: number) => {
		active = index;
		root.dataset.active = String(index);
		items.forEach(({ panel, intro, content, screen, glow, cards }, i) => {
			gsap.set(panel, { '--ads-sections-stack-reveal': i <= index ? 1 : 0, '--ads-sections-item-stack-collapse': i < index ? 1 : 0 });
			gsap.set(intro, { opacity: i <= index ? 1 : 0, scale: 1, x: 0, y: 0 });
			gsap.set(headings[i], { opacity: i < index ? 0 : 1, y: 0 });
			gsap.set(content, { opacity: i === index ? 1 : 0, scale: 1, x: 0, y: 0 });
			gsap.set(screen, { yPercent: i <= Math.max(0, index) ? 0 : 100 });
			gsap.set(glow, { y: i === index || (i === 0 && index < 0) ? 0 : i < index ? -height * 1.2 : height * 1.2 });
			cards.forEach((card) => gsap.set(panel, { [revealProperty(card)]: 1 }));
			annotations[i].forEach((card) => gsap.set(card, { opacity: i === index ? 1 : 0, x: 0, y: 0, scale: 1 }));
		});
		updateAccess();
	};
	const pose = (target: HTMLElement, node: string, index: number, scale: number) => {
		const profile = profileFor(index);
		const values: gsap.TweenVars = {};
		for (const [property, frames] of Object.entries(desktopMotionTracks[node] ?? {})) {
			if (property === 'height') continue;
			const current = frames.filter(([time]) => time <= profile.enter).at(-1)?.[1] ?? 0;
			const baseline = frames.filter(([time]) => time <= profile.rest).at(-1)?.[1] ?? 0;
			values[property] = ['x', 'y'].includes(property) ? (current - baseline) * scale : current;
		}
		gsap.set(target, values);
	};
	const entrance = (timeline: gsap.core.Timeline, index: number, at: number) => {
		const item = items[index];
		const profile = profileFor(index);
		const scale = relativeScale(index);
		// The first glow is already present. Start directly at the first card's
		// entrance, preserving all subsequent Figma staggers without the empty lead-in.
		const from = index === 0 ? desktopMotionTracks[profile.left].opacity[1][0] : profile.enter;
		const window = { from, to: profile.rest, at, rest: profile.rest, scale };
		pose(item.intro, profile.left, index, scale);
		pose(item.content, profile.right, index, scale);
		appendDesktopMotion(timeline, item.intro, profile.left, { ...window, properties: ['x', 'y', 'scaleX', 'scaleY', 'opacity'] });
		appendDesktopMotion(timeline, item.panel, profile.left, { ...window, properties: ['opacity'], map: (_, value) => ['--ads-sections-stack-reveal', value] });
		appendDesktopMotion(timeline, item.content, profile.right, window);
		annotations[index].forEach((card, rank) => {
			const node = profile.annotations[rank];
			const annotationScale = measurements[index].visual.width / 329;
			if (!node) {
				// This local annotation has no independent Figma track; show it with its stage.
				timeline.set(card, { opacity: 1 }, at + 0.21);
				return;
			}
			pose(card, node, index, annotationScale);
			appendDesktopMotion(timeline, card, node, { ...window, scale: annotationScale });
		});
		if (index > 0) {
			appendDesktopMotion(timeline, item.screen, profile.screen, {
				...window, properties: ['y'], map: (_, value) => {
					const frames = desktopMotionTracks[profile.screen].y;
					const rest = frames.filter(([time]) => time <= profile.rest).at(-1)![1];
					return ['yPercent', (value - rest) / 533 * 100];
				},
			});
		}
	};
	const exit = (timeline: gsap.core.Timeline, index: number) => {
		const item = items[index];
		const source = profileFor(index);
		// Later, locally added stages reuse the reviewed second-stage exit.
		const profile = source.title ? source : desktopProfiles[1];
		const window = { from: profile.exit, to: profile.end, at: 0, rest: profile.rest, scale: relativeScale(index) };
		appendDesktopMotion(timeline, item.panel, profile.left, {
			...window, properties: ['height'], map: (_, value) => ['--ads-sections-item-stack-collapse', (184 - value) / (184 - 77)],
		});
		appendDesktopMotion(timeline, headings[index], profile.title, window);
		appendDesktopMotion(timeline, item.content, profile.right, window);
		annotations[index].forEach((card, rank) => {
			const node = profile.annotations[rank];
			if (node) appendDesktopMotion(timeline, card, node, { ...window, scale: measurements[index].visual.width / 329 });
			else timeline.set(card, { opacity: 0 }, 0);
		});
		appendDesktopMotion(timeline, item.glow, profile.glow, { ...window, scale: height / 860 });
	};
	const select = (index: number, immediate = false) => {
		const previousRequest = requested;
		requested = index;
		if (index === active && !immediate) {
			// Returning to the stage already playing cancels the pending request in either direction.
			if (previousRequest !== active) context.add(() => { catchingUp = false; backlogSpeed = 1; setPlaybackSpeed(1); });
			return;
		}
		context.add(() => {
			if (immediate) {
				speedTween?.kill();
				catchingUp = false;
				backlogSpeed = 1;
				lastPlaybackSpeed = Number.NaN;
				resetVelocity();
				animation?.kill();
				animation = undefined;
				settle(index);
				return;
			}
			const movingForward = animation && !animation.reversed() && animation.progress() < 1;
			const movingBackward = animation && animation.reversed() && animation.progress() > 0;
			if (animation && ((index > active && movingForward) || (index < active && movingBackward))) {
				// Finish the current sequence from its actual progress, then serve only
				// the latest requested stage, in either scroll direction.
				catchingUp = true;
				const backlog = Math.abs(index - active);
				const remaining = animation.reversed() ? animation.time() : animation.duration() - animation.time();
				backlogSpeed = Math.min(maximumSpeed, Math.max(1, remaining * backlog / catchUpSeconds));
				setPlaybackSpeed(backlogSpeed);
				return;
			}
			speedTween?.kill();
			if (animation && index === animationFrom && active === animationTo) {
				active = index;
				root.dataset.active = String(index);
				catchingUp = false;
				backlogSpeed = 1;
				lastPlaybackSpeed = Number.NaN;
				animation.timeScale(animationSpeedMultiplier).reverse();
				setPlaybackSpeed(1);
				return;
			}
			if (animation && index === animationTo && active === animationFrom) {
				active = index;
				root.dataset.active = String(index);
				catchingUp = false;
				backlogSpeed = 1;
				lastPlaybackSpeed = Number.NaN;
				animation.timeScale(animationSpeedMultiplier).play();
				setPlaybackSpeed(1);
				return;
			}
			animation?.kill();
			// Always build the same lower-to-upper transition. Upward scroll plays
			// that exact sequence backward, even after reload, resize or an anchor jump.
			const backward = index < active;
			const previous = Math.min(active, index);
			const next = Math.max(active, index);
			settle(previous);
			for (let skipped = previous + 1; skipped < next; skipped++) {
				gsap.set(items[skipped].panel, { '--ads-sections-stack-reveal': 1, '--ads-sections-item-stack-collapse': 1 });
				gsap.set(items[skipped].intro, { opacity: 1, scale: 1, y: 0 });
				gsap.set(headings[skipped], { opacity: 0 });
			}
			animationFrom = previous;
			animationTo = next;
			active = index;
			root.dataset.active = String(index);
			const complete = (backward: boolean) => {
				if (!ready) return;
				context.add(() => {
					if (backward) settle(active);
					else updateAccess();
					if (requested !== active) select(requested);
					else { catchingUp = false; backlogSpeed = 1; speedTween?.kill(); lastPlaybackSpeed = Number.NaN; }
				});
			};
			animation = gsap.timeline({
				paused: true,
				onUpdate: updateAccess,
				onComplete: () => complete(false),
				onReverseComplete: () => complete(true),
			});
			if (previous >= 0) {
				exit(animation, previous);
				const incoming = profileFor(next);
				const outgoing = profileFor(previous);
				const overlap = next === previous + 1 && next <= 2 ? incoming.enter - outgoing.exit : 0.88;
				const glowDuration = next === 1 ? 1.815 : 1.673;
				const glowDistance = next === 1 ? 1016 : 1050;
				gsap.set(items[next].glow, { y: glowDistance * height / 860 });
				animation.to(items[next].glow, { y: 0, duration: glowDuration, ease: 'sine.inOut' }, 0);
				entrance(animation, next, overlap);
			} else {
				if (next > 0) animation.to(items[next].glow, { y: 0, duration: 1.673, ease: 'sine.inOut' }, 0);
				entrance(animation, next, 0);
			}
			// Reverse initialization renders the upper resting state without callbacks,
			// then traverses the very same tracks back to the lower state.
			if (backward) animation.progress(1, true).timeScale(animationSpeedMultiplier).reverse();
			else animation.timeScale(animationSpeedMultiplier).play(0);
			backlogSpeed = catchingUp ? Math.min(maximumSpeed, Math.max(1, animation.duration() / catchUpSeconds)) : 1;
			lastPlaybackSpeed = Number.NaN;
			setPlaybackSpeed(backlogSpeed);
		});
	};
	const syncFromScroll = (immediate = false) => {
		if (!ready || options.rebuilding() || isRefreshing()) return;
		const position = scrollY;
		if (!immediate && position >= introTrigger.start && position <= trigger.end) sampleVelocity();
		else resetVelocity();
		const index = position < introTrigger.start ? -1 : Math.min(items.length - 1, Math.max(0, Math.floor((position - trigger.start) / distancePerPanel)));
		select(index, immediate || position > trigger.end);
	};
	context = gsap.context(() => {
		items.forEach(({ panel, section }, index) => {
			const measure = measurements[index];
			section.style.setProperty('--ads-sections-item-stack-heading-height', `${measure.heading}px`);
			panel.style.setProperty('--ads-sections-stack-expanded-height', `${measure.expanded}px`);
			panel.style.setProperty('--ads-sections-stack-collapsed-height', `${measure.collapsed}px`);
			section.style.setProperty('--ads-sections-item-content-left', `${measure.content.left - root.getBoundingClientRect().left}px`);
			section.style.setProperty('--ads-sections-item-content-top', `${(height - measure.content.height) / 2}px`);
			section.style.setProperty('--ads-sections-item-content-width', `${measure.content.width}px`);
			section.style.setProperty('--ads-sections-item-visual-left', `${measure.visual.left - root.getBoundingClientRect().left}px`);
			section.style.setProperty('--ads-sections-item-visual-top', `${(height - measure.visual.height) / 2}px`);
			annotations[index].forEach((card) => {
				const end = card.classList.contains('ads-sections-item__annotation--top-end') || card.classList.contains('ads-sections-item__annotation--bottom-end');
				gsap.set(card, { xPercent: card.classList.contains('ads-sections-item__annotation--side-end') ? 100 : end ? 50 : -50 });
			});
		});
		settle(-1);
		trigger = ScrollTrigger.create({
			trigger: root, start: 'top top', end: `+=${distancePerPanel * items.length}`, pin: scene, pinSpacing: true,
			onUpdate: () => syncFromScroll(), onToggle: () => syncFromScroll(),
		});
		introTrigger = ScrollTrigger.create({ trigger: root, start: 'top 25%', end: 'bottom top', onUpdate: () => syncFromScroll(), onToggle: () => syncFromScroll() });
	}, root);
	ready = true;
	return {
		mode: 'pin', playback: 'panels', trigger: trigger!,
		active: () => active,
		panelScroll: (index) => trigger.start + (index + 0.25) * distancePerPanel,
		sync: (progress) => syncFromScroll(progress !== undefined),
		destroy: () => { ready = false; resetVelocity(); speedTween?.kill(); animation?.kill(); context.revert(); },
	};
}
