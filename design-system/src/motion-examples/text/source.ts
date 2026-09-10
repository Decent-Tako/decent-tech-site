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

export const TEXT_EXAMPLES = {
  splitText: {
    slug: 'react-split-text',
    title: 'Split text',
    docs: 'https://motion.dev/docs/animate',
    extraDocs: 'https://motion.dev/docs/stagger',
    example: 'https://motion.dev/examples/react-split-text',
    live: 'https://examples.motion.dev/react/split-text',
    chunk: 'https://examples.motion.dev/assets/index-BRxIvodC.js',
    mechanism:
      'document.fonts.ready, then animate(words, { opacity: [0, 1], y: [10, 0] }) with type spring, duration 2, bounce 0, delay stagger(0.05). Words are span.split-word nodes. motion-plus splitText is Motion+ exclusive and needs a token this catalogue does not have.',
  },
  scrollWordReveal: {
    slug: 'react-text-scroll-word-reveal',
    title: 'Scroll word reveal',
    docs: 'https://motion.dev/docs/react-use-scroll',
    extraDocs: 'https://motion.dev/docs/react-use-transform',
    example: 'https://motion.dev/examples/react-text-scroll-word-reveal',
    live: 'https://examples.motion.dev/react/text-scroll-word-reveal',
    mechanism:
      'useScroll({ target, offset: ["start start", "end end"] }) drives scrollYProgress. Each word useTransform maps progress through getWordProgressRange over SPREAD 0.8 and WORD_DURATION 0.2 onto colour from charcoal to ink. A 1 px bar uses scaleY: scrollYProgress. Upstream used opacity 0.15, which fails contrast on paper.',
  },
  rollingTextButton: {
    slug: 'react-rolling-text-button',
    title: 'Rolling text button',
    docs: 'https://motion.dev/docs/react-animation#variants',
    extraDocs: 'https://motion.dev/docs/react-gestures',
    example: 'https://motion.dev/examples/react-rolling-text-button',
    live: 'https://examples.motion.dev/react/rolling-text-button',
    mechanism:
      'Two motion.span copies. Outgoing translateY(0%) → 100%. Incoming translateY(-100%) → 0%. onHoverStart, onHoverEnd, onFocus, and onBlur request active. A pending flag waits for onAnimationComplete. useReducedMotion skips the roll.',
  },
  charactersRemaining: {
    slug: 'react-characters-remaining',
    title: 'Characters remaining',
    docs: 'https://motion.dev/docs/react-use-animate',
    extraDocs: 'https://motion.dev/docs/transform',
    example: 'https://motion.dev/examples/react-characters-remaining',
    live: 'https://examples.motion.dev/react/characters-remaining',
    mechanism:
      'useAnimate() plus transform([2, 6], [lowColor, restColor]) for colour. When remaining is 6 or less, transform([0, 5], [50, 0]) sets spring velocity and animate(ref, { scale: 1 }, { type: "spring", stiffness: 700, damping: 80 }).',
  },
  htmlContent: {
    slug: 'react-html-content',
    title: 'HTML content',
    docs: 'https://motion.dev/docs/react-use-motion-value',
    extraDocs: 'https://motion.dev/docs/react-animate',
    example: 'https://motion.dev/examples/react-html-content',
    live: 'https://examples.motion.dev/react/html-content',
    mechanism:
      'useMotionValue count. useTransform(() => Math.round(count.get())). animate(count, to, { duration }) on mount. A motion.div renders the MotionValue as HTML so React does not re-render each frame.',
  },
} as const;
