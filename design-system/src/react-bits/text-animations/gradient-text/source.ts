import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GradientText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/gradient-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/GradientText/GradientText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/GradientText/GradientText.tsx',
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
      why: 'The upstream file drives the gradient position with useAnimationFrame and useMotionValue.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

export const GRADIENT_DIRECTIONS = ['horizontal', 'vertical', 'diagonal'] as const;

// `text` is the wrapper children. className, paused, reduced, and onProgress
// are not controls. colors map to ink, accent blue, and accent yellow.
export const GRADIENT_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  colors: ['#212121', '#0035B1', '#DEF54F'],
  animationSpeed: 8,
  showBorder: false,
  direction: 'horizontal' as (typeof GRADIENT_DIRECTIONS)[number],
  pauseOnHover: false,
  yoyo: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
