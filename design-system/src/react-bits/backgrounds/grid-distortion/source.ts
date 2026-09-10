import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GridDistortion',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/grid-distortion',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GridDistortion/GridDistortion.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GridDistortion/GridDistortion.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'three',
      version: '0.180.0',
      licence: 'MIT',
      unpackedKb: 30044,
      why: 'The upstream file samples a data texture on a three.js plane so pointer motion warps an image. Motion cannot own that WebGL mesh.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// imageSrc, className, paused, onReady, and onError are not controls: the
// wrapper owns the Academy photograph, pause, and ready.
export const GRID_DISTORTION_DEFAULTS = {
  grid: 15,
  mouse: 0.1,
  strength: 0.15,
  relaxation: 0.9,
  reducedMotion: 'never' as ReducedMotionMode,
};
