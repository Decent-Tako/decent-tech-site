import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import type { RaysOrigin } from '../../vendor/backgrounds/light-rays/LightRays';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LightRays',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/light-rays',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LightRays/LightRays.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LightRays/LightRays.tsx',
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
      why: 'The upstream file draws God rays on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const RAYS_ORIGINS = [
  'top-center',
  'top-left',
  'top-right',
  'right',
  'left',
  'bottom-center',
  'bottom-right',
  'bottom-left',
] as const satisfies readonly RaysOrigin[];

// className, paused, onReady, and onError are not controls. Colour default
// is brand accent-yellow #DEF54F (upstream #ffffff).
export const LIGHT_RAYS_DEFAULTS = {
  raysOrigin: 'top-center' as RaysOrigin,
  raysColor: '#DEF54F',
  raysSpeed: 1,
  lightSpread: 1,
  rayLength: 2,
  pulsating: false,
  fadeDistance: 1.0,
  saturation: 1.0,
  followMouse: true,
  mouseInfluence: 0.1,
  noiseAmount: 0.0,
  distortion: 0.0,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
