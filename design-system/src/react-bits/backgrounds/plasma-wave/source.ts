import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PlasmaWave',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/plasma-wave',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/PlasmaWave/PlasmaWave.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/PlasmaWave/PlasmaWave.tsx',
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
      why: 'The upstream file raymarches two bent tubes on an ogl Renderer, Camera, Transform, Program, Mesh, and Geometry. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. Colour defaults are brand
// tokens: #0035B1 and #DEF54F (upstream #A855F7, #06B6D4).
export const PLASMA_WAVE_DEFAULTS = {
  xOffset: 0,
  yOffset: 0,
  rotationDeg: 0,
  focalLength: 0.8,
  speed1: 0.05,
  speed2: 0.05,
  dir2: 1.0,
  bend1: 1,
  bend2: 0.5,
  colors: ['#0035B1', '#DEF54F'] as [string, string],
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
