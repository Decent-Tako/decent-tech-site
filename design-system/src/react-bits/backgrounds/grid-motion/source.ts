import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GridMotion',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/grid-motion',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GridMotion/GridMotion.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GridMotion/GridMotion.tsx',
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
      why: 'The upstream file uses the gsap ticker to inertia-slide four rows from pointer X. Motion cannot own that ticker loop.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// items, paused, and onReady are not controls: the wrapper owns the Academy
// photographs, copy, pause, and ready. Colour default is brand ink #212121
// (upstream black).
export const GRID_MOTION_DEFAULTS = {
  gradientColor: '#212121',
  reducedMotion: 'never' as ReducedMotionMode,
};
