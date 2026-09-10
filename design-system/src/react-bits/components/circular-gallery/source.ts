import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CircularGallery',
  section: 'Components',
  page: 'https://reactbits.dev/components/circular-gallery',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/CircularGallery/CircularGallery.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/CircularGallery/CircularGallery.tsx',
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
      why: 'The upstream file builds an ogl Renderer, Camera, Plane meshes, and GLSL programs for a bent image orbit. Motion cannot own a GL context or compile those shaders.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// One entry per upstream prop a person can set. `items`, `fontUrl`, `paused`,
// `onReady`, `onError`, and `onScroll` are not controls: the wrapper
// supplies Academy photographs, Brand Sans, and writes scroll onto the stage.
export const CIRCULAR_GALLERY_DEFAULTS = {
  bend: 3,
  textColor: '#FFFFFF',
  borderRadius: 0.05,
  font: '700 30px "Brand Sans", Arial, sans-serif',
  scrollSpeed: 2,
  scrollEase: 0.05,
  reducedMotion: 'never' as ReducedMotionMode,
};
