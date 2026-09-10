import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'MorphSlider',
  section: 'Components',
  page: 'https://reactbits.dev/components/morph-slider',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/MorphSlider/MorphSlider.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/MorphSlider/MorphSlider.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'ogl',
      version: '1.0.11',
      licence: 'Unlicense',
      unpackedKb: 413,
      why: 'The upstream file draws the morph in a WebGL shader through ogl Renderer, Triangle, Program, Mesh, and Texture.',
      repo: 'https://github.com/oframe/ogl',
    },
    {
      package: 'gsap',
      version: '3.15.0',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 6111,
      why: 'The upstream file tweens uProgress for each slide change. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const MORPH_TRANSITIONS = ['melt', 'ripple', 'shear', 'swirl'] as const;

export type MorphTransition = (typeof MORPH_TRANSITIONS)[number];

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power2.inOut',
  'power3.inOut',
  'back.out(1.7)',
  'expo.out',
  'sine.inOut',
] as const;

// One entry per upstream prop a person can set. `items` is not a control:
// the wrapper supplies FEATURES photographs. overlayColor maps to ink.
export const MORPH_SLIDER_DEFAULTS = {
  startIndex: 0,
  transition: 'melt' as MorphTransition,
  duration: 1.1,
  ease: 'power2.inOut',
  intensity: 0.55,
  scale: 2.4,
  aberration: 0.35,
  drift: 0.4,
  autoplay: false,
  autoplayDelay: 4,
  loop: true,
  radius: 16,
  overlayColor: '#212121',
  showCaptions: true,
  showControls: true,
  showIndicators: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
