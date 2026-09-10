import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FuzzyText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/fuzzy-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/FuzzyText/FuzzyText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const FUZZY_DIRECTIONS = ['horizontal', 'vertical', 'both'] as const;

// `text` is the wrapper children. className, paused, reduced, and onReady
// are not controls. color is ink. fontFamily is Brand Sans. fontWeight is 700.
export const FUZZY_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  fontSize: 'clamp(2rem, 8vw, 8rem)',
  fontWeight: 700,
  fontFamily: "'Brand Sans', Arial, sans-serif",
  color: '#212121',
  enableHover: true,
  baseIntensity: 0.18,
  hoverIntensity: 0.5,
  fuzzRange: 30,
  fps: 60,
  direction: 'horizontal' as (typeof FUZZY_DIRECTIONS)[number],
  transitionDuration: 0,
  clickEffect: false,
  glitchMode: false,
  glitchInterval: 2000,
  glitchDuration: 200,
  gradient: null as string[] | null,
  letterSpacing: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
