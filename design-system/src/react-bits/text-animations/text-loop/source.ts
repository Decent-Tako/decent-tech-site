import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'TextLoop',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/text-loop',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TextLoop/TextLoop.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TextLoop/TextLoop.tsx',
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
      why: 'The upstream file tweens SVG textPath startOffset along a built path so the phrase loops without a seam.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const TEXT_LOOP_SHAPES = ['wave', 'circle', 'infinity', 'arch', 'line'] as const;
export const TEXT_LOOP_DIRECTIONS = ['forward', 'reverse'] as const;

// `text` uses the Week 0 title; upstream default is React ✦ Bits. path,
// className, style, paused, reduced, and onOffset are not controls. color is
// ink; upstream default #ffffff. ribbonColor is accent blue; upstream default
// #5227FF.
export const TEXT_LOOP_DEFAULTS = {
  text: FEATURES[0].title,
  shape: 'wave' as (typeof TEXT_LOOP_SHAPES)[number],
  speed: 90,
  direction: 'forward' as (typeof TEXT_LOOP_DIRECTIONS)[number],
  separator: '✦',
  curviness: 90,
  fontSize: 46,
  fontWeight: 800,
  letterSpacing: 2,
  uppercase: true,
  color: '#212121',
  ribbon: true,
  ribbonColor: '#0035B1',
  ribbonWidth: 86,
  pauseOnHover: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
