import type { ReducedMotionMode } from './source';

export const PATH_DRAWING_DEFAULTS = {
  duration: 1.5,
  delayStep: 0.5,
  bounce: 0,
  strokeWidth: 10,
  size: 600,
  caption: 'Week 0, Learn, and Challenge week',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const PATH_MORPHING_DEFAULTS = {
  duration: 0.8,
  speed: 1,
  maxSegmentLength: 0.1,
  caption: 'Academy shapes',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const MOTION_PATH_DEFAULTS = {
  duration: 4,
  speed: 1,
  boxSize: 50,
  startScale: 2.5,
  strokeWidth: 12,
  caption: 'A participant through the six weeks',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const COLOR_INTERPOLATION_DEFAULTS = {
  duration: 2,
  speed: 1,
  fromColor: '#0035B1',
  toColor: '#DEF54F',
  swatchSize: 100,
  caption: 'Hover blue to press yellow',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const COLOR_PICKER_DEFAULTS = {
  pushMagnitude: 5,
  damping: 30,
  stiffness: 100,
  size: 320,
  caption: 'Pick a week banner colour',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const UPSTREAM_PICKER_SIZE = 140;
