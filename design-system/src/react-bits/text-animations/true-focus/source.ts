import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'TrueFocus',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/true-focus',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TrueFocus/TrueFocus.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/TrueFocus/TrueFocus.tsx',
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
      why: 'The upstream file animates the corner frame with motion.div to the active word.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

export const TRUE_FOCUS_SENTENCE = FEATURES.slice(0, 3)
  .map((feature) => feature.title)
  .join(' ');

// sentence uses the first three FEATURES titles. paused, reduced, and onIndex
// are not controls. borderColor is accent blue; upstream default green.
// glowColor is accent blue at 0.6; upstream default rgba(0, 255, 0, 0.6).
export const TRUE_FOCUS_DEFAULTS = {
  sentence: TRUE_FOCUS_SENTENCE,
  separator: ' ',
  manualMode: false,
  blurAmount: 5,
  borderColor: '#0035B1',
  glowColor: 'rgba(0, 53, 177, 0.6)',
  animationDuration: 0.5,
  pauseBetweenAnimations: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};
