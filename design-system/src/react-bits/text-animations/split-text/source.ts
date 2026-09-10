import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SplitText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/split-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/SplitText/SplitText.tsx',
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
      why: 'The upstream file splits the text with the gsap SplitText plugin and tweens each piece with gsap.fromTo under a ScrollTrigger. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
    {
      package: '@gsap/react',
      version: '2.1.2',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 19,
      why: 'The upstream file builds its tween inside the useGSAP hook, which scopes and reverts the tween with the component.',
      repo: 'https://github.com/greensock/react',
    },
  ],
};

export const SPLIT_TYPES = ['chars', 'words', 'lines', 'words, chars'] as const;
export const SPLIT_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const;
export const SPLIT_EASES = [
  'power1.out',
  'power2.out',
  'power3.out',
  'power4.out',
  'back.out(1.7)',
  'elastic.out(1, 0.3)',
  'expo.out',
  'sine.inOut',
  'none',
] as const;

// One entry per upstream prop, with the upstream default. `text` is the
// Academy hero lede; `className`, `from`, `to`, and
// `onLetterAnimationComplete` are not controls: the tween keeps the
// upstream opacity and y keyframes and the wrapper owns the callback.
export const SPLIT_TEXT_DEFAULTS = {
  delay: 50,
  duration: 1.25,
  ease: 'power3.out' as (typeof SPLIT_EASES)[number],
  splitType: 'chars' as (typeof SPLIT_TYPES)[number],
  threshold: 0.1,
  rootMargin: '-100px',
  textAlign: 'center' as 'left' | 'center' | 'right',
  tag: 'p' as (typeof SPLIT_TAGS)[number],
  reducedMotion: 'never' as ReducedMotionMode,
};
