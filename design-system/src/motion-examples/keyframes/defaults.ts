import type { ReducedMotionMode, TweenEase } from './source';

export const KEYFRAMES_DEFAULTS = {
  duration: 2,
  speed: 1,
  scaleTo: 2,
  rotateTo: 180,
  repeatDelay: 1,
  ease: 'easeInOut' as TweenEase,
  size: 100,
  caption: 'Goal $3,000',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const WILDCARDS_DEFAULTS = {
  hoverScaleMid: 1.1,
  hoverScaleTo: 1.6,
  hoverDuration: 0.5,
  hoverMidTime: 0.6,
  restDuration: 0.3,
  restEase: 'easeOut' as TweenEase,
  size: 100,
  label: 'Set goal $3,000',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const VARIANTS_DEFAULTS = {
  itemStagger: 0.07,
  itemStartDelay: 0.2,
  closeStagger: 0.05,
  itemY: 50,
  hoverScale: 1.1,
  tapScale: 0.95,
  openStiffness: 20,
  closeStiffness: 400,
  closeDamping: 40,
  closeDelay: 0.2,
  initialOpen: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const STATE_DEFAULTS = {
  x: 0,
  y: 0,
  rotate: 0,
  caption: 'Find Your Uncomfortable',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const ROTATE_DEFAULTS = {
  duration: 1,
  rotateTo: 360,
  ease: 'easeOut' as TweenEase,
  size: 100,
  caption: '19–28 October',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};
