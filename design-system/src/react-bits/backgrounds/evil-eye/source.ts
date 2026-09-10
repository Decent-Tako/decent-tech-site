import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'EvilEye',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/evil-eye',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/EvilEye/EvilEye.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/EvilEye/EvilEye.tsx',
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
      why: 'The upstream file draws a polar noise iris on an ogl Renderer, Program, Mesh, Triangle, and Texture. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. Colour defaults are brand
// tokens: eyeColor accent-yellow (upstream #FF6F37), backgroundColor ink
// (upstream #000000).
export const EVIL_EYE_DEFAULTS = {
  eyeColor: '#DEF54F',
  intensity: 1.5,
  pupilSize: 0.6,
  irisWidth: 0.25,
  glowIntensity: 0.35,
  scale: 0.8,
  noiseScale: 1.0,
  pupilFollow: 1.0,
  flameSpeed: 1.0,
  backgroundColor: '#212121',
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
