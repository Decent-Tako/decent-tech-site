import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ScrambledText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/scrambled-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrambledText/ScrambledText.tsx',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrambledText/ScrambledText.css',
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
      why: 'The upstream file splits the text with the gsap SplitText plugin and scrambles each letter near the pointer with the ScrambleTextPlugin tween. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// One entry per upstream prop, with the upstream default. `children` is the
// Academy article title; `className` and `style` are not controls: the
// wrapper CSS owns the type.
export const SCRAMBLED_TEXT_DEFAULTS = {
  radius: 100,
  duration: 1.2,
  speed: 0.5,
  scrambleChars: '.:',
  reducedMotion: 'never' as ReducedMotionMode,
};
