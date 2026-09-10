import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CardSwap',
  section: 'Components',
  page: 'https://reactbits.dev/components/card-swap',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/CardSwap/CardSwap.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/CardSwap/CardSwap.tsx',
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
      why: 'The upstream file uses a gsap timeline on an interval to drop the front card and promote the stack. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const CARD_SWAP_EASINGS = ['elastic', 'linear'] as const;

// One entry per upstream prop a person can set. `children`, `onCardClick`,
// `paused`, and `onSwap` are not controls: the wrapper supplies Academy
// cards and writes the cycle onto the stage.
export const CARD_SWAP_DEFAULTS = {
  width: 360,
  height: 260,
  cardDistance: 60,
  verticalDistance: 70,
  delay: 5000,
  pauseOnHover: false,
  skewAmount: 6,
  easing: 'elastic' as (typeof CARD_SWAP_EASINGS)[number],
  reducedMotion: 'never' as ReducedMotionMode,
};
