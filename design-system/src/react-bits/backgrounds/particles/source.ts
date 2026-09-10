import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Particles',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/particles',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Particles/Particles.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Particles/Particles.tsx',
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
      why: 'The upstream file draws a point cloud on an ogl Renderer, Camera, Geometry, Program, and Mesh. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// className, paused, onReady, and onError are not controls. Colour defaults
// are brand tokens: #FFFFFF, #0035B1, #DEF54F (upstream all #ffffff).
export const PARTICLES_DEFAULTS = {
  particleCount: 200,
  particleSpread: 10,
  speed: 0.1,
  particleColors: ['#FFFFFF', '#0035B1', '#DEF54F'] as string[],
  moveParticlesOnHover: false,
  particleHoverFactor: 1,
  alphaParticles: false,
  particleBaseSize: 100,
  sizeRandomness: 1,
  cameraDistance: 20,
  disableRotation: false,
  pixelRatio: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};
