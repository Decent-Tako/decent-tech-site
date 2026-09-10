import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Iridescence',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/iridescence',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Iridescence/Iridescence.tsx',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Iridescence/Iridescence.css',
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
      why: 'The upstream file folds a cosine palette eight times in one fragment shader on a full-screen triangle through the ogl Renderer, Program, and Mesh. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// One entry per upstream prop, with the upstream default. The colour is an
// RGB triple in 0..1 that multiplies the palette; upstream default [1, 1, 1]
// is white. The brand default is accent blue #0035B1.
export const IRIDESCENCE_DEFAULTS = {
  color: [0, 0.208, 0.694] as [number, number, number],
  speed: 1.0,
  amplitude: 0.1,
  mouseReact: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
