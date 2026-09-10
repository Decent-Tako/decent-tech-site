export const MOTION_PACKAGE = 'motion';
export const MOTION_VERSION = '13.2.0';
export const MOTION_LICENCE = 'MIT';
export const MOTION_REPO = 'https://github.com/motiondivision/motion';
export const MOTION_DOCS = 'https://motion.dev/docs/react';
export const SVG_DOCS = 'https://motion.dev/docs/react-svg-animation';
export const ANIMATION_DOCS = 'https://motion.dev/docs/react-animation';

export const FLUBBER_PACKAGE = 'flubber';
export const FLUBBER_VERSION = '0.4.2';
export const FLUBBER_LICENCE = 'MIT';
export const FLUBBER_REPO = 'https://github.com/veltman/flubber';

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

export const SVG_EXAMPLES = {
  pathDrawing: {
    title: 'Path drawing',
    docs: SVG_DOCS,
    example: 'https://motion.dev/examples/react-path-drawing',
    live: 'https://examples.motion.dev/react/path-drawing',
    mechanism:
      'draw variants. hidden sets pathLength 0. visible(i) springs pathLength to 1 with delay i * 0.5.',
  },
  pathMorphing: {
    title: 'Path morphing',
    docs: SVG_DOCS,
    example: 'https://motion.dev/examples/react-path-morphing',
    live: 'https://examples.motion.dev/react/path-morphing',
    mechanism:
      'animate() on a progress Motion value. useTransform mixer calls flubber interpolate between unlike d strings.',
  },
  motionPath: {
    title: 'Motion path',
    docs: ANIMATION_DOCS,
    example: 'https://motion.dev/examples/react-motion-path',
    live: 'https://examples.motion.dev/react/motion-path',
    mechanism:
      'motion.path animates pathLength 0 to 1. A box binds CSS offsetPath and animates offsetDistance 0% to 100% with the same reverse loop.',
  },
  colorInterpolation: {
    title: 'Color interpolation',
    docs: 'https://motion.dev/docs/react-use-animate',
    example: 'https://motion.dev/examples/react-color-interpolation',
    live: 'https://examples.motion.dev/react/color-interpolation',
    mechanism:
      'WAAPI Element.animate versus useAnimate() on backgroundColor. Motion interpolates in linear RGB.',
  },
  colorPicker: {
    title: 'Color picker',
    docs: 'https://motion.dev/docs/react-use-spring',
    example: 'https://motion.dev/examples/react-color-picker',
    live: 'https://examples.motion.dev/react/color-picker',
    mechanism:
      'usePointerPosition feeds useTransform push, then useSpring. Tap animates conic-gradient stops to the selected colour.',
  },
} as const;
