import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import type { ComponentProps } from 'astro/types';
import type OrbitParticlesComponent from './OrbitParticles.astro';

type Props = ComponentProps<typeof OrbitParticlesComponent>;
type Motion = Props['textured'][number]['motion'];
type Phase = keyof Motion | 'outside';
type Mode = Phase | 'auto';

gsap.registerPlugin(CustomEase);
const accentEase = CustomEase.create('orbit-particles-accent', '0.5,0,0.5,1');
const translateX = '--orbit-particles-translate-x';
const translateY = '--orbit-particles-translate-y';
const exitProgress = '--orbit-particles-exit-progress';

class OrbitParticles extends HTMLElement {
	private cleanup?: () => void;

	connectedCallback() {
		this.cleanup?.();
		const frame = JSON.parse(this.dataset.motionFrame!) as Props['frames']['desktop'];
		const durations = JSON.parse(this.dataset.motionDurations!) as Props['durations'];
		const scene = this.parentElement;
		const target = scene?.querySelector<HTMLElement>('[data-orbit-motion-target]');
		const accentDuration = Number(target?.dataset.orbitMotionAccent ?? 0) / 1000;
		const layers = [...this.querySelectorAll<HTMLElement>('.orbit-particles__layer')];
		const particles = [...this.querySelectorAll<HTMLElement>('[data-particle-motion]')].map((item) => ({
			item,
			motion: JSON.parse(item.dataset.particleMotion!) as Motion,
		}));
		const reduced = matchMedia('(prefers-reduced-motion: reduce)');
		const events = new AbortController();
		const { signal } = events;
		let context: gsap.Context | undefined;
		let timeline: gsap.core.Timeline | undefined;
		let mode: Mode = 'auto';
		let phase: Phase = 'outside';
		let visible = false;
		let afterScene = false;

		const cancel = () => {
			context?.revert();
			context = undefined;
			timeline = undefined;
		};

		const play = (next: Phase, continueFromCurrent = false, paused = false) => {
			const activeLayer = layers.find((layer) => layer.offsetWidth > 0);
			const active = particles.filter(({ item }) => item.parentElement === activeLayer);
			const current = continueFromCurrent
				? active.map(({ item }) => [item.style.getPropertyValue(translateX), item.style.getPropertyValue(translateY)])
				: [];
			cancel();
			phase = reduced.matches && next === 'enter' ? 'idle' : next;
			this.dataset.motionPhase = phase;
			if (next === 'outside' || !activeLayer || reduced.matches) return;

			const stage = this.getBoundingClientRect();
			const { width, height } = stage;
			const bounds = active.map(({ item }) => item.getBoundingClientRect());
			const focus = next === 'exit' ? target?.getBoundingClientRect() : undefined;
			const duration = durations[next] / 1000;
			context = gsap.context(() => {
				const animation = gsap.timeline({ paused, repeat: next === 'idle' ? -1 : 0 });
				timeline = animation;
				if (next === 'enter') {
					animation.fromTo(activeLayer, { opacity: 0 }, { opacity: 1, duration: Math.min(.15, duration), ease: 'power1.out' }, 0);
				}
				active.forEach(({ item, motion }, index) => {
					const points = motion[next];
					const box = bounds[index];
					let entryScale = 1;
					if (next === 'enter') {
						const [x, y] = points[0];
						// Extend the same entry ray if the responsive placement starts inside the scene.
						const distanceX = x < 0 ? box.right - stage.left : stage.right - box.left;
						const distanceY = y < 0 ? box.bottom - stage.top : stage.bottom - box.top;
						entryScale = Math.max(1, Math.min(
							x === 0 ? Infinity : (distanceX + 1) * frame.width / (width * Math.abs(x)),
							y === 0 ? Infinity : (distanceY + 1) * frame.height / (height * Math.abs(y)),
						));
					}
					const [endX, endY] = points.at(-1)!;
					const targetX = focus ? (focus.x + focus.width / 2 - box.x - box.width / 2) * frame.width / width : endX;
					const targetY = focus ? (focus.y + focus.height / 2 - box.y - box.height / 2) * frame.height / height : endY;
					const [startX, startY] = focus && this.dataset.orbitSequencePhase ? points[0] : [0, 0];
					const exitX = endX - startX;
					const exitY = endY - startY;
					const exitDistanceSquared = exitX ** 2 + exitY ** 2;
					const segmentDuration = duration / (points.length - 1);
					const [currentX, currentY] = current[index] ?? [];
					const freeExit = next === 'exit' && this.hasAttribute('data-orbit-sequence-free-idle');
					const offsetX = freeExit && currentX ? parseFloat(currentX) * frame.width / 100 - startX : 0;
					const offsetY = freeExit && currentY ? parseFloat(currentY) * frame.height / 100 - startY : 0;
					const poses = points.map(([x, y], pointIndex) => {
						const progress = pointIndex / (points.length - 1);
						// Preserve the authored path while fitting the responsive entry and exit.
						const scale = 1 + (entryScale - 1) * (1 - progress);
						const blend = Math.max(0, 1 - progress / .4);
						const continuity = blend * blend * (3 - 2 * blend);
						const convergence = focus && exitDistanceSquared ? ((x - startX) * exitX + (y - startY) * exitY) / exitDistanceSquared : 0;
						return {
							[translateX]: `${(x * scale + offsetX * continuity + (targetX - endX) * convergence) / frame.width * 100}cqw`,
							[translateY]: `${(y * scale + offsetY * continuity + (targetY - endY) * convergence) / frame.height * 100}cqh`,
							opacity: next === 'exit' ? Math.min(1, (1 - progress) / .25) : 1,
						};
					});

					const first = poses[0];
					gsap.set(item, {
						...first,
						[translateX]: currentX || first[translateX],
						[translateY]: currentY || first[translateY],
					});
					const keyframes = poses.slice(1).map((pose) => ({ ...pose, duration: segmentDuration, ease: 'none' }));
					if (next === 'idle' && !this.dataset.orbitSequencePhase) {
						// Close the loop from the last Figma sample to the first.
						keyframes.push({ ...first, duration: .3, ease: 'sine.inOut' });
					}
					animation.to(item, { keyframes, ease: 'none' }, 0);
				});

				if (next === 'exit' && scene && accentDuration > 0) {
					gsap.set(scene, { [exitProgress]: '0%' });
					animation.to(scene, {
						[exitProgress]: '100%',
						duration: accentDuration,
						ease: accentEase,
					}, duration - accentDuration);
				}

				if (next === 'enter') {
					animation.eventCallback('onComplete', () => {
						if (mode === 'auto' && afterScene && this.dataset.orbitSequenceProgress === undefined) play('exit', true);
						else play('idle');
					});
				}
			}, this);
		};

		let wasDriven = false;
		let idleTime = 0;
		const drivenPhase = () => this.dataset.orbitSequencePhase as 'enter' | 'idle' | 'exit' | undefined;
		const sync = () => {
			if (mode !== 'auto') return;
			const sequenceProgress = this.dataset.orbitSequenceProgress;
			const requestedPhase = drivenPhase();
			if (requestedPhase && sequenceProgress !== undefined) {
				wasDriven = true;
				const freeIdle = this.hasAttribute('data-orbit-sequence-free-idle');
				if (freeIdle && requestedPhase === 'idle') {
					if (phase !== 'idle') {
						const returning = phase === 'exit';
						play('idle', false, true);
						timeline?.time(returning ? idleTime : 0, true);
					}
					timeline?.paused(!visible);
					return;
				}
				if (phase !== requestedPhase) {
					const fromIdle = freeIdle && phase === 'idle' && requestedPhase === 'exit';
					if (fromIdle) idleTime = timeline?.time() ?? 0;
					play(requestedPhase, fromIdle, true);
				}
				timeline?.pause().progress(Number(sequenceProgress), true);
				return;
			}
			if (wasDriven) {
				wasDriven = false;
				play('outside');
			}
			if (sequenceProgress !== undefined) {
				const progress = Number(sequenceProgress);
				if (progress > 0) {
					if (phase !== 'exit') play('exit', false, true);
					timeline?.progress(progress);
				} else if (phase === 'exit') play(visible ? 'idle' : 'outside');
				else if (visible && phase === 'outside') play('enter');
				else if (!visible && phase !== 'outside') play('outside');
				return;
			}
			if (afterScene && phase === 'idle') play('exit', true);
			else if (visible && (phase === 'outside' || phase === 'exit')) play('enter');
			else if (!afterScene && !visible && phase !== 'outside') play('outside');
		};
		const observer = new IntersectionObserver(([entry]) => {
			afterScene = entry.boundingClientRect.bottom <= entry.boundingClientRect.height * .65
				&& entry.boundingClientRect.top < 0;
			visible = entry.isIntersecting && entry.intersectionRatio >= .25 && !afterScene;
			sync();
		}, { threshold: [0, .25, .65] });
		observer.observe(this);
		this.addEventListener('orbit-sequence', sync, { signal });
		sync();

		const buttons = [...this.querySelectorAll<HTMLButtonElement>('[data-motion-preview]')];
		for (const button of buttons) {
			button.addEventListener('click', () => {
				mode = button.dataset.motionPreview as Mode;
				for (const option of buttons) option.setAttribute('aria-pressed', String(option === button));
				if (mode === 'auto') {
					play('outside');
					sync();
				} else {
					play(mode, phase === 'idle' && mode === 'exit');
				}
			}, { signal });
		}
		const refresh = () => {
			const requestedPhase = drivenPhase();
			if (mode === 'auto' && requestedPhase) {
				play(requestedPhase, false, true);
				sync();
			} else if (mode === 'auto' && Number(this.dataset.orbitSequenceProgress) > 0) {
				play('exit', false, true);
				sync();
			} else play(mode === 'auto' ? phase : mode);
		};
		this.addEventListener('change', refresh, { signal });
		reduced.addEventListener('change', refresh, { signal });

		this.cleanup = () => {
			events.abort();
			observer.disconnect();
			cancel();
			this.dataset.motionPhase = 'outside';
		};
	}

	disconnectedCallback() {
		this.cleanup?.();
	}
}

if (!customElements.get('orbit-particles')) customElements.define('orbit-particles', OrbitParticles);
