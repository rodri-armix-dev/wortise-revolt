import type { ComponentProps } from 'astro/types';
import type OrbitParticles from '../../molecules/OrbitParticles/OrbitParticles.astro';
import adManager from '../../../assets/pages/developers/google-ad-manager-mark.webp';
import appNetwork from '../../../assets/pages/developers/app-network-mark.webp';
import redMark from '../../../assets/pages/developers/red-mark.webp';
import ironSource from '../../../assets/pages/developers/ironsource-mark.webp';
import gradientRing from '../../../assets/pages/developers/gradient-ring-mark.png';
import adMob from '../../../assets/pages/developers/admob-mark.webp';
import unity from '../../../assets/pages/developers/unity-mark.webp';
import liftoff from '../../../assets/pages/developers/liftoff-mark.webp';
import tealMark from '../../../assets/pages/developers/teal-mark.webp';
import meta from '../../../assets/pages/developers/meta-mark.webp';

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
