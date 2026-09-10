import type { PresenceMode, ReducedMotionMode } from './source';

export const ENTER_DEFAULTS = {
  opacityFrom: 0,
  opacityTo: 1,
  scaleFrom: 0,
  scaleTo: 1,
  duration: 0.4,
  visualDuration: 0.4,
  bounce: 0.5,
  size: 100,
  label: '$3,000',
  caption: 'Week 0 goal',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const EXIT_DEFAULTS = {
  presenceInitial: false,
  opacityFrom: 0,
  opacityTo: 1,
  scaleFrom: 0,
  scaleTo: 1,
  whileTapY: 1,
  size: 100,
  label: 'Week 0',
  caption: 'Publish the page',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const MODES_DEFAULTS = {
  duration: 0.3,
  enterScale: 0.6,
  restScale: 1,
  exitScale: 0.8,
  tapScale: 0.95,
  caption: 'Switch Week 0 and Challenge week',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const PRESENCE_DATA_DEFAULTS = {
  mode: 'popLayout' as PresenceMode,
  presenceInitial: false,
  xOffset: 50,
  delay: 0.2,
  visualDuration: 0.3,
  bounce: 0.4,
  tapScale: 0.9,
  size: 150,
  caption: 'Six Academy weeks',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const TRANSITION_DEFAULTS = {
  opacityFrom: 0,
  opacityTo: 1,
  scaleFrom: 0.5,
  scaleTo: 1,
  duration: 0.8,
  delay: 0.5,
  easeX1: 0,
  easeY1: 0.71,
  easeX2: 0.2,
  easeY2: 1.01,
  size: 200,
  label: '$3,000',
  caption: 'Aim for $3,000 before 19 October 2026',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const DEFAULT_EASE = [0.26, 0.02, 0.23, 0.94] as const;
export const WAIT_ENTER_EASE = [0.02, 0.35, 0.25, 0.99] as const;
export const WAIT_EXIT_EASE = [0.46, 0.04, 0.97, 0.44] as const;
