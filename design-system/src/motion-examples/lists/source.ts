import { PHOTOS } from '../../pages/content';

export const MOTION_RUNTIME = {
  package: 'motion',
  version: '13.2.0',
  licence: 'MIT',
  repository: 'https://github.com/motiondivision/motion',
  docsReorder: 'https://motion.dev/docs/react-reorder',
  docsAnimation: 'https://motion.dev/docs/react-animation#orchestration',
  docsPresence: 'https://motion.dev/docs/react-animate-presence',
  docsArc: 'https://motion.dev/docs/arc',
  docsMotionValue: 'https://motion.dev/docs/react-use-motion-value',
} as const;

export const PLUS_ADAPTER = {
  name: 'Academy plusAdapter',
  unpackedKb: 4,
  why: 'motion-plus 1.5.1 is MIT but exclusive to Motion+ members. npm cannot install it without membership. Motion does not export usePointerPosition. The adapter covers the used surface with motion values.',
} as const;

export const EXAMPLES = {
  todoList: {
    page: 'https://motion.dev/examples/react-todo-list',
    live: 'https://examples.motion.dev/react/todo-list',
    chunk: 'https://examples.motion.dev/assets/index-DU7YM8Py.js',
  },
  infiniteLoading: {
    page: 'https://motion.dev/examples/react-infinite-loading',
    live: 'https://examples.motion.dev/react/infinite-loading',
    chunk: 'https://examples.motion.dev/assets/index-ZybWaoTb.js',
  },
  commandPalette: {
    page: 'https://motion.dev/examples/react-command-palette',
    live: 'https://examples.motion.dev/react/command-palette',
    chunk: 'https://examples.motion.dev/assets/index-Dc9b4dWa.js',
  },
  addToBasket: {
    page: 'https://motion.dev/examples/react-add-to-basket',
    live: 'https://examples.motion.dev/react/add-to-basket',
    chunk: 'https://examples.motion.dev/assets/index-DpR4SRym.js',
  },
  bobbleHover: {
    page: 'https://motion.dev/examples/react-bobble-hover',
    live: 'https://examples.motion.dev/react/bobble-hover',
    chunk: 'https://examples.motion.dev/assets/index-VxUx2KIC.js',
  },
  materialRipple: {
    page: 'https://motion.dev/examples/react-material-design-ripple',
    live: 'https://examples.motion.dev/react/material-design-ripple',
    chunk: 'https://examples.motion.dev/assets/index-C_NhZqUQ.js',
  },
} as const;

export type ReducedMotionMode = 'user' | 'always' | 'never';
export const REDUCED_MOTION_OPTIONS = ['user', 'always', 'never'] as const;

export type ArcDirection = 'auto' | 'cw' | 'ccw';
export const ARC_DIRECTION_OPTIONS = ['auto', 'cw', 'ccw'] as const;

export function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

export type TodoItem = {
  id: number;
  text: string;
  completed: boolean;
};

export const WEEK_ZERO_TODOS: TodoItem[] = [
  { id: 0, text: 'Complete the Circle profile', completed: false },
  { id: 1, text: 'Say hi in the Lounge', completed: false },
  { id: 2, text: 'Find Buddy', completed: false },
  { id: 3, text: 'Find Team', completed: false },
  { id: 4, text: 'Set the goal to $3,000', completed: false },
  { id: 5, text: 'RSVP to Learn + Do', completed: false },
  { id: 6, text: 'Publish the page', completed: false },
  { id: 7, text: 'Map the inner circle', completed: false },
];

export const TODO_LIST_DEFAULTS = {
  textDuration: 0.4,
  strikeDuration: 0.4,
  completeDelay: 600,
  reducedMotion: 'user' as ReducedMotionMode,
};

export type NewsItemData = {
  headline: string;
  subtitle: string;
};

export const ACADEMY_NEWS: NewsItemData[] = [
  {
    headline: 'Week 0 is Set Up. Publish the page before the first session.',
    subtitle:
      'Complete the Circle profile. Say hi in the Lounge. Find Buddy and Team.',
  },
  {
    headline: 'The participant goal is $3,000 before 19 October 2026.',
    subtitle: 'Weekly time is one to two hours. State the next action.',
  },
  {
    headline: 'Challenge week runs 19–28 October 2026.',
    subtitle: 'Each day: do it, film it, thank people, follow up.',
  },
  {
    headline: 'Learn + Do is 30 minutes learn, then 30 minutes do.',
    subtitle: 'The Team Leader keeps the Team moving on Sunday sessions.',
  },
  {
    headline: 'Buddy is the person you check in with most.',
    subtitle: 'Share what works. Move when one of you stalls. Do not say squad.',
  },
  {
    headline: 'The 100-person tracker starts with the inner circle.',
    subtitle: 'List people you can name. Send the first asks from that list.',
  },
  {
    headline: 'Keep the line short enough to say out loud.',
    subtitle:
      'Say the challenge, why it is uncomfortable, why Mobilise, and the next step.',
  },
  {
    headline: 'Take it into the street during Challenge week.',
    subtitle: 'Film the work. Thank the people who gave. Follow up the next day.',
  },
  {
    headline: 'Six published weeks sit in Learn.',
    subtitle: 'Finish the current lesson and its action before the next week opens.',
  },
  {
    headline: 'The Lounge is where Buddy and Team talk.',
    subtitle: 'Escalate craft and safety questions to the Team Leader.',
  },
  {
    headline: 'RSVP to Learn + Do before Week 0 closes.',
    subtitle: 'The session does not replace the published page. Both are required.',
  },
  {
    headline: 'Nedd’s × Mobilise. Find Your Uncomfortable.',
    subtitle: 'A mental challenge beside the physical one. Aim for $3,000.',
  },
];

