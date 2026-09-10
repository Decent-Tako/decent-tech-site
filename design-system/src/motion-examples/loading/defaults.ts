import type { ReducedMotionMode } from './source';

export const CIRCLE_SPINNER_DEFAULTS = {
  duration: 1.5,
  speed: 1,
  size: 50,
  borderWidth: 4,
  caption: 'Opening Week 0',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const JUMPING_DOTS_DEFAULTS = {
  duration: 0.8,
  speed: 1,
  jump: -30,
  staggerChildren: -0.2,
  staggerDirection: -1 as -1 | 1,
  ease: 'easeInOut' as const,
  repeatType: 'mirror' as const,
  count: 3,
  size: 20,
  gap: 10,
  caption: 'Waiting for Learn + Do',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const THREE_DOTS_PULSE_DEFAULTS = {
  duration: 1.2,
  speed: 1,
  scaleTo: 1.5,
  staggerChildren: -0.2,
  staggerDirection: -1 as -1 | 1,
  ease: 'easeInOut' as const,
  count: 3,
  size: 20,
  gap: 20,
  caption: 'Writing a thank-you',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const RIPPLE_DEFAULTS = {
  duration: 2,
  speed: 1,
  delayStep: 0.5,
  count: 3,
  size: 100,
  borderWidth: 5,
  ease: 'easeOut' as const,
  caption: 'Publishing your page',
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const FILL_TEXT_DEFAULTS = {
  intervalMs: 500,
  increment: 0.2,
  text: 'CHALLENGE',
  caption: 'Challenge week 19–28 October 2026',
  fontSize: 64,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const PROGRESS_BAR_DEFAULTS = {
  intervalMs: 500,
  increment: 0.2,
  trackWidth: 300,
  trackHeight: 10,
  caption: 'Raised toward $3,000',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const LINE_REVEAL_DEFAULTS = {
  intervalMs: 300,
  increment: 0.3,
  stiffness: 500,
  damping: 40,
  visualDuration: 0.5,
  bounce: 0,
  caption: 'Opening the week gallery',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};
