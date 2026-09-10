import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Noise',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/noise',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Noise/Noise.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Noise/Noise.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// paused, onReady, and onUnavailable are local. patternSize, patternScaleX,
// and patternScaleY stay as controls even though the vendored draw path
// does not sample them.
export const NOISE_DEFAULTS = {
  patternSize: 250,
  patternScaleX: 1,
  patternScaleY: 1,
  patternRefreshInterval: 2,
  patternAlpha: 15,
  reducedMotion: 'never' as ReducedMotionMode,
};
