import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'BorderGlow',
  section: 'Components',
  page: 'https://reactbits.dev/components/border-glow',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/BorderGlow/BorderGlow.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/BorderGlow/BorderGlow.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop a person can set. `children` and `className`
// are not controls: the wrapper supplies Academy copy and a photograph.
export const BORDER_GLOW_DEFAULTS = {
  edgeSensitivity: 30,
  glowColor: '68 90 64',
  backgroundColor: '#212121',
  borderRadius: 28,
  glowRadius: 40,
  glowIntensity: 1.0,
  coneSpread: 25,
  animated: false,
  colors: ['#0035B1', '#DEF54F', '#FFFFFF'],
  fillOpacity: 0.5,
  reducedMotion: 'never' as ReducedMotionMode,
};
