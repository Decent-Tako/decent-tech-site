import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'AcidSquares',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/acid-squares',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/AcidSquares/AcidSquares.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/AcidSquares/AcidSquares.tsx',
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
      why: 'The upstream file builds a WebGL 2 ray-march on an ogl Renderer, Program, Mesh, Triangle, and RenderTarget. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const ACID_SQUARES_DETAILS = ['low', 'medium', 'high'] as const;

// One entry per upstream prop, with the upstream default. className, paused,
// onReady, and onError are not controls: the wrapper owns pause and ready.
export const ACID_SQUARES_DEFAULTS = {
  color1: '#0035B1',
  color2: '#DEF54F',
  color3: '#FFFFFF',
  detail: 'medium' as (typeof ACID_SQUARES_DETAILS)[number],
  speed: 0.7,
  waveDepth: 1,
  zoom: 1.3,
  density: 10.0,
  glow: 1.0,
  exposure: 2700,
  spread: 0.3,
  stepSize: 0.002,
  colorShift: 0,
  contrast: 1,
  brightness: 1.0,
  opacity: 1.0,
  mouseInteraction: true,
  mouseStrength: 0.1,
  mouseRadius: 0.35,
  blur: 0,
  grain: true,
  grainIntensity: 0.05,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
