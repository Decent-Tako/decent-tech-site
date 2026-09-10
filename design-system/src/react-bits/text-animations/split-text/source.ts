import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SplitText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/split-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/SplitText/SplitText.tsx',
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
      why: 'The upstream file splits the paragraph with SplitText and tweens each unit from opacity 0. ScrollTrigger starts the play.',
      repo: 'https://github.com/greensock/GSAP',
    },
    {
      package: '@gsap/react',
      version: '2.1.2',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 19,
      why: 'The upstream file runs the split and tween inside useGSAP so the effect cleans up with the React tree.',
      repo: 'https://github.com/greensock/react',
    },
  ],
};

export const SPLIT_TEXT_TYPES = ['chars', 'words', 'lines', 'words, chars'] as const;
export const SPLIT_TEXT_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const;
export const SPLIT_TEXT_ALIGNS = ['left', 'center', 'right'] as const;
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

// `text` uses the Week 0 copy; upstream has no default. className,
// onLetterAnimationComplete, paused, and reduced are not controls.
export const SPLIT_TEXT_DEFAULTS = {
  text: FEATURES[0].copy,
  delay: 50,
  duration: 1.25,
  ease: 'power3.out',
  splitType: 'chars' as (typeof SPLIT_TEXT_TYPES)[number],
  from: { opacity: 0, y: 40 },
  to: { opacity: 1, y: 0 },
  threshold: 0.1,
  rootMargin: '-100px',
  textAlign: 'center' as (typeof SPLIT_TEXT_ALIGNS)[number],
  tag: 'p' as (typeof SPLIT_TEXT_TAGS)[number],
  reducedMotion: 'never' as ReducedMotionMode,
};
