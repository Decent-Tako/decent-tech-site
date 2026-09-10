import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type SlicedWavesOrientation = 'horizontal' | 'vertical';

export const SLICED_WAVES_ORIENTATIONS: readonly SlicedWavesOrientation[] = [
  'horizontal',
  'vertical',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SlicedWaves',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/sliced-waves',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/SlicedWaves/SlicedWaves.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/SlicedWaves/SlicedWaves.tsx',
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
      why: 'The upstream file draws a sliced bar-wave field on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, onError, and className are not controls. Colour defaults
// are brand tokens: color1 accent-yellow #DEF54F (upstream #FF9FFC), color2
// accent-blue #0035B1 (upstream #5227FF), color3 paper #FFFFFF (upstream #B497CF).
export const SLICED_WAVES_DEFAULTS = {
  color1: '#DEF54F',
  color2: '#0035B1',
  color3: '#FFFFFF',
  columns: 14,
  rows: 8,
  barThickness: 0.1,
  speed: 0.35,
  travel: 0.7,
  waveSpread: 0.9,
  rowOffset: 1.0,
  softness: 0.05,
  glow: 0,
  brightness: 1.0,
  contrast: 1.0,
  opacity: 0.5,
  orientation: 'horizontal' as SlicedWavesOrientation,
  alternate: false,
  mouseInteraction: true,
  mouseStrength: 1,
  mouseRadius: 0.3,
  grain: true,
  grainIntensity: 0.05,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
