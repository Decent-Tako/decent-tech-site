import {
  BookOpen,
  Calendar,
  Camera,
  Flag,
  Handshake,
  Heart,
  ListChecks,
  Map,
  Megaphone,
  MessagesSquare,
  Newspaper,
  Sparkles,
  Target,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import { PHOTOS } from '../../pages/content';

export type AcademyApp = {
  label: string;
  color: string;
  icon: LucideIcon;
  inkIcon?: boolean;
};

export const MASK_FROM =
  'radial-gradient(ellipse 0% 100px at 120% 40%, transparent 0%, #000f 0%, transparent 60%)';
export const MASK_TO =
  'radial-gradient(ellipse 300% 400px at 100% 40%, transparent 0%, #000f 300%, transparent 300% )';

/** Upstream scaleX snap-back. The ripple sheet eases with this cubic-bezier. */
export const SCALE_X_EASE = [0.7, -0.03, 0.17, 1] as const;

export const HOME_APPS: AcademyApp[] = [
  { label: 'Start', color: '#0035B1', icon: Flag },
  { label: 'Learn', color: '#212121', icon: BookOpen },
  { label: 'Tools', color: '#4A4A4A', icon: Wrench },
  { label: 'Events', color: '#0035B1', icon: Calendar },
  { label: 'Lounge', color: '#212121', icon: MessagesSquare },
  { label: 'Buddy', color: '#0035B1', icon: Users },
  { label: 'Goal', color: '#DEF54F', icon: Target, inkIcon: true },
  { label: 'Challenge', color: '#0035B1', icon: Sparkles },
  { label: 'Tracker', color: '#212121', icon: ListChecks },
  { label: 'Week 0', color: '#4A4A4A', icon: Newspaper },
  { label: 'Street', color: '#0035B1', icon: Map },
  { label: 'Film', color: '#212121', icon: Camera },
  { label: 'Thank', color: '#DEF54F', icon: Heart, inkIcon: true },
  { label: 'Publish', color: '#212121', icon: Megaphone },
  { label: 'Team', color: '#4A4A4A', icon: Handshake },
];

export const CHALLENGE_APPS: AcademyApp[] = [
  { label: 'Do it', color: '#0035B1', icon: Flag },
  { label: 'Film', color: '#212121', icon: Camera },
  { label: 'Thank', color: '#DEF54F', icon: Heart, inkIcon: true },
  { label: 'Follow up', color: '#4A4A4A', icon: Megaphone },
  { label: 'Publish', color: '#212121', icon: Newspaper },
  { label: 'Buddy', color: '#0035B1', icon: Users },
  { label: 'Team', color: '#4A4A4A', icon: Handshake },
  { label: 'Tracker', color: '#212121', icon: ListChecks },
  { label: 'Goal', color: '#DEF54F', icon: Target, inkIcon: true },
  { label: 'Street', color: '#0035B1', icon: Map },
  { label: 'Night', color: '#212121', icon: Sparkles },
  { label: 'Plan', color: '#4A4A4A', icon: BookOpen },
  { label: 'Events', color: '#0035B1', icon: Calendar },
  { label: 'Lounge', color: '#212121', icon: MessagesSquare },
  { label: 'Learn', color: '#4A4A4A', icon: Wrench },
];

export const MIX_BLEND_MODES = [
  'color-dodge',
  'screen',
  'overlay',
  'plus-lighter',
  'lighten',
  'normal',
] as const;

export type MixBlendMode = (typeof MIX_BLEND_MODES)[number];

export const TRANSFORM_ORIGINS = ['100% 0%', '50% 50%', '0% 0%'] as const;

export type TransformOrigin = (typeof TRANSFORM_ORIGINS)[number];

export const APPLE_INTELLIGENCE_DEFAULTS = {
  duration: 1.2,
  scaleXFrom: 1.7,
  scaleXTo: 1,
  scaleXDurationRatio: 0.52,
  mixBlendMode: 'color-dodge' as MixBlendMode,
  contrast: 110,
  brightness: 120,
  hueRotate: 10,
  transformOrigin: '100% 0%' as TransformOrigin,
  maskFrom: MASK_FROM,
  maskTo: MASK_TO,
  wallpaperSrc: PHOTOS.hero.src,
  wallpaperAlt: PHOTOS.hero.alt,
  heading: 'Uncomfortable Academy',
  kicker: 'Find your uncomfortable',
  reducedMotion: 'user' as const,
  replayNonce: 0,
};
