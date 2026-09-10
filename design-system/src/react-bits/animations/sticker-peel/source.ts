import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'StickerPeel',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/sticker-peel',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/StickerPeel/StickerPeel.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/StickerPeel/StickerPeel.tsx',
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
      why: 'The sticker uses gsap.set for the point light and Draggable for the drag offset. Motion has no Draggable plugin.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const STICKER_POSITIONS = ['center', 'random'] as const;

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power2.in',
  'power2.inOut',
  'back.out(1.7)',
  'elastic.out(1, 0.3)',
] as const;

// imageSrc, imageAlt, and className are not controls: the photograph is
// the Street card from src/pages/content.ts. paused, reduced, and onPeel
// are local.
export const STICKER_PEEL_DEFAULTS = {
  rotate: 30,
  peelBackHoverPct: 30,
  peelBackActivePct: 40,
  peelEasing: 'power3.out',
  peelHoverEasing: 'power2.out',
  width: 200,
  shadowIntensity: 0.6,
  lightingIntensity: 0.1,
  initialPosition: 'center' as (typeof STICKER_POSITIONS)[number],
  peelDirection: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
