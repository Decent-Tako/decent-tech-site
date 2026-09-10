import type { ReducedMotionMode } from '../scroll/reduce';

export const SCROLL_IMAGE_REVEAL_DEFAULTS = {
  clipEnd: 0.4,
  scaleFrom: 1.3,
  scaleMid: 1,
  scaleTo: 1.1,
  yTo: 20,
  reducedMotion: 'user' as ReducedMotionMode,
};
