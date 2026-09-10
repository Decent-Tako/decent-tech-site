import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type PixelBlastVariant = 'square' | 'circle' | 'triangle' | 'diamond';

export const PIXEL_BLAST_VARIANTS: readonly PixelBlastVariant[] = [
  'square',
  'circle',
  'triangle',
  'diamond',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PixelBlast',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/pixel-blast',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/PixelBlast/PixelBlast.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/PixelBlast/PixelBlast.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'postprocessing',
      version: '6.39.5',
      licence: 'Zlib',
      unpackedKb: 2709,
      why: 'The liquid and noise modes run an EffectComposer with a custom Effect. Motion cannot own that pass graph.',
      repo: 'https://github.com/pmndrs/postprocessing',
    },
    {
      package: 'three',
      version: '0.180.0',
      licence: 'MIT',
      unpackedKb: 30044,
      why: 'The upstream file draws a GLSL3 pixel-ripple quad on a three.js WebGLRenderer. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// className, style, paused, onReady, and onError are not controls. Colour
// default is brand accent-blue #0035B1 (upstream #B497CF).
export const PIXEL_BLAST_DEFAULTS = {
  variant: 'square' as PixelBlastVariant,
  pixelSize: 3,
  color: '#0035B1',
  antialias: true,
  patternScale: 2,
  patternDensity: 1,
  liquid: false,
  liquidStrength: 0.1,
  liquidRadius: 1,
  pixelSizeJitter: 0,
  enableRipples: true,
  rippleIntensityScale: 1,
  rippleThickness: 0.1,
  rippleSpeed: 0.3,
  liquidWobbleSpeed: 4.5,
  autoPauseOffscreen: true,
  speed: 0.5,
  transparent: true,
  edgeFade: 0.5,
  noiseAmount: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
