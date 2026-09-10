export const MOTION_PACKAGE = 'motion';
export const MOTION_VERSION = '13.2.0';
export const MOTION_LICENCE = 'MIT';
export const MOTION_REPO = 'https://github.com/motiondivision/motion';
export const MOTION_DOCS = 'https://motion.dev/docs/react';

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const REDUCED_MOTION_OPTIONS = ['user', 'always', 'never'] as const;

export function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

export const LOADING_EXAMPLES = {
  circleSpinner: {
    slug: 'react-loading-circle-spinner',
    title: 'Circle spinner',
    docs: 'https://motion.dev/docs/react-animation',
    example: 'https://motion.dev/examples/react-loading-circle-spinner',
    live: 'https://examples.motion.dev/react/loading-circle-spinner',
    mechanism:
      'animate={{ transform: "rotate(360deg)" }} with transition.repeat Infinity and ease linear.',
  },
  fillText: {
    slug: 'react-loading-fill-text',
    title: 'Fill text',
    docs: 'https://motion.dev/docs/react-use-spring',
    example: 'https://motion.dev/examples/react-loading-fill-text',
    live: 'https://examples.motion.dev/react/loading-fill-text',
    mechanism:
      'useSpring progress. useTransform maps [0, 1] to clip-path inset(0 100% 0 0) → inset(0 0% 0 0).',
  },
  jumpingDots: {
    slug: 'react-loading-jumping-dots',
    title: 'Jumping dots',
    docs: 'https://motion.dev/docs/react-animation#orchestration',
    example: 'https://motion.dev/examples/react-loading-jumping-dots',
    live: 'https://examples.motion.dev/react/loading-jumping-dots',
    mechanism:
      'Child variants jump translateY(-30px) with repeat Infinity and repeatType mirror. Parent staggerChildren -0.2, staggerDirection -1.',
  },
  lineReveal: {
    slug: 'react-loading-line-reveal',
    title: 'Line reveal',
    docs: 'https://motion.dev/docs/react-use-motion-template',
    example: 'https://motion.dev/examples/react-loading-line-reveal',
    live: 'https://examples.motion.dev/react/loading-line-reveal',
    mechanism:
      'useSpring progress, useTransform edges, useMotionTemplate polygon clipPath, useMotionValueEvent at 1, then animate() opens leftEdge and rightEdge.',
  },
  progressBar: {
    slug: 'react-loading-progress-bar',
    title: 'Progress bar',
    docs: 'https://motion.dev/docs/react-use-spring',
    example: 'https://motion.dev/examples/react-loading-progress-bar',
    live: 'https://examples.motion.dev/react/loading-progress-bar',
    mechanism:
      'useSpring progress bound to scaleX. transform-origin 0% 50% grows the bar from the left.',
  },
  ripple: {
    slug: 'react-loading-ripple',
    title: 'Ripple',
    docs: 'https://motion.dev/docs/react-animation',
    example: 'https://motion.dev/examples/react-loading-ripple',
    live: 'https://examples.motion.dev/react/loading-ripple',
    mechanism:
      'Three motion.div nodes animate scale(0)→scale(1) and opacity 1→0 with repeat Infinity, ease easeOut, and staggered delay.',
  },
  threeDotsPulse: {
    slug: 'react-loading-three-dots-pulse',
    title: 'Three dots pulse',
    docs: 'https://motion.dev/docs/react-animation#orchestration',
    example: 'https://motion.dev/examples/react-loading-three-dots-pulse',
    live: 'https://examples.motion.dev/react/loading-three-dots-pulse',
    mechanism:
      'Child variants pulse scale [1, 1.5, 1] with repeat Infinity. Parent staggerChildren -0.2, staggerDirection -1.',
  },
} as const;
