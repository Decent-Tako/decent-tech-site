import { publicAsset } from '../../brand/assets';

export const MOTION_RUNTIME = {
  package: 'motion',
  version: '13.2.0',
  licence: 'MIT',
  repository: 'https://github.com/motiondivision/motion',
  docsDrag: 'https://motion.dev/docs/react-drag',
  docsGestures: 'https://motion.dev/docs/react-gestures',
} as const;

export const EXAMPLES = {
  drag: {
    page: 'https://motion.dev/examples/react-drag',
    live: 'https://examples.motion.dev/react/drag',
  },
  constraints: {
    page: 'https://motion.dev/examples/react-drag-constraints',
    live: 'https://examples.motion.dev/react/drag-constraints',
  },
  lock: {
    page: 'https://motion.dev/examples/react-drag-lock-direction',
    live: 'https://examples.motion.dev/react/drag-lock-direction',
  },
  gestures: {
    page: 'https://motion.dev/examples/react-gestures',
    live: 'https://examples.motion.dev/react/gestures',
  },
  swipe: {
    page: 'https://motion.dev/examples/react-swipe-actions',
    live: 'https://examples.motion.dev/react/swipe-actions',
  },
} as const;

export const DRAG_ELASTIC_DEFAULT = 0.35;
export const DRAG_MOMENTUM_DEFAULT = true;
export const LOCK_BOUNCE_STIFFNESS = 500;
export const LOCK_BOUNCE_DAMPING = 15;
export const LOCK_ELASTIC = 0.2;
export const CONSTRAINT_ELASTIC = 0.2;
export const CONSTRAINT_SIZE = 360;
export const GESTURE_HOVER_SCALE = 1.2;
export const GESTURE_TAP_SCALE = 0.8;
export const GESTURE_SPRING_STIFFNESS = 400;
export const GESTURE_SPRING_DAMPING = 17;
export const SWIPE_HEIGHT = 80;
export const SWIPE_MAX_WIDTH = 384;
export const SWIPE_STIFFNESS = 900;
export const SWIPE_DAMPING = 80;
export const SWIPE_FULL_RATIO = 0.8;
export const SWIPE_SNAP_RATIO = 0.25;

export type DragAxis = true | 'x' | 'y';
export type ConstraintMode = 'ref' | 'pixels';
export type ReducedMotionMode = 'user' | 'always' | 'never';

export const DRAG_DEFAULTS = {
  drag: true as DragAxis,
  dragMomentum: true,
  whileDragScale: 1,
  heading: 'Set the goal to $3,000.',
  kicker: 'Week 0',
  photoSrc: publicAsset('photos/find-your-uncomfortable.jpg'),
  photoAlt: 'A participant part way through a physical challenge outdoors',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const DRAG_CONSTRAINTS_DEFAULTS = {
  constraintMode: 'ref' as ConstraintMode,
  dragElastic: CONSTRAINT_ELASTIC,
  top: -80,
  left: -80,
  right: 80,
  bottom: 80,
  heading: 'Challenge week is 19–28 October 2026.',
  kicker: 'Do it in public',
  photoSrc: publicAsset('photos/night-outreach.jpg'),
  photoAlt: 'Volunteers doing night outreach on a city street',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const DRAG_LOCK_DEFAULTS = {
  dragDirectionLock: true,
  bounceStiffness: LOCK_BOUNCE_STIFFNESS,
  bounceDamping: LOCK_BOUNCE_DAMPING,
  dragElastic: LOCK_ELASTIC,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const GESTURES_DEFAULTS = {
  hoverScale: GESTURE_HOVER_SCALE,
  tapScale: GESTURE_TAP_SCALE,
  hoverRotate: 0,
  tapRotate: 0,
  hoverDuration: 0.2,
  springStiffness: GESTURE_SPRING_STIFFNESS,
  springDamping: GESTURE_SPRING_DAMPING,
  label: 'RSVP to Learn + Do',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const SWIPE_DEFAULTS = {
  stiffness: SWIPE_STIFFNESS,
  damping: SWIPE_DAMPING,
  itemHeight: SWIPE_HEIGHT,
  itemMaxWidth: SWIPE_MAX_WIDTH,
  fullSwipeRatio: SWIPE_FULL_RATIO,
  snapRatio: SWIPE_SNAP_RATIO,
  heading: 'Buddy check-in. Publish the Week 0 page.',
  reducedMotion: 'user' as ReducedMotionMode,
};
