import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'HalftoneReveal',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/halftone-reveal',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/HalftoneReveal/HalftoneReveal.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/HalftoneReveal/HalftoneReveal.tsx',
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
      why: 'The sketch draws a WebGL2 halftone of a photograph with ogl Renderer, Program, Triangle, Mesh, and Texture. motion cannot compile the GLSL loupe.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// src is not a control: the wrapper always passes an Academy photograph.
// paused, onReady, and onUnavailable are local.
export const HALFTONE_REVEAL_DEFAULTS = {
  // Brand ink. Upstream default #141414.
  inkColor: '#212121',
  // Brand paper. Upstream default #fff7e6.
  paperColor: '#FFFFFF',
  mode: 'mono' as 'mono' | 'duotone' | 'color',
  dotSize: 1,
  dotDensity: 71,
  angle: 45,
  shape: 'circle' as 'circle' | 'square' | 'diamond' | 'line',
  contrast: 1.15,
  invert: false,
  revealRadius: 0.4,
  edge: 0.8,
  follow: 0.37,
  idleReveal: 0,
  trigger: 'hover' as 'off' | 'hover' | 'always',
  borderRadius: '16px',
  reducedMotion: 'never' as ReducedMotionMode,
};

export const HALFTONE_MODES = ['mono', 'duotone', 'color'] as const;
export const HALFTONE_SHAPES = ['circle', 'square', 'diamond', 'line'] as const;
export const HALFTONE_TRIGGERS = ['off', 'hover', 'always'] as const;
