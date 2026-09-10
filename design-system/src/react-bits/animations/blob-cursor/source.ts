import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'BlobCursor',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/blob-cursor',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/BlobCursor/BlobCursor.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/BlobCursor/BlobCursor.tsx',
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
      why: 'The upstream file tweens each blob toward the pointer with a lead duration and a trail duration. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// filterId is not a control: the wrapper sets a unique id per mount.
export const BLOB_CURSOR_DEFAULTS = {
  blobType: 'circle' as 'circle' | 'square',
  // Brand accent blue. Upstream default #5227FF.
  fillColor: '#0035B1',
  trailCount: 3,
  sizes: [60, 125, 75],
  innerSizes: [20, 35, 25],
  innerColor: 'rgba(255,255,255,0.8)',
  opacities: [0.6, 0.6, 0.6],
  shadowColor: 'rgba(0,0,0,0.75)',
  shadowBlur: 5,
  shadowOffsetX: 10,
  shadowOffsetY: 10,
  filterStdDeviation: 30,
  filterColorMatrixValues: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter: true,
  fastDuration: 0.1,
  slowDuration: 0.5,
  fastEase: 'power3.out',
  slowEase: 'power1.out',
  zIndex: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power1.in',
  'power2.inOut',
] as const;
