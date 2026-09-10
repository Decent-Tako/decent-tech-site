import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type PrismAnimationType = 'rotate' | 'hover' | '3drotate';

export const PRISM_ANIMATION_TYPES: readonly PrismAnimationType[] = [
  'rotate',
  'hover',
  '3drotate',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Prism',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/prism',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Prism/Prism.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Prism/Prism.tsx',
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
      why: 'The upstream file raymarches a glowing prism on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. offset is a pair of
// pixel shifts. hueShift is a rotation in degrees, not a colour token.
export const PRISM_DEFAULTS = {
  height: 3.5,
  baseWidth: 5.5,
  animationType: 'rotate' as PrismAnimationType,
  glow: 1,
  offset: { x: 0, y: 0 },
  noise: 0.5,
  transparent: true,
  scale: 3.6,
  hueShift: 0,
  colorFrequency: 1,
  hoverStrength: 2,
  inertia: 0.05,
  bloom: 1,
  suspendWhenOffscreen: false,
  timeScale: 0.5,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
