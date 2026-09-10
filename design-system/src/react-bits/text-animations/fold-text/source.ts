import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FoldText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/fold-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/FoldText/FoldText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/FoldText/FoldText.tsx',
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
      why: 'The upstream file builds a gsap timeline that rotates each piece from a hinge into the page.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const FOLD_SPLITS = ['char', 'word', 'line'] as const;
export const FOLD_HINGES = ['top', 'bottom', 'left', 'right'] as const;
export const FOLD_TRIGGERS = ['mount', 'hover', 'scroll', 'loop'] as const;
export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power4.out',
  'power1.in',
  'power2.in',
  'power3.in',
  'power2.inOut',
  'back.out(1.7)',
  'elastic.out(1, 0.3)',
  'expo.out',
  'sine.inOut',
] as const;

// `text` uses the Week 0 title. className, style, paused, reduced, and
// onComplete are not controls. color is ink. fontWeight is 700.
export const FOLD_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  splitBy: 'char' as (typeof FOLD_SPLITS)[number],
  hinge: 'top' as (typeof FOLD_HINGES)[number],
  duration: 0.65,
  stagger: 0.045,
  ease: 'power3.out',
  perspective: 700,
  creaseShading: 0.55,
  trigger: 'mount' as (typeof FOLD_TRIGGERS)[number],
  fontSize: 80,
  fontWeight: 700,
  color: '#212121',
  reducedMotion: 'never' as ReducedMotionMode,
};
