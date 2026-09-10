import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Waves',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/waves',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Waves/Waves.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Waves/Waves.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// paused, onReady, className, and style are not controls. lineColor default
// is brand ink #212121 (upstream black). backgroundColor is brand paper
// #FFFFFF (upstream transparent).
export const WAVES_DEFAULTS = {
  lineColor: '#212121',
  backgroundColor: '#FFFFFF',
  waveSpeedX: 0.0125,
  waveSpeedY: 0.005,
  waveAmpX: 32,
  waveAmpY: 16,
  xGap: 10,
  yGap: 32,
  friction: 0.925,
  tension: 0.005,
  maxCursorMove: 100,
  reducedMotion: 'never' as ReducedMotionMode,
};
