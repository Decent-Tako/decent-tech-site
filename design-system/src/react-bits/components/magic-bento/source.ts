import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'MagicBento',
  section: 'Components',
  page: 'https://reactbits.dev/components/magic-bento',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/MagicBento/MagicBento.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/MagicBento/MagicBento.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'gsap',
      version: '3.15.0',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 6111,
      why: 'The upstream file uses gsap tweens for particles, tilt, magnetism, click ripples, and the spotlight. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// One entry per upstream prop a person can set. `cards` is not a control:
// the wrapper supplies FEATURES. glowColor is an RGB triplet string.
export const MAGIC_BENTO_DEFAULTS = {
  textAutoHide: true,
  enableStars: true,
  enableSpotlight: true,
  enableBorderGlow: true,
  disableAnimations: false,
  spotlightRadius: 300,
  particleCount: 12,
  enableTilt: false,
  glowColor: '0, 53, 177',
  clickEffect: true,
  enableMagnetism: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
