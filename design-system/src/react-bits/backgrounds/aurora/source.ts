import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Aurora',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/aurora',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Aurora/Aurora.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Aurora/Aurora.tsx',
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
      why: 'The upstream file draws a simplex-noise aurora on an ogl Renderer, Program, Mesh, Color, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// time is not a control: the wrapper drives it from the frame clock. paused,
// onReady, and onError are wrapper-owned.
export const AURORA_DEFAULTS = {
  colorStops: ['#0035B1', '#DEF54F', '#0035B1'] as string[],
  amplitude: 1.0,
  blend: 0.5,
  speed: 1.0,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
