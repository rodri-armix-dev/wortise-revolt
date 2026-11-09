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
		let mode: Mode = 'auto';
		let phase: Phase = 'outside';
		let visible = false;
		let afterScene = false;

		const cancel = () => {
			context?.revert();
			context = undefined;
		};

		const play = (next: Phase, continueFromCurrent = false) => {
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
				const timeline = gsap.timeline({ repeat: next === 'idle' ? -1 : 0 });
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
					const exitDistanceSquared = endX ** 2 + endY ** 2;
					const segmentDuration = duration / (points.length - 1);
					const poses = points.map(([x, y], pointIndex) => {
						const progress = pointIndex / (points.length - 1);
						// Preserve the authored path while fitting the responsive entry and exit.
						const scale = 1 + (entryScale - 1) * (1 - progress);
						const convergence = focus && exitDistanceSquared ? (x * endX + y * endY) / exitDistanceSquared : 0;
						return {
							[translateX]: `${(x * scale + (targetX - endX) * convergence) / frame.width * 100}cqw`,
							[translateY]: `${(y * scale + (targetY - endY) * convergence) / frame.height * 100}cqh`,
							opacity: next === 'exit' ? Math.min(1, (1 - progress) / .25) : 1,
						};
					});

					const first = poses[0];
					const [currentX, currentY] = current[index] ?? [];
					gsap.set(item, {
						...first,
						[translateX]: currentX || first[translateX],
						[translateY]: currentY || first[translateY],
					});
					const keyframes = poses.slice(1).map((pose) => ({ ...pose, duration: segmentDuration, ease: 'none' }));
					if (next === 'idle') {
						// Close the loop from the last Figma sample to the first.
						keyframes.push({ ...first, duration: .3, ease: 'sine.inOut' });
					}
					timeline.to(item, { keyframes, ease: 'none' }, 0);
				});

				if (next === 'exit' && scene && accentDuration > 0) {
					gsap.set(scene, { [exitProgress]: '0%' });
					timeline.to(scene, {
						[exitProgress]: '100%',
						duration: accentDuration,
						ease: accentEase,
					}, duration - accentDuration);
				}

				if (next === 'enter') {
					timeline.eventCallback('onComplete', () => {
						if (mode === 'auto' && afterScene) play('exit', true);
						else play('idle');
					});
				}
			}, this);
		};

		const sync = () => {
			if (mode !== 'auto') return;
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
		this.addEventListener('change', () => play(mode === 'auto' ? phase : mode), { signal });
		reduced.addEventListener('change', () => play(phase), { signal });

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
