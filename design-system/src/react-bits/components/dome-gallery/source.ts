import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DomeGallery',
  section: 'Components',
  page: 'https://reactbits.dev/components/dome-gallery',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DomeGallery/DomeGallery.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DomeGallery/DomeGallery.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: '@use-gesture/react',
      version: '10.3.1',
      licence: 'MIT',
      unpackedKb: 36,
      why: 'The upstream file uses useGesture to drag the CSS 3D sphere. Motion cannot own that drag state machine.',
      repo: 'https://github.com/pmndrs/use-gesture',
    },
  ],
};

export const FIT_BASIS = ['auto', 'min', 'max', 'width', 'height'] as const;

// One entry per upstream prop a person can set. `images`, `paused`,
// `onRotate`, and `onOpen` are not controls: the wrapper supplies Academy
// photographs and writes rotation onto the stage.
export const DOME_GALLERY_DEFAULTS = {
  fit: 0.5,
  fitBasis: 'auto' as (typeof FIT_BASIS)[number],
  minRadius: 600,
  maxRadius: 4000,
  padFactor: 0.25,
  overlayBlurColor: '#212121',
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
  dragDampening: 2,
  openedImageWidth: '400px',
  openedImageHeight: '400px',
  imageBorderRadius: '30px',
  openedImageBorderRadius: '30px',
  grayscale: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
