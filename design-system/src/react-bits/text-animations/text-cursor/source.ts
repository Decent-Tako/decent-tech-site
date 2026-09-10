import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'TextCursor',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/text-cursor',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TextCursor/TextCursor.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TextCursor/TextCursor.tsx',
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
      why: 'The upstream file places each trail point in AnimatePresence and floats it with motion.div keyframes.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// `text` uses the Week 0 title; upstream default is an emoji. className is
// not a prop. paused, reduced, and onTrailChange are not controls.
export const TEXT_CURSOR_DEFAULTS = {
  text: FEATURES[0].title,
  spacing: 100,
  followMouseDirection: true,
  randomFloat: true,
  exitDuration: 0.5,
  removalInterval: 30,
  maxPoints: 5,
  reducedMotion: 'never' as ReducedMotionMode,
};
