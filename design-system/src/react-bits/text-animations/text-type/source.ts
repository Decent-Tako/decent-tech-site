import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'TextType',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/text-type',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TextType/TextType.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TextType/TextType.tsx',
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
      why: 'The upstream file blinks the cursor with a gsap yoyo tween on opacity.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const TEXT_TYPE_PHRASES = FEATURES.map((feature) => feature.title);

// `text` is the five FEATURES titles. `as`, `className`, `cursorClassName`,
// `variableSpeed`, `onSentenceComplete`, `paused`, `reduced`, and `onTyped`
// are not controls. `textColor` is ink; upstream textColors default [].
export const TEXT_TYPE_DEFAULTS = {
  typingSpeed: 50,
  initialDelay: 0,
  pauseDuration: 2000,
  deletingSpeed: 30,
  loop: true,
  showCursor: true,
  hideCursorWhileTyping: false,
  cursorCharacter: '|',
  cursorBlinkDuration: 0.5,
  textColor: '#212121',
  startOnVisible: false,
  reverseMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
