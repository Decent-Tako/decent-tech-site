import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'RotatingText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/rotating-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/RotatingText/RotatingText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/RotatingText/RotatingText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'motion',
      version: '13.2.0',
      licence: 'MIT',
      unpackedKb: 701,
      why: 'The upstream file swaps each word with AnimatePresence and staggers motion.span glyphs.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

export const ROTATING_STAGGER_FROM = ['first', 'last', 'center', 'random'] as const;
export const ROTATING_SPLIT_BY = ['characters', 'words', 'lines'] as const;
export const ROTATING_PRESENCE_MODE = ['sync', 'wait'] as const;

// texts uses the first three feature titles. transition, initial, animate,
// exit, onNext, className, and paused are not controls.
export const ROTATING_TEXT_DEFAULTS = {
  texts: [FEATURES[0].title, FEATURES[1].title, FEATURES[2].title],
  animatePresenceMode: 'wait' as (typeof ROTATING_PRESENCE_MODE)[number],
  animatePresenceInitial: false,
  rotationInterval: 2000,
  staggerDuration: 0,
  staggerFrom: 'first' as (typeof ROTATING_STAGGER_FROM)[number],
  loop: true,
  auto: true,
  splitBy: 'characters' as (typeof ROTATING_SPLIT_BY)[number] | string,
  mainClassName: 'rotating-text',
  splitLevelClassName: '',
  elementLevelClassName: '',
  reducedMotion: 'never' as ReducedMotionMode,
};
