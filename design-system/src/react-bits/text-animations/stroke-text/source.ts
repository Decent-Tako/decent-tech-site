import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'StrokeText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/stroke-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/StrokeText/StrokeText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/StrokeText/StrokeText.tsx',
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
      why: 'The upstream file draws each glyph as an SVG stroke, then a gsap timeline wipes or fades the fill.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const STROKE_TRIGGERS = ['mount', 'hover', 'scroll', 'loop'] as const;
export const STROKE_FILL_MODES = ['wipe', 'fade', 'none'] as const;
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

// `text` uses the Week 0 title; upstream default is Draw Attention.
// className, style, paused, reduced, and onComplete are not controls.
// strokeColor is accent blue; upstream default #A78BFA. fillColor is ink;
// upstream default #F8FAFC.
export const STROKE_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  strokeColor: '#0035B1',
  fillColor: '#212121',
  strokeWidth: 1.4,
  drawDuration: 1.6,
  fillDelay: 0.2,
  stagger: 0.05,
  ease: 'power2.out',
  trigger: 'mount' as (typeof STROKE_TRIGGERS)[number],
  fillMode: 'wipe' as (typeof STROKE_FILL_MODES)[number],
  fontSize: 128,
  fontWeight: 800,
  letterSpacing: -4,
  reverse: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
