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

export const HOOK_EXAMPLES = {
  useAnimationFrame: {
    slug: 'react-use-animation-frame',
    title: 'Use animation frame',
    docs: 'https://motion.dev/docs/react-use-animation-frame',
    example: 'https://motion.dev/examples/react-use-animation-frame',
    live: 'https://examples.motion.dev/react/use-animation-frame',
    mechanism:
      'useAnimationFrame writes cube.style.transform every frame. rotate = sin(t / 10000) * 200. y = (1 + sin(t / 1000)) * -50. CSS 3D cube with perspective 800px and translateZ on six faces.',
  },
  useTime: {
    slug: 'react-use-time',
    title: 'Use time',
    docs: 'https://motion.dev/docs/react-use-time',
    example: 'https://motion.dev/examples/react-use-time',
    live: 'https://examples.motion.dev/react/use-time',
    mechanism:
      'useTime feeds useTransform(time, [0, 4000], [0, 360], { clamp: false }). Tiny boxes multiply rotate by 2. Small boxes multiply by 1.5. Unclamped mapping keeps spinning.',
  },
  useTransform: {
    slug: 'react-use-transform',
    title: 'Use transform',
    docs: 'https://motion.dev/docs/react-use-transform',
    example: 'https://motion.dev/examples/react-use-transform',
    live: 'https://examples.motion.dev/react/use-transform',
    mechanism:
      'useMotionValue x. useTransform maps x to background, stroke colour, tick pathLength, and two cross segments. drag x with constraints 0,0 and dragElastic 0.5 rubber-bands the offset.',
  },
  cssSpring: {
    slug: 'react-css-spring',
    title: 'CSS spring',
    docs: 'https://motion.dev/docs/spring',
    example: 'https://motion.dev/examples/react-css-spring',
    live: 'https://examples.motion.dev/react/css-spring',
    mechanism:
      'spring(0.5, 0.8) from motion interpolates into a CSS transition transform string. data-state toggles translateX(-100%) to translateX(100%) rotate(180deg). The browser runs the spring, not motion.div.',
  },
  bounceEasing: {
    slug: 'react-bounce-easing',
    title: 'Bounce easing',
    docs: 'https://motion.dev/docs/react-transitions',
    example: 'https://motion.dev/examples/react-bounce-easing',
    live: 'https://examples.motion.dev/react/bounce-easing',
    mechanism:
      'layout on the ball. On uses spring stiffness 700 damping 30. Off uses duration 1.2 with easeOutBounce from easings.net. data-is-on switches align-items flex-end to flex-start.',
  },
} as const;
