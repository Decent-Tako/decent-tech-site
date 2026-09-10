import { PHOTOS } from '../../pages/content';

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const ZOOM_DEFAULTS = {
  scaleTo: 1.5,
  blurTo: 10,
  fadeStart: 0.8,
  textYTo: -30,
  textFadeAt: 0.4,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const ZOOM_OFFSET = ['start start', 'end start'] as const;
export const ZOOM_PHOTO = PHOTOS.hero;
export const ZOOM_TITLE = 'Uncomfortable';
export const ZOOM_KICKER = "Nedd's × Mobilise";
export const ZOOM_BODY =
  'A mental challenge beside the physical one. Set the goal to $3,000. Challenge week runs 19–28 October 2026.';
export const DEMO_DURATION = 1.6;
export const DEMO_PROGRESS = 0.7;
