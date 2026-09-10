import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FlyingPosters',
  section: 'Components',
  page: 'https://reactbits.dev/components/flying-posters',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/FlyingPosters/FlyingPosters.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/FlyingPosters/FlyingPosters.tsx',
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
      why: 'The upstream file builds an ogl Renderer, Camera, and distorted image planes. Motion cannot own a GL context or compile those shaders.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// One entry per upstream prop a person can set. `items`, `className`,
// `paused`, `onReady`, `onError`, and `onScroll` are not controls: the
// wrapper supplies Academy photographs and writes scroll onto the stage.
export const FLYING_POSTERS_DEFAULTS = {
  planeWidth: 320,
  planeHeight: 320,
  distortion: 3,
  scrollEase: 0.01,
  cameraFov: 45,
  cameraZ: 20,
  reducedMotion: 'never' as ReducedMotionMode,
};
