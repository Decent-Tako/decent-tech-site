import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ScrambledText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/scrambled-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrambledText/ScrambledText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrambledText/ScrambledText.tsx',
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
      why: 'The upstream file splits the paragraph with SplitText and scrambles nearby glyphs with ScrambleTextPlugin on pointer move.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// children is the wrapper text. className, style, paused, reduced, and
// onScramble are not controls.
export const SCRAMBLED_TEXT_DEFAULTS = {
  text: FEATURES[0].copy,
  radius: 100,
  duration: 1.2,
  speed: 0.5,
  scrambleChars: '.:',
  reducedMotion: 'never' as ReducedMotionMode,
};
