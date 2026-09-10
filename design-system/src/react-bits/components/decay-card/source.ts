import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DecayCard',
  section: 'Components',
  page: 'https://reactbits.dev/components/decay-card',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DecayCard/DecayCard.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DecayCard/DecayCard.tsx',
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
      why: 'The upstream file uses gsap.set to tilt the card and to write the SVG displacement scale from pointer travel. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// One entry per upstream prop a person can set. `image`, `children`,
// `paused`, `instant`, and `onScale` are not controls: the wrapper
// supplies an Academy photograph and caption.
export const DECAY_CARD_DEFAULTS = {
  width: 300,
  height: 400,
  baseFrequency: 0.015,
  numOctaves: 5,
  seed: 4,
  maxDisplacement: 400,
  movementBound: 50,
  reducedMotion: 'never' as ReducedMotionMode,
};
