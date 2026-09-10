import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'BounceCards',
  section: 'Components',
  page: 'https://reactbits.dev/components/bounce-cards',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/BounceCards/BounceCards.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/BounceCards/BounceCards.tsx',
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
      why: 'The upstream file uses gsap.fromTo to scale each card from 0 with an elastic ease, then gsap.to to push siblings on hover. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'elastic.out(1, 0.8)',
  'elastic.out(1, 0.3)',
  'back.out(1.4)',
  'back.out(1.7)',
  'expo.out',
  'sine.inOut',
] as const;

// One entry per upstream prop a person can set. `images`, `imageAlts`,
// `className`, `transformStyles`, and `skipIntro` are not controls: the
// wrapper supplies Academy photographs and the default fan transforms.
export const BOUNCE_CARDS_DEFAULTS = {
  containerWidth: 400,
  containerHeight: 400,
  animationDelay: 0.5,
  animationStagger: 0.06,
  easeType: 'elastic.out(1, 0.8)',
  enableHover: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
