import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Crosshair',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/crosshair',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Crosshair/Crosshair.tsx',
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
      why: 'The upstream file lerps two lines to the pointer and plays an SVG turbulence burst on link hover. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// containerRef is not a control: the wrapper binds it to the stage.
export const CROSSHAIR_DEFAULTS = {
  // Brand paper. Upstream default white.
  color: '#FFFFFF',
  reducedMotion: 'never' as ReducedMotionMode,
};
