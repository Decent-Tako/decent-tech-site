import type { ReducedMotionMode } from '../scroll/reduce';

export type ScrollOffsetPair =
  `${'start' | 'center' | 'end'} ${'start' | 'center' | 'end'}`;

export const SCROLL_HORIZONTAL_DEFAULTS = {
  itemWidth: 400,
  gap: 30,
  offsetStart: 'start start' as ScrollOffsetPair,
  offsetEnd: 'end end' as ScrollOffsetPair,
  reducedMotion: 'user' as ReducedMotionMode,
};
