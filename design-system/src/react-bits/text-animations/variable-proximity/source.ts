import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'VariableProximity',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/variable-proximity',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/VariableProximity/VariableProximity.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/VariableProximity/VariableProximity.tsx',
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
      why: 'The upstream file wraps each glyph in motion.span so the sketch can hold a ref per letter.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

export const VARIABLE_PROXIMITY_FALLOFFS = ['linear', 'exponential', 'gaussian'] as const;

// label is the Week 0 title. containerRef, className, style, onClick, paused,
// reduced, and onProximity are not controls. from settings stay at wght 400.
// to settings use wght 700 because Brand Sans has no 800 axis.
export const VARIABLE_PROXIMITY_DEFAULTS = {
  label: FEATURES[0].title,
  fromFontVariationSettings: "'wght' 400",
  toFontVariationSettings: "'wght' 700",
  radius: 50,
  falloff: 'linear' as (typeof VARIABLE_PROXIMITY_FALLOFFS)[number],
  reducedMotion: 'never' as ReducedMotionMode,
};
