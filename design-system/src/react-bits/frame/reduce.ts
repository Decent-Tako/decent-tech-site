import { useReducedMotion } from 'motion/react';

import type { ReducedMotionMode } from '../types';

// True when the story must show its final state at once. 'user' follows
// the prefers-reduced-motion media query.
export function useReduce(mode: ReducedMotionMode): boolean {
  const pref = useReducedMotion();
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return pref === true;
}
