import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FallingText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/falling-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/FallingText/FallingText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/FallingText/FallingText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'matter-js',
      version: '0.20.0',
      licence: 'MIT',
      unpackedKb: 905,
      why: 'The upstream file builds a Matter.js world so each word is a rigid body with gravity and a mouse constraint.',
      repo: 'https://github.com/liabru/matter-js',
    },
  ],
};

export const FALLING_TRIGGERS = ['auto', 'scroll', 'click', 'hover'] as const;

// `text` uses the Week 0 copy. highlightWords names Buddy and Team from
// that copy. paused, reduced, and onStarted are not controls.
export const FALLING_TEXT_DEFAULTS = {
  text: FEATURES[0].copy,
  highlightWords: ['Buddy', 'Team'] as string[],
  highlightClass: 'highlighted',
  trigger: 'auto' as (typeof FALLING_TRIGGERS)[number],
  backgroundColor: 'transparent',
  wireframes: false,
  gravity: 1,
  mouseConstraintStiffness: 0.2,
  fontSize: '1.25rem',
  reducedMotion: 'never' as ReducedMotionMode,
};
