import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GlowCursor',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/glow-cursor',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/GlowCursor/GlowCursor.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/GlowCursor/GlowCursor.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'ogl',
      version: '1.0.11',
      licence: 'Unlicense',
      unpackedKb: 413,
      why: 'The upstream file builds an OGL triangle and a fragment shader that samples a pointer trail. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const GLOW_BLEND_MODES = ['normal', 'screen', 'plus-lighter'] as const;

// One entry per upstream prop, with the upstream default. children, className,
// and style are not controls: the wrapper owns the card content.
export const GLOW_CURSOR_DEFAULTS = {
  color: '#0035B1',
  secondaryColor: '#DEF54F',
  trailLength: 40,
  trailWidth: 8,
  trailTaper: 0.8,
  followSpeed: 0.16,
  glowIntensity: 1.9,
  glowSpread: 1.2,
  hotspot: 0.65,
  brightness: 1.25,
  opacity: 1,
  pulseSpeed: 1.1,
  noiseStrength: 0.035,
  idleFade: true,
  idleTimeout: 700,
  fadeDuration: 900,
  blendMode: 'screen' as (typeof GLOW_BLEND_MODES)[number],
  maxDevicePixelRatio: 1.5,
  enabled: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
