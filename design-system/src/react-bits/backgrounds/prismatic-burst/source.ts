import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type PrismaticBurstAnimationType = 'rotate' | 'rotate3d' | 'hover';

export const PRISMATIC_BURST_ANIMATION_TYPES: readonly PrismaticBurstAnimationType[] = [
  'rotate',
  'rotate3d',
  'hover',
];

export const PRISMATIC_BURST_BLEND_MODES = [
  'none',
  'normal',
  'lighten',
  'screen',
  'plus-lighter',
  'overlay',
] as const;

export type PrismaticBurstBlendMode = (typeof PRISMATIC_BURST_BLEND_MODES)[number];

export const PRISMATIC_BURST_COLORS = ['#0035B1', '#DEF54F', '#FFFFFF'];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PrismaticBurst',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/prismatic-burst',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/PrismaticBurst/PrismaticBurst.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/PrismaticBurst/PrismaticBurst.tsx',
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
      why: 'The upstream file draws a WebGL 2 burst of rays on an ogl Renderer, Program, Mesh, Triangle, and Texture. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. colours default to brand
// accent-blue, accent-yellow, and paper. Upstream leaves colors unset so
// the shader uses its built-in white ramp.
export const PRISMATIC_BURST_DEFAULTS = {
  intensity: 2,
  speed: 0.5,
  animationType: 'rotate3d' as PrismaticBurstAnimationType,
  colors: PRISMATIC_BURST_COLORS,
  distort: 0,
  offset: { x: 0, y: 0 },
  hoverDampness: 0,
  rayCount: 0,
  mixBlendMode: 'lighten' as PrismaticBurstBlendMode,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
