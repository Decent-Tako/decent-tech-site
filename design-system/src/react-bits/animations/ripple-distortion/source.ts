import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'RippleDistortion',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/ripple-distortion',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/RippleDistortion/RippleDistortion.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/RippleDistortion/RippleDistortion.tsx',
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
      why: 'The sketch draws a displacement field and a composite pass on an ogl Renderer, Program, Mesh, Geometry, Triangle, Texture, and RenderTarget. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const RIPPLE_TRIGGERS = ['hover', 'click', 'both'] as const;
export const RIPPLE_QUALITIES = ['low', 'medium', 'high'] as const;

// src, className, and style are not controls: the photograph is the Learn
// card from src/pages/content.ts. paused, seedRipple, onReady, and
// onUnavailable are local. Tint is brand blue. Highlight is brand paper.
export const RIPPLE_DISTORTION_DEFAULTS = {
  brushSize: 150,
  strength: 0.2,
  swirl: 1,
  rings: 4,
  spread: 5,
  fade: 3,
  spacing: 15,
  dispersion: 0,
  glint: 0,
  // Brand accent blue. Upstream default #a855f7.
  tint: '#0035B1',
  tintAmount: 0.1,
  grayscale: true,
  // Brand paper. Upstream default #ffffff.
  highlightColor: '#FFFFFF',
  trigger: 'hover' as (typeof RIPPLE_TRIGGERS)[number],
  clickStrength: 2,
  quality: 'low' as (typeof RIPPLE_QUALITIES)[number],
  enabled: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
