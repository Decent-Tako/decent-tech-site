import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GhostCursor',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/ghost-cursor',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/GhostCursor/GhostCursor.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/GhostCursor/GhostCursor.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'three',
      version: '0.180.0',
      licence: 'MIT',
      unpackedKb: 30044,
      why: 'The upstream file builds a Three.js shader trail, bloom, and film grain. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

export const MIX_BLEND_MODES = ['normal', 'screen', 'plus-lighter', 'multiply'] as const;

// One entry per upstream prop, with the upstream default. fadeDelayMs and
// fadeDurationMs use the desktop values. Touch devices use 500 and 1000
// upstream. targetPixels uses the desktop budget. className and style are
// not controls.
export const GHOST_CURSOR_DEFAULTS = {
  trailLength: 50,
  inertia: 0.5,
  grainIntensity: 0.05,
  bloomStrength: 0.1,
  bloomRadius: 1.0,
  bloomThreshold: 0.025,
  brightness: 1,
  color: '#0035B1',
  mixBlendMode: 'screen' as (typeof MIX_BLEND_MODES)[number],
  edgeIntensity: 0,
  maxDevicePixelRatio: 0.5,
  targetPixels: 1300000,
  fadeDelayMs: 1000,
  fadeDurationMs: 1500,
  zIndex: 10,
  reducedMotion: 'never' as ReducedMotionMode,
};
