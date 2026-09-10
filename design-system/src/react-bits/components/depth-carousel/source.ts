import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DepthCarousel',
  section: 'Components',
  page: 'https://reactbits.dev/components/depth-carousel',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DepthCarousel/DepthCarousel.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DepthCarousel/DepthCarousel.tsx',
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
      why: 'The upstream file uses a gsap tween to move cards along a 3D rail of translateZ, translateX, and rotateY. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power4.out',
  'power2.inOut',
  'back.out(1.7)',
  'elastic.out(1, 0.3)',
  'expo.out',
  'sine.inOut',
] as const;

export const TILT_DIRECTIONS = ['left', 'right'] as const;

// One entry per upstream prop a person can set. `items`, `onChange`,
// `className`, `paused`, and `instant` are not controls: the wrapper
// supplies Academy photographs and writes the active index onto the stage.
export const DEPTH_CAROUSEL_DEFAULTS = {
  cardWidth: 300,
  cardHeight: 380,
  radius: 18,
  tint: '#212121',
  depth: 220,
  spread: 90,
  tilt: 22,
  tiltDirection: 'right' as (typeof TILT_DIRECTIONS)[number],
  perspective: 1400,
  visibleCards: 4,
  falloff: 0.2,
  blur: 6,
  duration: 700,
  ease: 'power3.out',
  autoplay: false,
  autoplayDelay: 3200,
  loop: true,
  showControls: true,
  showIndicators: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
