import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SplitFlapText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/split-flap-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/SplitFlapText/SplitFlapText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/SplitFlapText/SplitFlapText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const SPLIT_FLAP_CHARSETS = ['alpha', 'alphanumeric', 'numeric'] as const;

// words uses the first three feature titles. text, className, style, paused,
// reduced, and onPhraseChange are not controls. tileColor is ink; upstream
// default #111827. textColor is paper; upstream default #f8fafc.
export const SPLIT_FLAP_TEXT_DEFAULTS = {
  words: [FEATURES[0].title, FEATURES[1].title, FEATURES[2].title],
  flipDuration: 0.12,
  stagger: 0.06,
  cycleDelay: 2400,
  charset: 'alphanumeric' as (typeof SPLIT_FLAP_CHARSETS)[number],
  flipsPerChar: 8,
  tileColor: '#212121',
  textColor: '#FFFFFF',
  tileRadius: 8,
  gap: 6,
  fontSize: 52,
  loop: true,
  padTo: 12,
  reducedMotion: 'never' as ReducedMotionMode,
};
