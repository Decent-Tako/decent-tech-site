import type { ReducedMotionMode } from './source';

export const CUBE_FACES = [
  { id: 'front', kicker: 'Week 0', copy: 'Set the goal' },
  { id: 'right', kicker: 'Learn', copy: 'Six weeks' },
  { id: 'back', kicker: 'Tools', copy: 'Tracker' },
  { id: 'left', kicker: 'Challenge', copy: '19–28 Oct' },
  { id: 'top', kicker: '$3,000', copy: 'Page goal' },
  { id: 'bottom', kicker: 'Buddy', copy: 'Find yours' },
] as const;

export const USE_ANIMATION_FRAME_DEFAULTS = {
  speed: 1,
  rotatePeriod: 10000,
  bouncePeriod: 1000,
  rotateAmplitude: 200,
  bounceAmplitude: 50,
  size: 200,
  caption: 'Academy weeks on a spinning cube',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const TIME_TINY_LABELS = [
  'Ask',
  '$50',
  'Team',
  'Page',
  'Film',
  'Thank',
  'Buddy',
  'Goal',
  'Week',
  'Live',
  'Do',
  'Plan',
  'List',
  'Send',
  'Note',
  'Run',
] as const;

export const TIME_SMALL_LABELS = [
  'Week 0',
  'Learn',
  'Tools',
  'Challenge',
] as const;

export const USE_TIME_DEFAULTS = {
  cycleMs: 4000,
  speed: 1,
  tinyFactor: 2,
  smallFactor: 1.5,
  clamp: false,
  caption: '$3,000',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const USE_TRANSFORM_DEFAULTS = {
  dragElastic: 0.5,
  tickStart: 10,
  tickEnd: 100,
  crossStart: -10,
  crossAEnd: -55,
  crossBEnd: -100,
  boxSize: 140,
  caption: 'Publish your page',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const CSS_SPRING_DEFAULTS = {
  duration: 0.5,
  bounce: 0.8,
  size: 100,
  restLabel: 'Week 0',
  liveLabel: 'Page live',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const BOUNCE_EASING_DEFAULTS = {
  bounceDuration: 1.2,
  stiffness: 700,
  damping: 30,
  initialOn: true,
  onLabel: 'In the street',
  offLabel: 'At rest',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};
