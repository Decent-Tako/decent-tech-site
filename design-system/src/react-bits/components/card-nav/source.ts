import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CardNav',
  section: 'Components',
  page: 'https://reactbits.dev/components/card-nav',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/CardNav/CardNav.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/CardNav/CardNav.tsx',
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
      why: 'The upstream file uses a paused gsap timeline to grow the bar and fade the three cards in. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
    {
      package: 'react-icons',
      version: '5.7.0',
      licence: 'MIT',
      unpackedKb: 86213,
      why: 'The upstream file imports GoArrowUpRight for each nested link. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/react-icons/react-icons',
    },
  ],
};

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power4.out',
  'back.out(1.7)',
  'expo.out',
  'sine.inOut',
] as const;

// One entry per upstream prop a person can set. `logo`, `logoAlt`, `items`,
// `className`, `duration`, and `buttonLabel` are not controls: the wrapper
// supplies the Wordmark, DESTINATIONS cards, and Academy CTA copy.
export const CARD_NAV_DEFAULTS = {
  ease: 'power3.out',
  baseColor: '#FFFFFF',
  menuColor: '#212121',
  buttonBgColor: '#212121',
  buttonTextColor: '#FFFFFF',
  reducedMotion: 'never' as ReducedMotionMode,
};
