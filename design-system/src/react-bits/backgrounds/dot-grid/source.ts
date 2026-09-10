import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DotGrid',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/dot-grid',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/DotGrid/DotGrid.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/DotGrid/DotGrid.tsx',
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
      why: 'The upstream file uses gsap and InertiaPlugin to push dots and return them. Motion cannot own that inertia tween.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// className, style, paused, onReady, and onError are not controls. Colour
// defaults are brand tokens: baseColor accent-blue, activeColor accent-yellow.
// Upstream both #5227FF.
export const DOT_GRID_DEFAULTS = {
  dotSize: 16,
  gap: 32,
  baseColor: '#0035B1',
  activeColor: '#DEF54F',
  proximity: 150,
  speedTrigger: 100,
  shockRadius: 250,
  shockStrength: 5,
  maxSpeed: 5000,
  resistance: 750,
  returnDuration: 1.5,
  reducedMotion: 'never' as ReducedMotionMode,
};
