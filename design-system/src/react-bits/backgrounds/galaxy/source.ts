import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Galaxy',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/galaxy',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Galaxy/Galaxy.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Galaxy/Galaxy.tsx',
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
      why: 'The upstream file draws layered stars on an ogl Renderer, Program, Mesh, Color, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls: the wrapper owns pause and ready.
export const GALAXY_DEFAULTS = {
  focal: [0.5, 0.5] as [number, number],
  rotation: [1.0, 0.0] as [number, number],
  starSpeed: 0.5,
  density: 1,
  hueShift: 140,
  disableAnimation: false,
  speed: 1.0,
  mouseInteraction: true,
  glowIntensity: 0.3,
  saturation: 0.0,
  mouseRepulsion: true,
  twinkleIntensity: 0.3,
  rotationSpeed: 0.1,
  repulsionStrength: 2,
  autoCenterRepulsion: 0,
  transparent: true,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
