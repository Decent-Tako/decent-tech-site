import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GradualBlur',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/gradual-blur',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/GradualBlur/GradualBlur.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/GradualBlur/GradualBlur.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const BLUR_POSITIONS = ['top', 'bottom', 'left', 'right'] as const;
export const BLUR_CURVES = ['linear', 'bezier', 'ease-in', 'ease-out', 'ease-in-out'] as const;
export const BLUR_TARGETS = ['parent', 'page'] as const;
export const BLUR_PRESETS = [
  '',
  'top',
  'bottom',
  'left',
  'right',
  'subtle',
  'intense',
  'smooth',
  'sharp',
  'header',
  'footer',
  'sidebar',
  'page-header',
  'page-footer',
] as const;
export const BLUR_ANIMATED = [false, true, 'scroll'] as const;

// One entry per upstream prop, with the upstream default from DEFAULT_CONFIG.
// children, className, style, onAnimationComplete, and unused gpuOptimized
// are not controls.
export const GRADUAL_BLUR_DEFAULTS = {
  position: 'bottom' as (typeof BLUR_POSITIONS)[number],
  strength: 2,
  height: '6rem',
  width: '',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false as (typeof BLUR_ANIMATED)[number],
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear' as (typeof BLUR_CURVES)[number],
  responsive: false,
  mobileHeight: '',
  tabletHeight: '',
  desktopHeight: '',
  mobileWidth: '',
  tabletWidth: '',
  desktopWidth: '',
  preset: '' as (typeof BLUR_PRESETS)[number],
  hoverIntensity: 0,
  target: 'parent' as (typeof BLUR_TARGETS)[number],
  reducedMotion: 'never' as ReducedMotionMode,
};
