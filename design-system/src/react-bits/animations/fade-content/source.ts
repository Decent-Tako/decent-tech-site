import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FadeContent',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/fade-content',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/FadeContent/FadeContent.tsx',
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
      why: 'The upstream file builds a gsap timeline for autoAlpha and blur, and a ScrollTrigger starts it when the element enters the viewport. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// One entry per upstream prop, with the upstream default. `container`,
// `onComplete`, `onDisappearanceComplete`, `className`, and `style` are not
// controls: the wrapper owns the callbacks and the scroller is the window.
export const FADE_CONTENT_DEFAULTS = {
  blur: false,
  duration: 1000,
  ease: 'power2.out',
  delay: 0,
  threshold: 0.1,
  initialOpacity: 0,
  disappearAfter: 0,
  disappearDuration: 0.5,
  disappearEase: 'power2.in',
  reducedMotion: 'never' as ReducedMotionMode,
};

// The eases the controls offer. gsap accepts any ease string; these cover
// the upstream demo and the common families.
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
