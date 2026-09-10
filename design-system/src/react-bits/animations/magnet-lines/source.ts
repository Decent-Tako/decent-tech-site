import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'MagnetLines',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/magnet-lines',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/MagnetLines/MagnetLines.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/MagnetLines/MagnetLines.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// paused and onAngle are local.
export const MAGNET_LINES_DEFAULTS = {
  rows: 9,
  columns: 9,
  containerSize: '80vmin',
  // Brand ink. Upstream default #efefef.
  lineColor: '#212121',
  lineWidth: '1vmin',
  lineHeight: '6vmin',
  baseAngle: -10,
  reducedMotion: 'never' as ReducedMotionMode,
};
