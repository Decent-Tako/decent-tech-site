import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import { FEATURES } from '../../../pages/content';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CircularText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/circular-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/CircularText/CircularText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/CircularText/CircularText.tsx',
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
      why: 'The upstream file spins a ring of letters with motion rotation controls and hover speed changes.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// `text` is required upstream with no default. The control uses the Week 0
// kicker and title. className and paused are not controls.
export const CIRCULAR_TEXT_DEFAULTS = {
  text: `${FEATURES[0].kicker} ${FEATURES[0].title}`.toUpperCase(),
  spinDuration: 20,
  onHover: 'speedUp' as const,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const CIRCULAR_HOVERS = ['slowDown', 'speedUp', 'pause', 'goBonkers'] as const;
