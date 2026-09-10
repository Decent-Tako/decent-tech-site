import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DotField',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/dot-field',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/DotField/DotField.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/DotField/DotField.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// paused, onReady, and onError are not controls. Colour defaults are brand
// tokens: gradientFrom accent-blue, gradientTo accent-yellow, glowColor paper.
// Upstream gradientFrom rgba(168, 85, 247, 0.35), gradientTo rgba(180, 151, 207, 0.25),
// glowColor #120F17. Brand colours are opaque so play can sample the dots.
export const DOT_FIELD_DEFAULTS = {
  dotRadius: 1.5,
  dotSpacing: 14,
  cursorRadius: 500,
  cursorForce: 0.1,
  bulgeOnly: true,
  bulgeStrength: 67,
  glowRadius: 160,
  sparkle: false,
  waveAmplitude: 0,
  gradientFrom: 'rgba(0, 53, 177, 1)',
  gradientTo: 'rgba(222, 245, 79, 1)',
  glowColor: '#FFFFFF',
  reducedMotion: 'never' as ReducedMotionMode,
};
