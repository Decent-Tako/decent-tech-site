import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'StaggeredMenu',
  section: 'Components',
  page: 'https://reactbits.dev/components/staggered-menu',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/StaggeredMenu/StaggeredMenu.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/StaggeredMenu/StaggeredMenu.tsx',
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
      why: 'The upstream file builds gsap timelines that slide colour prelayers and the panel, then stagger the labels. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// One entry per upstream prop a person can set. items, socialItems, logoUrl,
// logoAlt, className, onMenuOpen, and onMenuClose are not controls: the
// wrapper supplies PAGE_NAV, DESTINATIONS, and the hero photograph.
export const STAGGERED_MENU_DEFAULTS = {
  position: 'right' as const,
  colors: ['#0035B1', '#DEF54F'],
  displaySocials: true,
  displayItemNumbering: true,
  menuButtonColor: '#FFFFFF',
  openMenuButtonColor: '#FFFFFF',
  changeMenuColorOnOpen: true,
  accentColor: '#0035B1',
  isFixed: false,
  closeOnClickAway: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
