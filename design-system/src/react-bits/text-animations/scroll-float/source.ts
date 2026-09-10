import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ScrollFloat',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/scroll-float',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrollFloat/ScrollFloat.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrollFloat/ScrollFloat.tsx',
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
      why: 'The upstream file scrubs a fromTo tween of each glyph with ScrollTrigger as the scroller moves.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'back.inOut(2)',
  'back.out(1.7)',
  'elastic.out(1, 0.3)',
  'expo.out',
  'sine.inOut',
] as const;

// children is the wrapper text. scrollContainerRef, paused, reduced, and
// onProgress are not controls. The wrapper owns the scroller.
export const SCROLL_FLOAT_DEFAULTS = {
  text: FEATURES[0].title,
  containerClassName: '',
  textClassName: '',
  animationDuration: 1,
  ease: 'back.inOut(2)',
  scrollStart: 'center bottom+=50%',
  scrollEnd: 'bottom bottom-=40%',
  stagger: 0.03,
  reducedMotion: 'never' as ReducedMotionMode,
};
