import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type PixelSnowVariant = 'square' | 'round' | 'snowflake';

export const PIXEL_SNOW_VARIANTS: readonly PixelSnowVariant[] = [
  'square',
  'round',
  'snowflake',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PixelSnow',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/pixel-snow',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/PixelSnow/PixelSnow.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/PixelSnow/PixelSnow.tsx',
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
      why: 'The upstream file raymarches voxel flakes on a three.js ShaderMaterial. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// className, style, paused, onReady, and onError are not controls. Colour
// default is brand paper #FFFFFF (upstream #ffffff).
export const PIXEL_SNOW_DEFAULTS = {
  color: '#FFFFFF',
  flakeSize: 0.01,
  minFlakeSize: 1.25,
  pixelResolution: 200,
  speed: 1.25,
  depthFade: 8,
  farPlane: 20,
  brightness: 1,
  gamma: 0.4545,
  density: 0.3,
  variant: 'square' as PixelSnowVariant,
  direction: 125,
  reducedMotion: 'never' as ReducedMotionMode,
};
