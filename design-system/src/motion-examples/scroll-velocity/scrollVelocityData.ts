import { PHOTOS } from '../../pages/content';

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const VELOCITY_PHOTOS = [
  PHOTOS.hero,
  PHOTOS.crowd,
  PHOTOS.community,
  PHOTOS.run,
  PHOTOS.night,
] as const;

export const VELOCITY_LABELS = [
  'Week 0',
  'Start',
  'Learn',
  'Tools',
  'Events',
  'Lounge',
  'Buddy',
  'Team',
  'Goal',
  'Tracker',
  'Challenge',
  'Street',
  'Ask',
  'Thank',
  'Follow up',
  'Publish',
] as const;

export const SCRAMBLE_CHARS =
  '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▀▄■□▪▫●○◆◇◈◊※†‡';

export const VELOCITY_DEFAULTS = {
  stiffness: 100,
  damping: 30,
  mass: 0.5,
  waveStiffness: 300,
  waveDamping: 20,
  waveMass: 0.3,
  waveDivisor: 50,
  waveAmount: 5,
  hoverStiffness: 400,
  hoverDamping: 25,
  planeWidth: 320,
  planeGap: -80,
  totalPlanes: 26,
  reducedMotion: 'user' as ReducedMotionMode,
};

export const PLANE_HEIGHT = 384;
export const ROTATE_Y = -50;
export const PERSPECTIVE = 2000;
export const DEMO_SCROLL = -900;
export const DEMO_DURATION = 1.4;
