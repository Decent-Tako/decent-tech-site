import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import { FEATURES } from '../../../pages/content';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'BlurText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/blur-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/BlurText/BlurText.tsx',
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
      why: 'The upstream file animates filter, opacity, and y on each word or letter with motion.span keyframes.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// `text` uses Week 0 copy; upstream default is ''. animationFrom, animationTo,
// easing, onAnimationComplete, className, and paused are not controls.
export const BLUR_TEXT_DEFAULTS = {
  text: FEATURES[0].copy,
  delay: 200,
  animateBy: 'words' as const,
  direction: 'top' as const,
  threshold: 0.1,
  rootMargin: '0px',
  stepDuration: 0.35,
  reducedMotion: 'never' as ReducedMotionMode,
};
