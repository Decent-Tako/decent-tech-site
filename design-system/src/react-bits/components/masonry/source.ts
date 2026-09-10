import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Masonry',
  section: 'Components',
  page: 'https://reactbits.dev/components/masonry',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Masonry/Masonry.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Masonry/Masonry.tsx',
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
      why: 'The upstream file uses gsap.fromTo to place tiles and gsap.to for hover scale. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const MASONRY_FROM = ['bottom', 'top', 'left', 'right', 'center', 'random'] as const;

export type MasonryFrom = (typeof MASONRY_FROM)[number];

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

// One entry per upstream prop a person can set. `items` and `onItemClick`
// are not controls: the wrapper supplies FEATURES photographs.
export const MASONRY_DEFAULTS = {
  ease: 'power3.out',
  duration: 0.6,
  stagger: 0.05,
  animateFrom: 'bottom' as MasonryFrom,
  scaleOnHover: true,
  hoverScale: 0.95,
  blurToFocus: true,
  colorShiftOnHover: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