export const INFINITE_LOADING_DEFAULTS = {
  staggerDelay: 0.2,
  itemY: 20,
  itemDuration: 0.4,
  spinnerDuration: 1.5,
  batchSize: 3,
  fetchDelay: 1000,
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
};

export type CommandIconName =
  | 'profile'
  | 'lounge'
  | 'buddy'
  | 'team'
  | 'goal'
  | 'rsvp'
  | 'learn'
  | 'tracker'
  | 'plan'
  | 'publish'
  | 'events'
  | 'challenge';

export type CommandItemData = {
  label: string;
  icon: CommandIconName;
  shortcut?: string[];
  keywords?: string[];
};

export type CommandGroupData = {
  label: string;
  items: CommandItemData[];
};

export const ACADEMY_COMMANDS: CommandGroupData[] = [
  {
    label: 'Start',
    items: [
      {
        label: 'Complete Circle profile',
        icon: 'profile',
        shortcut: ['⌘', 'P'],
        keywords: ['setup', 'week 0'],
      },
      {
        label: 'Say hi in the Lounge',
        icon: 'lounge',
        shortcut: ['⌘', 'L'],
        keywords: ['hello', 'chat'],
      },
      {
        label: 'Find Buddy',
        icon: 'buddy',
        keywords: ['pair', 'check-in'],
      },
      {
        label: 'Find Team',
        icon: 'team',
        keywords: ['leader', 'group'],
      },
    ],
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'Set the goal to $3,000',
        icon: 'goal',
        shortcut: ['⌘', 'G'],
        keywords: ['fundraising', 'target'],
      },
      {
        label: 'Open the 100-person tracker',
        icon: 'tracker',
        keywords: ['inner circle', 'asks'],
      },
      {
        label: 'Open the content plan',
        icon: 'plan',
        keywords: ['ten-day', 'challenge'],
      },
      {
        label: 'Publish the page',
        icon: 'publish',
        shortcut: ['⌘', 'S'],
        keywords: ['live', 'fundraising page'],
      },
    ],
  },
  {
    label: 'Events',
    items: [
      {
        label: 'RSVP to Learn + Do',
        icon: 'rsvp',
        shortcut: ['⌘', 'R'],
        keywords: ['sunday', 'session'],
      },
      {
        label: 'Open Learn',
        icon: 'learn',
        keywords: ['weeks', 'lessons'],
      },
      {
        label: 'See Learn + Do dates',
        icon: 'events',
        keywords: ['calendar', 'sunday'],
      },
      {
        label: 'Open Challenge week',
        icon: 'challenge',
        keywords: ['19 october', '28 october', 'street'],
      },
    ],
  },
];

export const COMMAND_PALETTE_DEFAULTS = {
  dialogOffsetY: -16,
  backdropDuration: 0.2,
  dialogStiffness: 500,
  dialogDamping: 35,
  itemStiffness: 400,
  itemDamping: 30,
  placeholder: 'Search Academy commands',
  triggerLabel: 'Search Academy commands',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const ADD_TO_BASKET_DEFAULTS = {
  strength: 0.5,
  peak: 0.15,
  rotate: 0.9,
  duration: 0.45,
  basketVelocityFactor: 0.05,
  direction: 'cw' as ArcDirection,
  productName: 'Find Your Uncomfortable',
  productPrice: '$3,000 goal',
  buttonLabel: 'Add to page',
  basketLabel: 'Published page',
  photoSrc: PHOTOS.hero.src,
  photoAlt: PHOTOS.hero.alt,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const BOBBLE_TILES = [
  { label: 'Week 0', photo: PHOTOS.hero },
  { label: 'Learn', photo: PHOTOS.crowd },
  { label: 'Tools', photo: PHOTOS.community },
  { label: 'Events', photo: PHOTOS.run },
  { label: 'Lounge', photo: PHOTOS.night },
  { label: 'Buddy', photo: PHOTOS.community },
  { label: 'Team', photo: PHOTOS.crowd },
  { label: 'Challenge', photo: PHOTOS.night },
  { label: 'Street', photo: PHOTOS.run },
] as const;

export const BOBBLE_HOVER_DEFAULTS = {
  gridSize: 3,
  offsetFactor: 0.8,
  scaleFactor: 0.0008,
  stretchFactor: 0.0015,
  rotateFactor: 0.03,
  maxSpeed: 4000,
  stiffness: 200,
  damping: 7,
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const MATERIAL_RIPPLE_DEFAULTS = {
  enterDuration: 0.3,
  exitDuration: 0.55,
  hoverDuration: 0.2,
  label: 'RSVP to Learn + Do',
  reducedMotion: 'user' as ReducedMotionMode,
};
