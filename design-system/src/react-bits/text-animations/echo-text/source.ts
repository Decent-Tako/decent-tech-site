import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'EchoText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/echo-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/EchoText/EchoText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/EchoText/EchoText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const ECHO_DIRECTIONS = ['right', 'left', 'up', 'down', 'diagonal'] as const;
export const ECHO_MODES = ['entrance', 'pointer', 'both'] as const;
export const ECHO_EASES = ['linear', 'ease-out', 'ease-in-out', 'snappy'] as const;

// `text` uses the Week 0 title. className, style, paused, reduced, and
// onActivity are not controls. color is paper; tint is accent blue.
export const ECHO_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  echoes: 12,
  lag: 0.24,
  offset: 36,
  direction: 'right' as (typeof ECHO_DIRECTIONS)[number],
  fade: 0.72,
  blur: 3,
  tint: '#0035B1',
  mode: 'both' as (typeof ECHO_MODES)[number],
  cursorRadius: 320,
  duration: 900,
  ease: 'ease-out' as (typeof ECHO_EASES)[number],
  fontSize: 'clamp(3rem, 9vw, 7rem)',
  fontWeight: 700,
  color: '#FFFFFF',
  reducedMotion: 'never' as ReducedMotionMode,
};
