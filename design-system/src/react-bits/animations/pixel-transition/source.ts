import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PixelTransition',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/pixel-transition',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/PixelTransition/PixelTransition.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/PixelTransition/PixelTransition.tsx',
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
      why: 'The overlay pixels toggle display with a random gsap stagger. Motion cannot replace that stagger clock without rewriting the card.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// firstContent, secondContent, className, and style are not controls.
// paused, reduced, and onActive are local.
export const PIXEL_TRANSITION_DEFAULTS = {
  gridSize: 7,
  // Brand accent yellow. Upstream default currentColor.
  pixelColor: '#DEF54F',
  animationStepDuration: 0.3,
  once: false,
  aspectRatio: '100%',
  reducedMotion: 'never' as ReducedMotionMode,
};
