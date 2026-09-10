import { ARTICLE, DESTINATIONS, FEATURES, PHOTOS } from '../../pages/content';

export const MOTION_VERSION = '13.2.0';
export const MOTION_LICENCE = 'MIT';
export const MOTION_REPO = 'https://github.com/motiondivision/motion';
export const MOTION_SCROLL_DOCS = 'https://motion.dev/docs/react-scroll-animations';
export const MOTION_USE_SCROLL_DOCS = 'https://motion.dev/docs/react-use-scroll';
export const MOTION_USE_SPRING_DOCS = 'https://motion.dev/docs/react-use-spring';
export const MOTION_COMPONENT_DOCS = 'https://motion.dev/docs/react-motion-component';

export const EXAMPLES = {
  linked: {
    page: 'https://motion.dev/examples/react-scroll-linked',
    live: 'https://examples.motion.dev/react/scroll-linked',
  },
  spring: {
    page: 'https://motion.dev/examples/react-scroll-linked-with-spring',
    live: 'https://examples.motion.dev/react/scroll-linked-with-spring',
  },
  triggered: {
    page: 'https://motion.dev/examples/react-scroll-triggered',
    live: 'https://examples.motion.dev/react/scroll-triggered',
  },
  track: {
    page: 'https://motion.dev/examples/react-scroll-track-element-in-viewport',
    live: 'https://examples.motion.dev/react/scroll-track-element-in-viewport',
  },
} as const;

export const PAGE_OFFSETS = {
  'full-page': ['start start', 'end end'],
  'first-half': ['start start', 'center start'],
  'second-half': ['center start', 'end end'],
} as const;

export type PageOffset = keyof typeof PAGE_OFFSETS;

export const TARGET_OFFSETS = {
  'enter-to-leave': ['end end', 'start start'],
  'cover-viewport': ['start end', 'end start'],
  'center-pass': ['center end', 'center start'],
} as const;

export type TargetOffset = keyof typeof TARGET_OFFSETS;

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const SCROLL_LINKED_DEFAULTS = {
  offset: 'full-page' as PageOffset,
  originX: 0,
  height: 10,
  speed: 80,
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const SPRING_DEFAULTS = {
  ...SCROLL_LINKED_DEFAULTS,
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
  mass: 1,
};

export const TRIGGERED_DEFAULTS = {
  amount: 0.8,
  once: false,
  bounce: 0.4,
  duration: 0.8,
  offscreenY: 300,
  onscreenY: 50,
  rotate: -10,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const TRACK_DEFAULTS = {
  offset: 'enter-to-leave' as TargetOffset,
  radius: 30,
  strokeWidth: 5,
  speed: 80,
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const STAGE_HEIGHT = 560;

export const ARTICLE_COPY = ARTICLE;

export type WeekCard = {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  photo: (typeof PHOTOS)[keyof typeof PHOTOS];
};

export const WEEK_CARDS: WeekCard[] = [
  {
    id: 'start',
    kicker: 'Week 0',
    title: 'Set the goal to $3,000.',
    copy: 'Publish the page before later weeks open.',
    photo: PHOTOS.hero,
  },
  {
    id: 'learn',
    kicker: 'Six weeks',
    title: 'Complete one week at a time.',
    copy: 'Finish the lesson and its action first.',
    photo: PHOTOS.crowd,
  },
  {
    id: 'tools',
    kicker: 'Tracker',
    title: 'Map 100 people.',
    copy: 'Start with the inner circle.',
    photo: PHOTOS.community,
  },
  {
    id: 'challenge',
    kicker: '19–28 October 2026',
    title: 'Do it, film it, thank people.',
    copy: 'Challenge week is daily public work.',
    photo: PHOTOS.night,
  },
  {
    id: 'street',
    kicker: 'Public work',
    title: 'Take it into the street.',
    copy: 'Keep the line short enough to say out loud.',
    photo: PHOTOS.run,
  },
  {
    id: 'lounge',
    kicker: 'Buddy and Team',
    title: 'Share what works.',
    copy: 'Move when one of you stalls. Do not say squad.',
    photo: PHOTOS.crowd,
  },
  {
    id: 'events',
    kicker: 'Learn + Do',
    title: 'Sunday sessions.',
    copy: 'Thirty minutes learn, thirty minutes do.',
    photo: PHOTOS.community,
  },
  {
    id: 'goal',
    kicker: 'Participant goal',
    title: '$3,000 before Challenge week.',
    copy: 'Weekly time is one to two hours.',
    photo: PHOTOS.hero,
  },
];

export const TRACK_ITEMS: WeekCard[] = [
  ...DESTINATIONS.map((item) => ({
    id: item.id,
    kicker: item.kicker,
    title: item.title,
    copy: item.copy,
    photo: item.photo,
  })),
  ...FEATURES.map((item) => ({
    id: `feature-${item.id}`,
    kicker: item.kicker,
    title: item.title,
    copy: item.copy,
    photo: item.photo,
  })),
];
