import { PHOTOS } from '../../pages/content';

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const TEXT_RANGE = [0.15, 0.35, 0.65, 0.85] as const;
export const IMAGE_SPEED_SCALE = 25;
export const PARALLAX_OFFSET = ['start end', 'end start'] as const;
export const DEMO_DURATION = 2.2;
export const DEMO_PROGRESS = 0.55;

export const PARALLAX_DEFAULTS = {
  imageSpeed: 0.3,
  textY: 30,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const PARALLAX_SECTIONS = [
  {
    id: 'start',
    title: 'Start',
    subtitle: 'Week 0. Set the goal to $3,000. Publish the page.',
    photo: PHOTOS.hero,
  },
  {
    id: 'learn',
    title: 'Learn',
    subtitle: 'Six weeks. Finish one lesson before the next opens.',
    photo: PHOTOS.crowd,
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'Map 100 people. Start with the inner circle.',
    photo: PHOTOS.community,
  },
  {
    id: 'challenge',
    title: 'Challenge',
    subtitle: '19–28 October 2026. Do it, film it, thank people.',
    photo: PHOTOS.night,
  },
] as const;
