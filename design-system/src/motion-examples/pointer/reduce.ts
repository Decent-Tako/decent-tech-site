import { useReducedMotion } from 'motion/react';

import type { ReducedMotionMode } from './source';

export function useReduce(mode: ReducedMotionMode) {
  const pref = useReducedMotion();
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return pref === true;
}
