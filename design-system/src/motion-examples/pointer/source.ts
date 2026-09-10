export const MOTION_RUNTIME = {
  package: 'motion',
  version: '13.2.0',
  licence: 'MIT',
  docs: 'https://motion.dev/docs/react',
  springDocs: 'https://motion.dev/docs/react-use-spring',
  transformDocs: 'https://motion.dev/docs/react-use-transform',
  animateDocs: 'https://motion.dev/docs/react-use-animate',
  motionValueDocs: 'https://motion.dev/docs/react-use-motion-value',
  repo: 'https://github.com/motiondivision/motion',
} as const;

export const PLUS_ADAPTER = {
  name: 'Academy plusAdapter',
  unpackedKb: 4,
  why: 'motion-plus 1.5.1 is MIT but exclusive to Motion+ members. npm cannot install it without membership. Motion does not export Cursor or usePointerPosition. This adapter covers the used surface with motion values.',
} as const;

export const FOLLOW_SOURCE = {
  example: 'https://motion.dev/examples/react-follow-pointer-with-spring',
  live: 'https://examples.motion.dev/react/follow-pointer-with-spring',
  chunk: 'https://examples.motion.dev/assets/index-uq4q-AuR.js',
} as const;

export const CONIC_SOURCE = {
  example: 'https://motion.dev/examples/react-conic-gradient-pointer',
  live: 'https://examples.motion.dev/react/conic-gradient-pointer',
  chunk: 'https://examples.motion.dev/assets/index-Bz3Algg5.js',
} as const;

export const CURSOR_SOURCE = {
  example: 'https://motion.dev/examples/react-cursor-floating-target',
  live: 'https://examples.motion.dev/react/cursor-floating-target',
  chunk: 'https://examples.motion.dev/assets/index-BZl1QozQ.js',
} as const;

export const FILINGS_SOURCE = {
  example: 'https://motion.dev/examples/react-magnetic-filings',
  live: 'https://examples.motion.dev/react/magnetic-filings',
  chunk: 'https://examples.motion.dev/assets/index-CdEeTlkY.js',
} as const;

export const TILT_SOURCE = {
  example: 'https://motion.dev/examples/react-tilt-card',
  live: 'https://examples.motion.dev/react/tilt-card',
  chunk: 'https://examples.motion.dev/assets/index-BZPdGIA2.js',
} as const;

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const FOLLOW_DEFAULTS = {
  damping: 3,
  stiffness: 50,
  restDelta: 0.001,
  size: 100,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const CONIC_DEFAULTS = {
  width: 400,
  height: 400,
  radius: 50,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const CURSOR_DEFAULTS = {
  damping: 80,
  stiffness: 200,
  rotateDuration: 8,
  offset: 100,
  magneticSnap: 0.9,
  reticuleStiffness: 1000,
  reticuleDamping: 50,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const FILINGS_DEFAULTS = {
  size: 16,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const TILT_DEFAULTS = {
  maxTilt: 15,
  reducedMotion: 'never' as ReducedMotionMode,
};
