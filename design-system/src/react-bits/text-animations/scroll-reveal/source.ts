import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ScrollReveal',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/scroll-reveal',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrollReveal/ScrollReveal.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'gsap',
      version: '3.15.0',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 6111,
      why: 'The upstream file scrubs rotation, opacity, and blur of each word with ScrollTrigger.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// children is the wrapper text. scrollContainerRef, paused, reduced, and
// onProgress are not controls. The wrapper owns the scroller.
export const SCROLL_REVEAL_DEFAULTS = {
  text: FEATURES[0].copy,
  enableBlur: true,
  baseOpacity: 0.1,
  baseRotation: 3,
  blurStrength: 4,
  containerClassName: '',
  textClassName: '',
  rotationEnd: 'bottom bottom',
  wordAnimationEnd: 'bottom bottom',
  reducedMotion: 'never' as ReducedMotionMode,
};
