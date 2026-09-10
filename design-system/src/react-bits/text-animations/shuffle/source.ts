import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Shuffle',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/shuffle',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/Shuffle/Shuffle.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/Shuffle/Shuffle.tsx',
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
      why: 'The upstream file splits glyphs with SplitText, then a gsap timeline slides each strip to the real character. ScrollTrigger starts the play.',
      repo: 'https://github.com/greensock/GSAP',
    },
    {
      package: '@gsap/react',
      version: '2.1.2',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 19,
      why: 'The upstream file runs the split and timeline inside useGSAP so the effect cleans up with the React tree.',
      repo: 'https://github.com/greensock/react',
    },
  ],
};

export const SHUFFLE_DIRECTIONS = ['left', 'right', 'up', 'down'] as const;
export const SHUFFLE_MODES = ['random', 'evenodd'] as const;
export const SHUFFLE_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const;
export const SHUFFLE_ALIGNS = ['left', 'center', 'right'] as const;
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

// `text` uses the Week 0 title; upstream has no default. className, style,
// onShuffleComplete, paused, and reduced are not controls. colorFrom is ink
// and colorTo is accent blue; upstream has no default for either.
export const SHUFFLE_DEFAULTS = {
  text: FEATURES[0].title,
  shuffleDirection: 'right' as (typeof SHUFFLE_DIRECTIONS)[number],
  duration: 0.35,
  maxDelay: 0,
  ease: 'power3.out',
  threshold: 0.1,
  rootMargin: '-100px',
  tag: 'p' as (typeof SHUFFLE_TAGS)[number],
  textAlign: 'center' as (typeof SHUFFLE_ALIGNS)[number],
  shuffleTimes: 1,
  animationMode: 'evenodd' as (typeof SHUFFLE_MODES)[number],
  loop: false,
  loopDelay: 0,
  stagger: 0.03,
  scrambleCharset: '',
  colorFrom: '#212121',
  colorTo: '#0035B1',
  triggerOnce: true,
  respectReducedMotion: true,
  triggerOnHover: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
