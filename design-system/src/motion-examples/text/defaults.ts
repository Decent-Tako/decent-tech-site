import type { ReducedMotionMode } from './source';

export const ROLLING_EASE = [0.338, 0.015, 0.395, 0.959] as const;

export const SPLIT_TEXT_DEFAULTS = {
  text: 'Set the goal to $3,000 before Challenge week.',
  duration: 2,
  bounce: 0,
  staggerDelay: 0.05,
  fromY: 10,
  fontSize: 32,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const SCROLL_WORD_REVEAL_DEFAULTS = {
  statement:
    'Six weeks of practice, then ten days of doing it in public. Aim for $3,000 before 19 October 2026.',
  startColor: '#4A4A4A',
  endColor: '#212121',
  spread: 0.8,
  wordDuration: 0.2,
  kicker: 'Week 0',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const ROLLING_TEXT_BUTTON_DEFAULTS = {
  label: 'Start Week 0',
  duration: 0.3,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const CHARACTERS_REMAINING_DEFAULTS = {
  maxLength: 12,
  lowAt: 2,
  restAt: 6,
  velocityAtZero: 50,
  velocityAtFive: 0,
  stiffness: 700,
  damping: 80,
  lowColor: '#0035B1',
  restColor: '#212121',
  label: 'Page title',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const HTML_CONTENT_DEFAULTS = {
  from: 0,
  to: 3000,
  duration: 5,
  prefix: '$',
  caption: 'Raised toward $3,000',
  fontSize: 64,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};
