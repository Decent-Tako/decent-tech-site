import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Dither',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/dither',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Dither/Dither.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Dither/Dither.tsx',
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
      why: 'The local copy draws the wave shader on a three.js WebGLRenderer. Upstream used @react-three/fiber, which leaks JSX types into Motion stories.',
      repo: 'https://github.com/mrdoob/three.js',
    },
    {
      package: 'postprocessing',
      version: '6.39.5',
      licence: 'Zlib',
      unpackedKb: 2709,
      why: 'The Bayer dither pass is a postprocessing Effect on an EffectComposer. Motion cannot run that pass.',
      repo: 'https://github.com/pmndrs/postprocessing',
    },
  ],
};

export type DitherRgb = [number, number, number];

// paused, onReady, and onError are not controls. Colour defaults are brand
// tokens as 0–1 RGB: wave accent-blue (upstream 0.5,0.5,0.5), background ink
// (upstream 0,0,0).
export const DITHER_DEFAULTS = {
  waveSpeed: 0.05,
  waveFrequency: 3,
  waveAmplitude: 0.3,
  waveColor: [0, 53 / 255, 177 / 255] as DitherRgb,
  backgroundColor: [33 / 255, 33 / 255, 33 / 255] as DitherRgb,
  colorNum: 4,
  pixelSize: 2,
  disableAnimation: false,
  enableMouseInteraction: true,
  mouseRadius: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};
