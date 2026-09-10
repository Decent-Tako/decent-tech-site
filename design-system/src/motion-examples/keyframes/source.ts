export const MOTION_PACKAGE = 'motion';
export const MOTION_VERSION = '13.2.0';
export const MOTION_LICENCE = 'MIT';
export const MOTION_REPO = 'https://github.com/motiondivision/motion';
export const MOTION_DOCS = 'https://motion.dev/docs/react';

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const REDUCED_MOTION_OPTIONS = ['user', 'always', 'never'] as const;

export const TWEEN_EASES = ['easeOut', 'easeInOut', 'linear'] as const;
export type TweenEase = (typeof TWEEN_EASES)[number];

export function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

export const KEYFRAME_EXAMPLES = {
  keyframes: {
    slug: 'react-keyframes',
    title: 'Keyframes',
    docs: 'https://motion.dev/docs/react-animation#keyframes',
    example: 'https://motion.dev/examples/react-keyframes',
    live: 'https://examples.motion.dev/react/keyframes',
    mechanism:
      'motion.div animate keyframe arrays on scale, rotate, and borderRadius, with transition.times, repeat Infinity, and repeatDelay 1.',
  },
  wildcards: {
    slug: 'react-keyframes-wildcards',
    title: 'Keyframe wildcards',
    docs: 'https://motion.dev/docs/react-animation#wildcards',
    example: 'https://motion.dev/examples/react-keyframes-wildcards',
    live: 'https://examples.motion.dev/react/keyframes-wildcards',
    mechanism:
      'whileHover scale keyframes start at null so the first keyframe is the current scale. That makes the sequence interruptible.',
  },
  variants: {
    slug: 'react-variants',
    title: 'Variants',
    docs: 'https://motion.dev/docs/react-animation#variants',
    example: 'https://motion.dev/examples/react-variants',
    live: 'https://examples.motion.dev/react/variants',
    mechanism:
      'Parent motion.nav animate open/closed with custom height. sidebarVariants clip-path circle spring. navVariants stagger children. itemVariants spring y and opacity. MenuToggle morphs path d.',
  },
  state: {
    slug: 'react-state-updates',
    title: 'Animate state',
    docs: 'https://motion.dev/docs/react-animation',
    example: 'https://motion.dev/examples/react-state-updates',
    live: 'https://examples.motion.dev/react/state-updates',
    mechanism:
      'React state x, y, rotate is passed into animate={{ x, y, rotate }}. Motion springs to each new target because transition type is spring.',
  },
  rotate: {
    slug: 'react-rotate',
    title: 'Rotate',
    docs: 'https://motion.dev/docs/react-animation',
    example: 'https://motion.dev/examples/react-rotate',
    live: 'https://examples.motion.dev/react/rotate',
    mechanism:
      'motion.div animate={{ rotate: 360 }} with transition duration 1. One tween. No repeat.',
  },
} as const;
