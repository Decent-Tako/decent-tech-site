import { PHOTOS } from '../../pages/content';

export const MOTION_RUNTIME = {
  package: 'motion',
  version: '13.2.0',
  licence: 'MIT',
  repository: 'https://github.com/motiondivision/motion',
} as const;

export const EXAMPLES = {
  folder: {
    page: 'https://motion.dev/examples/react-ios-app-folder',
    live: 'https://examples.motion.dev/react/ios-app-folder',
    docs: 'https://motion.dev/docs/react-layout-animations',
    source: 'https://examples.motion.dev/assets/index-Sp96MKFo.js',
  },
  slider: {
    page: 'https://motion.dev/examples/react-ios-slider',
    live: 'https://examples.motion.dev/react/ios-slider',
    docs: 'https://motion.dev/docs/react-use-transform',
    source: 'https://examples.motion.dev/assets/index-BE1CYj2e.js',
  },
  exposure: {
    page: 'https://motion.dev/examples/react-carousel-ios-exposure-slider',
    live: 'https://examples.motion.dev/react/carousel-ios-exposure-slider',
    docs: 'https://motion.dev/docs/react-carousel',
    source: 'https://examples.motion.dev/assets/index-BfzyINdC.js',
  },
  reveal: {
    page: 'https://motion.dev/examples/react-image-reveal-slider',
    live: 'https://examples.motion.dev/react/image-reveal-slider',
    docs: 'https://motion.dev/docs/react-drag',
    source: 'https://examples.motion.dev/assets/index-CSAyuGZ2.js',
  },
  aspect: {
    page: 'https://motion.dev/examples/react-aspect-ratio',
    live: 'https://examples.motion.dev/react/aspect-ratio',
    docs: 'https://motion.dev/docs/react-layout-animations',
    source: 'https://examples.motion.dev/assets/index-jhT-YRYU.js',
  },
} as const;

export type ReducedMotionMode = 'user' | 'always' | 'never';
export const REDUCED_MOTION_OPTIONS = ['user', 'always', 'never'] as const;

export type PresenceMode = 'sync' | 'wait' | 'popLayout';
export const PRESENCE_MODE_OPTIONS = ['sync', 'wait', 'popLayout'] as const;

export function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

export type FolderItem = {
  key: string;
  layoutId?: string;
  name: string;
  iconSrc: string;
  iconAlt: string;
};

export const FOLDER_ITEMS: FolderItem[] = [
  {
    key: 'start',
    name: 'Start',
    iconSrc: PHOTOS.hero.src,
    iconAlt: PHOTOS.hero.alt,
  },
  {
    key: 'learn',
    name: 'Learn',
    iconSrc: PHOTOS.crowd.src,
    iconAlt: PHOTOS.crowd.alt,
  },
  {
    key: 'tools',
    name: 'Tools',
    iconSrc: PHOTOS.community.src,
    iconAlt: PHOTOS.community.alt,
  },
  {
    key: 'events',
    name: 'Events',
    iconSrc: PHOTOS.run.src,
    iconAlt: PHOTOS.run.alt,
  },
  {
    key: 'goal',
    layoutId: 'app-goal',
    name: 'Goal',
    iconSrc: PHOTOS.night.src,
    iconAlt: PHOTOS.night.alt,
  },
  {
    key: 'buddy',
    layoutId: 'app-buddy',
    name: 'Buddy',
    iconSrc: PHOTOS.hero.src,
    iconAlt: PHOTOS.hero.alt,
  },
  {
    key: 'challenge',
    layoutId: 'app-challenge',
    name: 'Challenge',
    iconSrc: PHOTOS.crowd.src,
    iconAlt: PHOTOS.crowd.alt,
  },
  {
    key: 'street',
    layoutId: 'app-street',
    name: 'Street',
    iconSrc: PHOTOS.run.src,
    iconAlt: PHOTOS.run.alt,
  },
];

export const FOLDER_DEFAULTS = {
  title: 'Uncomfortable Academy',
  stiffness: 200,
  damping: 22,
  bounce: 0,
  titleStiffness: 200,
  titleDamping: 19,
  presenceMode: 'popLayout' as PresenceMode,
  initialOpen: false,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const SLIDER_DEFAULTS = {
  maxPull: 20,
  maxSquish: 0.92,
  maxStretch: 1.08,
  keyboardStep: 0.05,
  keyboardStiffness: 200,
  keyboardDamping: 60,
  initialProgress: 0.5,
  caption: 'Raised toward $3,000',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const EXPOSURE_DEFAULTS = {
  initialExposure: 0,
  notchStep: 5,
  bounce: 0.2,
  duration: 0.8,
  gap: 0,
  snap: false,
  loop: false,
  overflow: true,
  photoSrc: PHOTOS.night.src,
  photoAlt: PHOTOS.night.alt,
  caption: 'Night outreach. Set exposure before you publish.',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const REVEAL_DEFAULTS = {
  src: PHOTOS.hero.src,
  alt: PHOTOS.hero.alt,
  overlayAlt: `${PHOTOS.hero.alt}, greyscale overlay`,
  step: 50,
  dragElastic: 0.05,
  keyboardStiffness: 900,
  keyboardDamping: 40,
  caption: 'Week 0. Pull colour across the page.',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const ASPECT_DEFAULTS = {
  aspectRatio: 1,
  width: 100,
  debounceDuration: 0.2,
  borderRadius: 20,
  minAspect: 0.1,
  maxAspect: 5,
  aspectStep: 0.1,
  minWidth: 10,
  maxWidth: 1000,
  widthStep: 5,
  heading: 'Week 0 page crop',
  photoSrc: PHOTOS.crowd.src,
  photoAlt: PHOTOS.crowd.alt,
  reducedMotion: 'user' as ReducedMotionMode,
};
