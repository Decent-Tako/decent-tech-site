import { PHOTOS } from '../../pages/content';

export const MOTION_PACKAGE = 'motion';
export const MOTION_VERSION = '13.2.0';
export const MOTION_LICENCE = 'MIT';
export const MOTION_REPO = 'https://github.com/motiondivision/motion';
export const MOTION_DOCS = 'https://motion.dev/docs/react-animate-presence';

export type ReducedMotionMode = 'user' | 'always' | 'never';
export type PresenceMode = 'sync' | 'wait' | 'popLayout';

export const REDUCED_MOTION_OPTIONS = ['user', 'always', 'never'] as const;
export const PRESENCE_MODE_OPTIONS = ['sync', 'wait', 'popLayout'] as const;

export function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

export const PRESENCE_EXAMPLES = {
  enter: {
    slug: 'react-enter-animation',
    title: 'Enter animation',
    docs: 'https://motion.dev/docs/react-animation',
    example: 'https://motion.dev/examples/react-enter-animation',
    live: 'https://examples.motion.dev/react/enter-animation',
    mechanism:
      'motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}. transition.duration 0.4 s. Scale spring visualDuration 0.4 bounce 0.5. No AnimatePresence. Mount is the enter.',
  },
  exit: {
    slug: 'react-exit-animation',
    title: 'Exit animation',
    docs: 'https://motion.dev/docs/react-animate-presence',
    example: 'https://motion.dev/examples/react-exit-animation',
    live: 'https://examples.motion.dev/react/exit-animation',
    mechanism:
      'AnimatePresence initial={false} around a keyed motion.div. initial and exit { opacity: 0, scale: 0 }. animate { opacity: 1, scale: 1 }. Hide/Show toggles isVisible. motion.button whileTap={{ y: 1 }}.',
  },
  modes: {
    slug: 'react-animate-presence-modes',
    title: 'AnimatePresence modes',
    docs: 'https://motion.dev/docs/react-animate-presence',
    example: 'https://motion.dev/examples/react-animate-presence-modes',
    live: 'https://examples.motion.dev/react/animate-presence-modes',
    mechanism:
      'Three AnimatePresence nodes, mode sync, wait, and popLayout, share one state boolean. Each child keys on String(state). initial scale 0.6, animate scale 1, exit scale 0.8, duration 0.3 s. wait uses different enter and exit cubic-beziers.',
  },
  presenceData: {
    slug: 'react-use-presence-data',
    title: 'usePresenceData',
    docs: 'https://motion.dev/docs/react-animate-presence',
    example: 'https://motion.dev/examples/react-use-presence-data',
    live: 'https://examples.motion.dev/react/use-presence-data',
    mechanism:
      'AnimatePresence custom={direction} initial={false} mode="popLayout". Slide is forwardRef. usePresenceData() reads direction on the exiting slide. wrap(1, items.length, selectedItem + newDirection) advances the index.',
  },
  transition: {
    slug: 'react-transition',
    title: 'Transition',
    docs: 'https://motion.dev/docs/react-transitions',
    example: 'https://motion.dev/examples/react-transition',
    live: 'https://examples.motion.dev/react/transition',
    mechanism:
      'motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}. No AnimatePresence.',
  },
} as const;

export const ACADEMY_SLIDES = [
  {
    id: 1,
    kicker: 'Week 0',
    title: 'Set Up',
    photo: PHOTOS.hero,
  },
  {
    id: 2,
    kicker: 'Week 1',
    title: 'Finding your why',
    photo: PHOTOS.crowd,
  },
  {
    id: 3,
    kicker: 'Week 2',
    title: 'The ask',
    photo: PHOTOS.community,
  },
  {
    id: 4,
    kicker: 'Week 3',
    title: 'The tracker',
    photo: PHOTOS.run,
  },
  {
    id: 5,
    kicker: 'Week 4',
    title: 'Into the street',
    photo: PHOTOS.night,
  },
  {
    id: 6,
    kicker: '19–28 Oct',
    title: 'Challenge week',
    photo: PHOTOS.hero,
  },
] as const;
