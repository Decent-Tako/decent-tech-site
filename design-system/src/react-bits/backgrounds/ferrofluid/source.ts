import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Ferrofluid',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/ferrofluid',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Ferrofluid/Ferrofluid.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Ferrofluid/Ferrofluid.tsx',
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
      why: 'The upstream file draws a ferrofluid field on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const FLOW_DIRECTIONS = ['up', 'down', 'left', 'right'] as const;

export type FlowDirection = (typeof FLOW_DIRECTIONS)[number];

// paused, onReady, and onError are not controls: the wrapper owns pause and ready.
// className, dpr, and mixBlendMode are not controls: the frame owns layout.
export const FERROFLUID_DEFAULTS = {
  colors: ['#0035B1', '#DEF54F', '#FFFFFF'] as string[],
  speed: 0.5,
  scale: 1.6,
  turbulence: 1,
  fluidity: 0.1,
  rimWidth: 0.2,
  sharpness: 2.5,
  shimmer: 1.5,
  glow: 2,
  flowDirection: 'down' as FlowDirection,
  opacity: 1,
  mouseInteraction: true,
  mouseStrength: 1,
  mouseRadius: 0.35,
  mouseDampening: 0.15,
  reducedMotion: 'never' as ReducedMotionMode,
};
