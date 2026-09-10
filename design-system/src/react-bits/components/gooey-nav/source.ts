import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GooeyNav',
  section: 'Components',
  page: 'https://reactbits.dev/components/gooey-nav',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/GooeyNav/GooeyNav.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/GooeyNav/GooeyNav.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop a person can set. `items` is not a control:
// the wrapper supplies PAGE_NAV. `particleDistances` is split into start
// and end so the Controls panel can set each number.
export const GOOEY_NAV_DEFAULTS = {
  animationTime: 600,
  particleCount: 15,
  particleDistanceStart: 90,
  particleDistanceEnd: 10,
  particleR: 100,
  timeVariance: 300,
  initialActiveIndex: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
