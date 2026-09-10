import type { ReducedMotionMode } from '../scroll/reduce';

export type HideEase = 'easeInOut' | 'easeOut' | 'easeIn' | 'linear';

export const SCROLL_HIDE_HEADER_DEFAULTS = {
  hideThreshold: 150,
  hideY: -140,
  duration: 0.3,
  ease: 'easeInOut' as HideEase,
  hiddenOpacity: 0,
  reducedMotion: 'user' as ReducedMotionMode,
};
