import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Ribbons',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/ribbons',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Ribbons/Ribbons.tsx',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Ribbons/Ribbons.css',
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
      why: 'The upstream file draws one ogl Polyline per colour, springs its head towards the pointer, and lets the tail follow point by point. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// Ribbon colours. Brand accent blue, accent yellow, and paper. Upstream
// default ['#ff9346', '#7cff67', '#ffee51', '#5227FF'].
export const RIBBONS_COLORS = ['#0035B1', '#DEF54F', '#FFFFFF'];

// One entry per upstream prop, with the upstream default.
export const RIBBONS_DEFAULTS = {
  colors: RIBBONS_COLORS,
  baseSpring: 0.03,
  baseFriction: 0.9,
  baseThickness: 30,
  offsetFactor: 0.05,
  maxAge: 500,
  pointCount: 50,
  speedMultiplier: 0.6,
  enableFade: false,
  enableShaderEffect: false,
  effectAmplitude: 2,
  backgroundColor: [0, 0, 0, 0],
  reducedMotion: 'never' as ReducedMotionMode,
};
