import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GradientWaves',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/gradient-waves',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GradientWaves/GradientWaves.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GradientWaves/GradientWaves.tsx',
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
      why: 'The upstream file raymarches plasma waves on an ogl WebGL 2 Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const WAVE_DETAILS = ['low', 'medium', 'high'] as const;
export type WaveDetail = (typeof WAVE_DETAILS)[number];

// paused, onReady, onError, and className are not controls.
export const GRADIENT_WAVES_DEFAULTS = {
  horizonColor: '#0035B1',
  waveColor: '#DEF54F',
  crestColor: '#FFFFFF',
  speed: 0.4,
  amplitude: 2.5,
  waveScale: 0.6,
  waveRatio: 0.9,
  swell: 35,
  turbulence: 20,
  tilt: 1.11,
  zoom: 1.0,
  height: 5.5,
  fogDepth: 15,
  detail: 'medium' as WaveDetail,
  brightness: 1.0,
  opacity: 1.0,
  mouseInteraction: true,
  parallaxStrength: 0.5,
  grain: true,
  grainIntensity: 0.05,
  reducedMotion: 'never' as ReducedMotionMode,
};
