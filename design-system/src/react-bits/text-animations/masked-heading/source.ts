import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'MaskedHeading',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/masked-heading',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/MaskedHeading/MaskedHeading.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/MaskedHeading/MaskedHeading.tsx',
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
      why: 'The upstream file reveals clipped glyphs with a gsap rise, wipe, or fade.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const MASKED_TAGS = ['h1', 'h2', 'h3', 'p'] as const;
export const MASKED_MEDIA = ['image', 'video'] as const;
export const MASKED_REVEALS = ['rise', 'wipe', 'fade', 'none'] as const;
export const MASKED_TRIGGERS = ['view', 'mount', 'hover'] as const;
export const MASKED_ALIGNS = ['left', 'center', 'right'] as const;

// `text` uses the Week 0 title. `src` is the Week 0 photograph. className,
// style, paused, reduced, onOffset, onReady, and the rest bag are not
// controls. `alt` is local.
export const MASKED_HEADING_DEFAULTS = {
  text: FEATURES[0].title,
  tag: 'h2' as (typeof MASKED_TAGS)[number],
  mediaType: 'image' as (typeof MASKED_MEDIA)[number],
  src: FEATURES[0].photo.src,
  poster: '',
  fillScale: 1.25,
  parallax: 26,
  drift: 18,
  brightness: 1,
  saturation: 1,
  grayscale: false,
  reveal: 'rise' as (typeof MASKED_REVEALS)[number],
  duration: 1.1,
  stagger: 0.09,
  trigger: 'view' as (typeof MASKED_TRIGGERS)[number],
  align: 'center' as (typeof MASKED_ALIGNS)[number],
  weight: 700,
  tracking: -0.03,
  lineHeight: 1.06,
  textScale: 0.115,
  reducedMotion: 'never' as ReducedMotionMode,
};
