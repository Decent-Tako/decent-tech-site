import { useReducedMotion } from 'motion/react';

export type ReducedMotionMode = 'user' | 'always' | 'never';

export function useReduce(mode: ReducedMotionMode = 'user') {
  const pref = useReducedMotion();
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return pref === true;
}

export function motionReduced(mode: ReducedMotionMode) {
  if (mode === 'always') return 'always' as const;
  if (mode === 'never') return 'never' as const;
  return 'user' as const;
}
