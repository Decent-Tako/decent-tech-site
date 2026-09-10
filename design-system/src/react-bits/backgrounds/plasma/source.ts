import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type PlasmaDirection = 'forward' | 'reverse' | 'pingpong';

export const PLASMA_DIRECTIONS: readonly PlasmaDirection[] = [
  'forward',
  'reverse',
  'pingpong',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Plasma',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/plasma',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Plasma/Plasma.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Plasma/Plasma.tsx',
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
      why: 'The upstream file raymarches a plasma tube on an ogl WebGL 2 Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. Colour default is brand
// accent-blue #0035B1 (upstream #ffffff).
export const PLASMA_DEFAULTS = {
  color: '#0035B1',
  speed: 1,
  direction: 'forward' as PlasmaDirection,
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
