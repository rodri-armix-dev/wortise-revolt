import type { ComponentProps } from 'astro/types';
import type OrbitParticles from '../../molecules/OrbitParticles/OrbitParticles.astro';
import adMob from '../../../assets/pages/developers/admob-texture.png';
import mintegral from '../../../assets/pages/developers/mintegral-texture.png';
import pangle from '../../../assets/pages/developers/pangle-texture.png';
import liftoff from '../../../assets/pages/developers/liftoff-texture.png';
import ironSource from '../../../assets/pages/developers/ironsource-texture.png';
import adManager from '../../../assets/pages/developers/google-ad-manager-texture.png';
import gradientRing from '../../../assets/pages/developers/gradient-ring-texture.png';
import unity from '../../../assets/pages/developers/unity-texture.png';

import { particleMotion } from './particle-motion';

type Particle = ComponentProps<typeof OrbitParticles>['textured'][number];

export const particleFrames = {
	mobile: { width: 402, height: 520 },
	desktop: { width: 1312, height: 634 },
};

export const texturedParticles = [
	{ image: adMob, mobile: [32, 251, 76], desktop: [166, 159, 140], motion: particleMotion.adMob },
	{ image: mintegral, mobile: [128, 7, 69], desktop: [592, 43, 93, 106], motion: particleMotion.appNetwork },
	{ image: pangle, mobile: [195, 87, 73], desktop: [867, 82, 92, 105], motion: particleMotion.pangle },
	{ image: mintegral, mobile: [259, 385, 64], desktop: [914, 217, 93, 106], motion: particleMotion.tealMark },
	{ image: liftoff, mobile: [178, 313, 71], desktop: [711, 376, 126], motion: particleMotion.liftoff },
	{ image: ironSource, mobile: [300, 7, 60], desktop: [318, 313, 115, 104], motion: particleMotion.ironSource },
	{ image: adManager, mobile: [31, 96, 74], desktop: [375, 116, 156, 141], motion: particleMotion.adManager },
	{ image: gradientRing, mobile: [318, 139, 60], desktop: [949, 430, 115, 104], motion: particleMotion.gradientRing },
	{ image: adManager, mobile: [321, 271, 68], desktop: [1052, 177, 136, 123], motion: particleMotion.meta },
	{ image: unity, mobile: [76, 369, 82], desktop: [472, 467, 117, 107], motion: particleMotion.unity },
] satisfies Particle[];
