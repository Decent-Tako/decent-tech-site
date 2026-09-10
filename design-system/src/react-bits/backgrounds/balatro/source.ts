import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Balatro',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/balatro',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Balatro/Balatro.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Balatro/Balatro.tsx',
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
      why: 'The upstream file runs a pixel-filter spin shader on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls: the wrapper owns pause and ready.
export const BALATRO_DEFAULTS = {
  spinRotation: -2.0,
  spinSpeed: 7.0,
  offset: [0.0, 0.0] as [number, number],
  color1: '#DEF54F',
  color2: '#0035B1',
  color3: '#212121',
  contrast: 3.5,
  lighting: 0.4,
  spinAmount: 0.25,
  pixelFilter: 745.0,
  spinEase: 1.0,
  isRotate: false,
  mouseInteraction: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
