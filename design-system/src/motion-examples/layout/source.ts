import { PHOTOS } from '../../pages/content';

export const MOTION_RUNTIME = {
  package: 'motion',
  version: '13.2.0',
  licence: 'MIT',
  repository: 'https://github.com/motiondivision/motion',
  docsLayout: 'https://motion.dev/docs/react-layout-animations',
  docsReorder: 'https://motion.dev/docs/react-reorder',
} as const;

export const EXAMPLES = {
  layoutAnimation: {
    page: 'https://motion.dev/examples/react-layout-animation',
    live: 'https://examples.motion.dev/react/layout-animation',
  },
  layoutAnchor: {
    page: 'https://motion.dev/examples/react-layout-anchor',
    live: 'https://examples.motion.dev/react/layout-anchor',
  },
  sharedLayout: {
    page: 'https://motion.dev/examples/react-shared-layout-animation',
    live: 'https://examples.motion.dev/react/shared-layout-animation',
  },
  reorderGrid: {
    page: 'https://motion.dev/examples/react-reorder-grid',
    live: 'https://examples.motion.dev/react/reorder-grid',
  },
  reorderItems: {
    page: 'https://motion.dev/examples/react-reorder-items',
    live: 'https://examples.motion.dev/react/reorder-items',
  },
} as const;

export type ReducedMotionMode = 'user' | 'always' | 'never';
export const REDUCED_MOTION_OPTIONS = ['user', 'always', 'never'] as const;

export type LayoutMode = true | 'position' | 'size';
export const LAYOUT_MODE_OPTIONS = [true, 'position', 'size'] as const;

export type PresenceMode = 'sync' | 'wait' | 'popLayout';
export const PRESENCE_MODE_OPTIONS = ['sync', 'wait', 'popLayout'] as const;

export type ReorderAxis = 'auto' | 'x' | 'y' | 'xy';
export const REORDER_AXIS_OPTIONS = ['auto', 'x', 'y', 'xy'] as const;

export function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

export const LAYOUT_ANIMATION_DEFAULTS = {
  layout: true as LayoutMode,
  visualDuration: 0.2,
  bounce: 0.2,
  heading: 'Publish the page.',
  offLabel: 'Draft',
  onLabel: 'Live',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const LAYOUT_ANCHOR_DEFAULTS = {
  anchorX: 0.5,
  anchorY: 0.5,
  duration: 0.8,
  delay: 0.8,
  collapsedSize: 150,
  expandedSize: 300,
  childCollapsed: 70,
  childExpanded: 100,
  heading: 'Week 0',
  goal: '$3,000',
  copy: 'Set the goal. Then publish the page.',
  photoSrc: PHOTOS.hero.src,
  photoAlt: PHOTOS.hero.alt,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const SHARED_LAYOUT_TABS = [
  {
    id: 'start',
    label: 'Start',
    kicker: 'Week 0',
    copy: 'Set the goal to $3,000. Find Buddy and Team. Publish the page.',
    photo: PHOTOS.hero,
  },
  {
    id: 'learn',
    label: 'Learn',
    kicker: 'Six weeks',
    copy: 'Complete one week at a time. Finish the action before the next week opens.',
    photo: PHOTOS.crowd,
  },
  {
    id: 'challenge',
    label: 'Challenge',
    kicker: '19–28 October 2026',
    copy: 'Do it, film it, thank people. Aim for $3,000 before this week starts.',
    photo: PHOTOS.night,
  },
] as const;

export type SharedTabId = (typeof SHARED_LAYOUT_TABS)[number]['id'];

export const SHARED_LAYOUT_DEFAULTS = {
  presenceMode: 'wait' as PresenceMode,
  duration: 0.2,
  yFrom: 10,
  heading: 'Academy weeks',
  reducedMotion: 'user' as ReducedMotionMode,
};

export const GRID_ITEMS = [
  { id: 'profile', label: 'Circle profile' },
  { id: 'lounge', label: 'Lounge hello' },
  { id: 'buddy', label: 'Find Buddy' },
  { id: 'team', label: 'Find Team' },
  { id: 'goal', label: 'Set $3,000' },
  { id: 'rsvp', label: 'RSVP Learn + Do' },
  { id: 'publish', label: 'Publish page' },
  { id: 'tracker', label: '100-person tracker' },
  { id: 'inner', label: 'Inner circle' },
  { id: 'plan', label: 'Content plan' },
  { id: 'do', label: 'Do it' },
  { id: 'film', label: 'Film it' },
  { id: 'thank', label: 'Thank people' },
  { id: 'follow', label: 'Follow up' },
  { id: 'street', label: 'Take it to the street' },
  { id: 'checkin', label: 'Buddy check-in' },
] as const;

export type GridItemId = (typeof GRID_ITEMS)[number]['id'];

export const REORDER_GRID_DEFAULTS = {
  dragScale: 1.08,
  stiffness: 350,
  damping: 30,
  axis: 'xy' as ReorderAxis,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const REORDER_ITEM_TILES = [
  {
    id: 'start',
    label: 'Start',
    photo: PHOTOS.hero,
  },
  {
    id: 'learn',
    label: 'Learn',
    photo: PHOTOS.crowd,
  },
  {
    id: 'tools',
    label: 'Tools',
    photo: PHOTOS.community,
  },
  {
    id: 'challenge',
    label: 'Challenge week',
    photo: PHOTOS.night,
  },
] as const;

export type ReorderTileId = (typeof REORDER_ITEM_TILES)[number]['id'];

export const REORDER_ITEMS_DEFAULTS = {
  intervalMs: 1000,
  stiffness: 300,
  damping: 20,
  layout: true as LayoutMode,
  paused: false,
  reducedMotion: 'user' as ReducedMotionMode,
};

export function shuffleTiles<T>(items: readonly T[]): T[] {
  const next = [...items].sort(() => Math.random() - 0.5);
  if (items.length > 1 && next.every((item, index) => item === items[index])) {
    return [items[1], items[0], ...items.slice(2)];
  }
  return next;
}
