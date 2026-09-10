import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import { FEATURES } from '../../../pages/content';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DecryptedText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/decrypted-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/DecryptedText/DecryptedText.tsx',
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
      why: 'The upstream file wraps the scramble span in motion.span so hover and click attach to a motion node.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// `text` is required upstream with no default. className, paused, and
// onAnimatingChange are not controls.
export const DECRYPTED_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  speed: 50,
  maxIterations: 10,
  sequential: false,
  revealDirection: 'start' as const,
  useOriginalCharsOnly: false,
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  parentClassName: 'decrypted-text',
  encryptedClassName: 'decrypted-text__hidden',
  animateOn: 'hover' as const,
  clickMode: 'once' as const,
  reducedMotion: 'never' as ReducedMotionMode,
};
