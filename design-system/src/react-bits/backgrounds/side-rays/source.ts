import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type SideRaysOrigin = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export const SIDE_RAYS_ORIGINS: readonly SideRaysOrigin[] = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SideRays',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/side-rays',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/SideRays/SideRays.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/SideRays/SideRays.tsx',
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
      why: 'The upstream file draws animated side rays on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, onError, and className are not controls. rayColor1
// default is brand accent-yellow #DEF54F (upstream #EAB308). rayColor2
// is brand paper #FFFFFF (upstream #96c8ff).
export const SIDE_RAYS_DEFAULTS = {
  speed: 2.5,
  rayColor1: '#DEF54F',
  rayColor2: '#FFFFFF',
  intensity: 2,
  spread: 2,
  origin: 'top-right' as SideRaysOrigin,
  tilt: 0,
  saturation: 1.5,
  blend: 0.75,
  falloff: 1.6,
  opacity: 1.0,
  reducedMotion: 'never' as ReducedMotionMode,
};
