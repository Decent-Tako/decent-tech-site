import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'AccordionGallery',
  section: 'Components',
  page: 'https://reactbits.dev/components/accordion-gallery',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/AccordionGallery/AccordionGallery.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/AccordionGallery/AccordionGallery.tsx',
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
      why: 'The upstream file builds a gsap timeline that grows the active panel, tilts the rest, and fades the caption. The component is vendored as-is, so its runtime comes with it.',
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
  'power1.in',
  'power2.in',
  'power3.in',
  'power2.inOut',
  'back.out(1.7)',
  'elastic.out(1, 0.3)',
  'expo.out',
  'sine.inOut',
] as const;

export const ACCORDION_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export const ACCORDION_TRIGGERS = ['hover', 'click'] as const;

// One entry per upstream prop a person can set. `items`, `className`, and
// `link` on each item are not controls: the wrapper supplies Academy
// photographs and labels from src/pages/content.ts.
export const ACCORDION_GALLERY_DEFAULTS = {
  defaultIndex: 2,
  accentColor: '#DEF54F',
  overlayColor: '#212121',
  textColor: '#FFFFFF',
  height: 460,
  gap: 10,
  radius: 16,
  expandRatio: 0.52,
  orientation: 'horizontal' as (typeof ACCORDION_ORIENTATIONS)[number],
  duration: 0.6,
  ease: 'power3.out',
  parallax: 0.5,
  tilt: 8,
  stagger: 0.06,
  trigger: 'hover' as (typeof ACCORDION_TRIGGERS)[number],
  showLabels: true,
  grayscale: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
