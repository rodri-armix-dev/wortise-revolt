import type { ComponentProps } from 'astro/types';
import type OrbitParticles from '../../molecules/OrbitParticles/OrbitParticles.astro';
import adManager from '../../../assets/admonet/particles/google-ad-manager-mark.png';
import appNetwork from '../../../assets/admonet/particles/app-network-mark.png';
import redMark from '../../../assets/admonet/particles/red-mark.png';
import ironSource from '../../../assets/admonet/particles/ironsource-mark.png';
import gradientRing from '../../../assets/admonet/particles/gradient-ring-mark.png';
import adMob from '../../../assets/admonet/particles/admob-mark.png';
import unity from '../../../assets/admonet/particles/unity-mark.png';
import liftoff from '../../../assets/admonet/particles/liftoff-mark.png';
import tealMark from '../../../assets/admonet/particles/teal-mark.png';
import meta from '../../../assets/admonet/particles/meta-mark.png';

import { particleMotion } from './particle-motion';

type Particle = ComponentProps<typeof OrbitParticles>['textured'][number];

export const glassParticles = [
	{ image: adManager, mobile: [41, 105, 54], desktop: [401, 134, 104], motion: particleMotion.adManager },
	{ image: appNetwork, mobile: [136, 14, 53], desktop: [601, 58, 76], monochrome: true, motion: particleMotion.appNetwork },
	{ image: redMark, mobile: [203, 95, 57], desktop: [874, 96, 78], markWidth: 60, motion: particleMotion.pangle },
	{ image: ironSource, mobile: [307, 14, 46], desktop: [337, 327, 76], monochrome: true, markWidth: 58, motion: particleMotion.ironSource },
	{ image: gradientRing, mobile: [325, 145, 46], desktop: [969, 445, 76], markWidth: 62, motion: particleMotion.gradientRing },
	{ image: adMob, mobile: [41, 260, 58], desktop: [187, 180, 98], markWidth: 54, motion: particleMotion.adMob },
	{ image: unity, mobile: [85, 378, 64], desktop: [490, 480, 82], monochrome: true, markWidth: 62, motion: particleMotion.unity },
	{ image: liftoff, mobile: [187, 321, 53], desktop: [729, 394, 90], markWidth: 44, motion: particleMotion.liftoff },
	{ image: tealMark, mobile: [266, 393, 49], desktop: [913, 229, 80], motion: particleMotion.tealMark },
	{ image: meta, mobile: [330, 279, 50], desktop: [1075, 194, 90], markWidth: 80, motion: particleMotion.meta },
] satisfies Particle[];
