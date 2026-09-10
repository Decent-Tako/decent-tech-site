import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PillNav',
  section: 'Components',
  page: 'https://reactbits.dev/components/pill-nav',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/PillNav/PillNav.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/PillNav/PillNav.tsx',
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
      why: 'The upstream file uses gsap timelines for the hover circle, logo spin, and mobile menu. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
    {
      package: 'react-router-dom',
      version: '6.30.6',
      licence: 'MIT',
      unpackedKb: 881,
      why: 'The upstream file imports Link. Hash hrefs in the story use a plain anchor, but the import still needs the package.',
      repo: 'https://github.com/remix-run/react-router',
    },
  ],
};

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power3.easeOut',
  'power2.inOut',
  'back.out(1.7)',
  'expo.out',
  'sine.inOut',
] as const;

// One entry per upstream prop a person can set. `logo`, `items`,
// `activeHref`, `className`, and `onMobileMenuClick` are not controls.
export const PILL_NAV_DEFAULTS = {
  logoAlt: 'Uncomfortable Academy',
  ease: 'power3.easeOut',
  baseColor: '#FFFFFF',
  pillColor: '#212121',
  hoveredPillTextColor: '#212121',
  pillTextColor: '#FFFFFF',
  initialLoadAnimation: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
