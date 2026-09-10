import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DarkVeil',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/dark-veil',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/DarkVeil/DarkVeil.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/DarkVeil/DarkVeil.tsx',
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
      why: 'The upstream file draws a CPPN colour field on an ogl Renderer, Program, Mesh, Triangle, and Vec2. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls: the wrapper owns pause and ready.
export const DARK_VEIL_DEFAULTS = {
  hueShift: 0,
  noiseIntensity: 0,
  scanlineIntensity: 0,
  speed: 0.5,
  scanlineFrequency: 0,
  warpAmount: 0,
  resolutionScale: 1,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
