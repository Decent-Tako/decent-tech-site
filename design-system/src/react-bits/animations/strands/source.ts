import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Strands',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/strands',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Strands/Strands.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Strands/Strands.tsx',
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
      why: 'The upstream file draws glowing ribbons in a WebGL 2 fragment shader on an ogl Triangle mesh, then an optional glass pass reads that scene from a RenderTarget. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// Strand colours. Brand accent blue, accent yellow, paper, and ink.
// Upstream default ['#FF4242', '#7C3AED', '#06B6D4', '#EAB308'].
export const STRANDS_COLORS = ['#0035B1', '#DEF54F', '#FFFFFF', '#212121'];

// One entry per upstream prop, with the upstream default. className and
// style are not controls: the wrapper owns the stage.
export const STRANDS_DEFAULTS = {
  colors: STRANDS_COLORS,
  count: 3,
  speed: 0.5,
  amplitude: 1,
  waviness: 1,
  thickness: 0.7,
  glow: 2.6,
  taper: 3,
  spread: 1,
  hueShift: 0,
  intensity: 0.6,
  saturation: 1.5,
  opacity: 1,
  scale: 1.5,
  glass: false,
  refraction: 1,
  dispersion: 1,
  glassSize: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};
