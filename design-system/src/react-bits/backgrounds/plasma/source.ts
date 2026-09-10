import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Plasma',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/plasma',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Plasma/Plasma.tsx',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Plasma/Plasma.css',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'ogl',
      version: '1.0.11',
      licence: 'Unlicense',
      unpackedKb: 413,
      why: 'The upstream file raymarches the plasma in one WebGL 2 fragment shader on a full-screen triangle through the ogl Renderer, Program, and Mesh. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const PLASMA_DIRECTIONS = ['forward', 'reverse', 'pingpong'] as const;

// One entry per upstream prop, with the upstream default. The colour
// default is brand accent yellow; upstream is #ffffff.
export const PLASMA_DEFAULTS = {
  color: '#DEF54F',
  speed: 1,
  direction: 'forward' as (typeof PLASMA_DIRECTIONS)[number],
  scale: 1,
  opacity: 1,
  mouseInteractive: true,
  renderScale: 0.55,
  maxDpr: 1.5,
  targetFps: 60,
  iterations: 60,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
