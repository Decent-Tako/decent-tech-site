import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GradientBlinds',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/gradient-blinds',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GradientBlinds/GradientBlinds.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GradientBlinds/GradientBlinds.tsx',
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
      why: 'The upstream file draws striped gradient blinds on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const SHINE_DIRECTIONS = ['left', 'right'] as const;
export type ShineDirection = (typeof SHINE_DIRECTIONS)[number];

// paused, onReady, onError, className, dpr, and mixBlendMode are not
// controls: the wrapper owns pause, ready, and the stage.
export const GRADIENT_BLINDS_DEFAULTS = {
  gradientColors: ['#0035B1', '#DEF54F'] as string[],
  angle: 0,
  noise: 0.3,
  blindCount: 16,
  blindMinWidth: 60,
  mouseDampening: 0.15,
  mirrorGradient: false,
  spotlightRadius: 0.5,
  spotlightSoftness: 1,
  spotlightOpacity: 1,
  distortAmount: 0,
  shineDirection: 'left' as ShineDirection,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
