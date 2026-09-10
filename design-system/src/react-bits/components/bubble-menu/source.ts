import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'BubbleMenu',
  section: 'Components',
  page: 'https://reactbits.dev/components/bubble-menu',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/BubbleMenu/BubbleMenu.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/BubbleMenu/BubbleMenu.tsx',
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
      why: 'The upstream file uses gsap timelines to scale the overlay pills from 0 and fade their labels when the toggle opens. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const GSAP_EASES = [
  'none',
  'power2.out',
  'power3.out',
  'back.out(1.5)',
  'back.out(1.7)',
  'elastic.out(1, 0.3)',
  'expo.out',
  'sine.inOut',
] as const;

// One entry per upstream prop a person can set. `logo`, `items`,
// `onMenuClick`, `className`, and `style` are not controls: the wrapper
// supplies the Wordmark and PAGE_NAV.
export const BUBBLE_MENU_DEFAULTS = {
  menuAriaLabel: 'Toggle menu',
  menuBg: '#FFFFFF',
  menuContentColor: '#212121',
  useFixedPosition: false,
  animationEase: 'back.out(1.5)',
  animationDuration: 0.5,
  staggerDelay: 0.12,
  reducedMotion: 'never' as ReducedMotionMode,
};
