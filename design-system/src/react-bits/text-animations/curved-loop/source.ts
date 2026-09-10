import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import { HERO } from '../../../pages/content';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CurvedLoop',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/curved-loop',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/CurvedLoop/CurvedLoop.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/CurvedLoop/CurvedLoop.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// `marqueeText` uses the hero lede. className and paused are not controls.
export const CURVED_LOOP_DEFAULTS = {
  marqueeText: HERO.lede,
  speed: 2,
  curveAmount: 400,
  direction: 'left' as const,
  interactive: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
