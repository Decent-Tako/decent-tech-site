import { PHOTOS } from '../../pages/content';

export const MOTION_RUNTIME = {
  package: 'motion',
  version: '13.2.0',
  licence: 'MIT',
  repository: 'https://github.com/motiondivision/motion',
  docsDrag: 'https://motion.dev/docs/react-drag',
  docsPresence: 'https://motion.dev/docs/react-animate-presence',
  docsVariants: 'https://motion.dev/docs/react-animation#variants',
  docsLayout: 'https://motion.dev/docs/react-layout-animations',
} as const;

export const EXAMPLES = {
  cardStack: {
    page: 'https://motion.dev/examples/react-card-stack',
    live: 'https://examples.motion.dev/react/card-stack',
    source: 'https://examples.motion.dev/assets/index-BV1YOFDw.js',
  },
  clerkCardStack: {
    page: 'https://motion.dev/examples/react-clerk-card-stack',
    live: 'https://examples.motion.dev/react/clerk-card-stack',
    source: 'https://examples.motion.dev/assets/index-3Fx5eVo2.js',
  },
  notificationsStack: {
    page: 'https://motion.dev/examples/react-notifications-stack',
    live: 'https://examples.motion.dev/react/notifications-stack',
    source: 'https://examples.motion.dev/assets/index-Ck-xMYFm.js',
  },
  multiStateBadge: {
    page: 'https://motion.dev/examples/react-multi-state-badge',
    live: 'https://examples.motion.dev/react/multi-state-badge',
    source: 'https://examples.motion.dev/assets/index-FXaAObi4.js',
  },
  accordion: {
    page: 'https://motion.dev/examples/react-accordion',
    live: 'https://examples.motion.dev/react/accordion',
    source: 'https://examples.motion.dev/assets/index-C4wM9kMh.js',
  },
} as const;

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

export type CardStackImage = {
  src: string;
  alt: string;
  title: string;
  ratio: number;
};

export const CARD_STACK_IMAGES: CardStackImage[] = [
  {
    src: PHOTOS.hero.src,
    alt: PHOTOS.hero.alt,
    title: 'Week 0. Set the goal to $3,000.',
    ratio: 3 / 4,
  },
  {
    src: PHOTOS.crowd.src,
    alt: PHOTOS.crowd.alt,
    title: 'Learn. Complete one week at a time.',
    ratio: 3 / 4,
  },
  {
    src: PHOTOS.community.src,
    alt: PHOTOS.community.alt,
    title: 'Buddy and Team. Map 100 people.',
    ratio: 4 / 3,
  },
  {
    src: PHOTOS.run.src,
    alt: PHOTOS.run.alt,
    title: 'Take it into the street.',
    ratio: 4 / 3,
  },
  {
    src: PHOTOS.night.src,
    alt: PHOTOS.night.alt,
    title: 'Challenge week. 19–28 October 2026.',
    ratio: 4 / 3,
  },
];

export const CARD_STACK_DEFAULTS = {
  maxRotate: 5,
  minSpeed: 50,
  minDistanceRatio: 0.5,
  swipeStiffness: 600,
  swipeDamping: 50,
  returnStiffness: 300,
  restStiffness: 600,
  restDamping: 30,
  stackSize: 400,
  images: CARD_STACK_IMAGES,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export type PresenceMode = 'sync' | 'wait' | 'popLayout';
export const PRESENCE_MODE_OPTIONS = ['sync', 'wait', 'popLayout'] as const;

export const CLERK_CARD_STACK_DEFAULTS = {
  bounce: 0.3,
  visualDuration: 0.4,
  overlayY: 100,
  recedeY: -10,
  recedeScale: 0.95,
  dimOpacity: 0.6,
  otpLength: 6,
  presenceMode: 'popLayout' as PresenceMode,
  heading: 'Join Uncomfortable Academy',
  description: 'Enter the email on your Week 0 page.',
  verifyHeading: 'Enter the Lounge code',
  verifyDescription: 'We sent a code to the email on your Week 0 page.',
  submitLabel: 'Send code',
  verifyLabel: 'Enter Lounge',
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export type NotificationItem = {
  title: string;
  body: string;
};

export const ACADEMY_NOTIFICATIONS: NotificationItem[] = [
  {
    title: 'Week 0 page is live',
    body: 'Goal $3,000. Later weeks stay locked until this page is live.',
  },
  {
    title: 'Buddy check-in',
    body: 'Publish the page. Find your Buddy and your Team.',
  },
  {
    title: 'Challenge week',
    body: '19–28 October 2026. Do it, film it, thank people.',
  },
  {
    title: 'Learn + Do',
    body: 'Sunday: 30 minutes learn, 30 minutes do.',
  },
  {
    title: 'Inner circle',
    body: 'List 100 people. Send the first asks.',
  },
];

export const NOTIFICATIONS_STACK_DEFAULTS = {
  count: 3,
  height: 60,
  width: 280,
  gap: 8,
  scaleStep: 0.1,
  opacityStep: 0.4,
  mass: 0.7,
  stiffness: 600,
  damping: 50,
  itemDelay: 0.04,
  openY: 20,
  openScale: 0.9,
  notifications: ACADEMY_NOTIFICATIONS,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export const BADGE_STATES = {
  idle: 'Publish page',
  processing: 'Sending',
  success: 'Page live',
  error: 'Could not publish',
} as const;

export type BadgeState = keyof typeof BADGE_STATES;
export const BADGE_STATE_OPTIONS = [
  'idle',
  'processing',
  'success',
  'error',
] as const;

export const MULTI_STATE_BADGE_DEFAULTS = {
  stiffness: 600,
  damping: 30,
  shake: 6,
  successScale: 1.2,
  pulseDuration: 0.3,
  loaderPeriod: 1000,
  initialState: 'idle' as BadgeState,
  idleLabel: BADGE_STATES.idle,
  processingLabel: BADGE_STATES.processing,
  successLabel: BADGE_STATES.success,
  errorLabel: BADGE_STATES.error,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};

export type AccordionItem = {
  header: string;
  body: string[];
};

export const ACADEMY_ACCORDION_ITEMS: AccordionItem[] = [
  {
    header: 'What is Week 0?',
    body: [
      'Week 0 is Set Up. Complete the Circle profile. Say hi in the Lounge. Find your Buddy and your Team. Set the goal to $3,000. RSVP to Learn + Do.',
    ],
  },
  {
    header: 'What is the $3,000 goal?',
    body: [
      'Aim for $3,000 before Challenge week. Later weeks stay locked until the Week 0 page is live.',
    ],
  },
  {
    header: 'When is Challenge week?',
    body: [
      'Challenge week runs 19–28 October 2026. Each day: do the challenge, publish, thank, follow up.',
    ],
  },
];

export const ACCORDION_DEFAULTS = {
  duration: 0.3,
  blur: 2,
  items: ACADEMY_ACCORDION_ITEMS,
  reducedMotion: 'user' as ReducedMotionMode,
  replayNonce: 0,
};
