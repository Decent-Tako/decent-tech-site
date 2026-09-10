import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const SPIRAL_DIRECTIONS = ['up', 'down'] as const;
export const SPIRAL_MODES = ['auto', 'drag', 'scroll', 'all'] as const;
export const SPIRAL_FITS = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const;

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'InfiniteSpiral',
  section: 'Components',
  page: 'https://reactbits.dev/components/infinite-spiral',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/InfiniteSpiral/InfiniteSpiral.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/InfiniteSpiral/InfiniteSpiral.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop a person can set. `items` and `className`
// are not controls: the wrapper supplies Academy photographs.
export const INFINITE_SPIRAL_DEFAULTS = {
  speed: 0.55,
  direction: 'up' as (typeof SPIRAL_DIRECTIONS)[number],
  animationMode: 'auto' as (typeof SPIRAL_MODES)[number],
  radius: 170,
  cardWidth: 100,
  cardHeight: 100,
  verticalSpacing: 60,
  perspective: 1000,
  cardsPerTurn: 7,
  rotation: 0,
  cardTilt: 0,
  cardRadius: 10,
  centerScale: 1.2,
  edgeFade: 0.3,
  edgeBlur: 6,
  pauseOnHover: true,
  imageFit: 'cover' as (typeof SPIRAL_FITS)[number],
  grayscale: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
