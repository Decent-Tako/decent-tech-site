import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PixelSwap',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/pixel-swap',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/PixelSwap/PixelSwap.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/PixelSwap/PixelSwap.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const PIXEL_SWAP_PATTERNS = [
  'random',
  'center',
  'edges',
  'left-to-right',
  'right-to-left',
  'top-to-bottom',
  'bottom-to-top',
  'diagonal',
  'spiral',
] as const;

export const PIXEL_SWAP_TRIGGERS = ['hover', 'click', 'manual'] as const;

// firstContent, secondContent, active, onActiveChange, onComplete, className,
// and style are not controls. paused is local.
export const PIXEL_SWAP_DEFAULTS = {
  pixelSize: 64,
  gap: 0,
  pixelRadius: 0,
  pixelSpin: 0,
  pixelScale: 0.35,
  fade: true,
  duration: 1400,
  pixelDuration: 450,
  pattern: 'random' as (typeof PIXEL_SWAP_PATTERNS)[number],
  randomness: 0,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  trigger: 'hover' as (typeof PIXEL_SWAP_TRIGGERS)[number],
  initialActive: false,
  aspectRatio: '16 / 10',
  reducedMotion: 'never' as ReducedMotionMode,
};
