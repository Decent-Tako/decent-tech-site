import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'RippleGrid',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/ripple-grid',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/RippleGrid/RippleGrid.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/RippleGrid/RippleGrid.tsx',
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
      why: 'The upstream file draws a rippling grid on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. gridColor default is brand
// paper #FFFFFF (upstream #ffffff).
export const RIPPLE_GRID_DEFAULTS = {
  enableRainbow: false,
  gridColor: '#FFFFFF',
  rippleIntensity: 0.05,
  gridSize: 10.0,
  gridThickness: 15.0,
  fadeDistance: 1.5,
  vignetteStrength: 2.0,
  glowIntensity: 0.1,
  opacity: 1.0,
  gridRotation: 0,
  mouseInteraction: true,
  mouseInteractionRadius: 1,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
