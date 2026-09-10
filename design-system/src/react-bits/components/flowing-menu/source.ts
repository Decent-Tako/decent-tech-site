import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FlowingMenu',
  section: 'Components',
  page: 'https://reactbits.dev/components/flowing-menu',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/FlowingMenu/FlowingMenu.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/FlowingMenu/FlowingMenu.tsx',
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
      why: 'The upstream file uses gsap to slide a marquee in from the nearest edge and loop it. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// One entry per upstream prop a person can set. `items`, `paused`, and
// `onHover` are not controls: the wrapper supplies DESTINATIONS and writes
// hover onto the stage.
export const FLOWING_MENU_DEFAULTS = {
  speed: 15,
  textColor: '#FFFFFF',
  bgColor: '#212121',
  marqueeBgColor: '#FFFFFF',
  marqueeTextColor: '#212121',
  borderColor: '#FFFFFF',
  reducedMotion: 'never' as ReducedMotionMode,
};
