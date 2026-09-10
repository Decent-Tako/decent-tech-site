import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Threads',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/threads',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Threads/Threads.tsx',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Threads/Threads.css',
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
      why: 'The upstream file draws forty Perlin-noise lines in one fragment shader on a full-screen triangle through the ogl Renderer, Program, and Mesh. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// One entry per upstream prop, with the upstream default. The colour is an
// RGB triple in 0..1; upstream default [1, 1, 1] is white. The brand default
// is accent yellow #DEF54F.
export const THREADS_DEFAULTS = {
  color: [0.871, 0.961, 0.31] as [number, number, number],
  amplitude: 1,
  distance: 0,
  enableMouseInteraction: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
