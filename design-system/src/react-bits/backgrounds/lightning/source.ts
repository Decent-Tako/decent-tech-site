import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Lightning',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/lightning',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Lightning/Lightning.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Lightning/Lightning.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// paused, onReady, and onError are not controls. Hue 230 is a blue near
// brand accent-blue #0035B1 (hue about 221).
export const LIGHTNING_DEFAULTS = {
  hue: 230,
  xOffset: 0,
  speed: 1,
  intensity: 1,
  size: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};
