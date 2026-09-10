import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'MetallicPaint',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/metallic-paint',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/MetallicPaint/MetallicPaint.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/MetallicPaint/MetallicPaint.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// imageSrc is the Academy photograph. paused, onReady, and onUnavailable are
// local.
export const METALLIC_PAINT_DEFAULTS = {
  seed: 42,
  scale: 4,
  refraction: 0.01,
  blur: 0.015,
  liquid: 0.75,
  speed: 0.3,
  brightness: 2,
  contrast: 0.5,
  angle: 0,
  fresnel: 1,
  // Brand paper. Upstream default #ffffff.
  lightColor: '#FFFFFF',
  // Brand ink. Upstream default #000000.
  darkColor: '#212121',
  patternSharpness: 1,
  waveAmplitude: 1,
  noiseScale: 0.5,
  chromaticSpread: 2,
  mouseAnimation: false,
  distortion: 1,
  contour: 0.2,
  // Brand accent yellow. Upstream default #feb3ff.
  tintColor: '#DEF54F',
  reducedMotion: 'never' as ReducedMotionMode,
};
