import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DriftWall',
  section: 'Components',
  page: 'https://reactbits.dev/components/drift-wall',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DriftWall/DriftWall.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/DriftWall/DriftWall.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const DRIFT_DIRECTIONS = ['up', 'down'] as const;

// One entry per upstream prop a person can set. `items`, `className`,
// `style`, `paused`, and `onActive` are not controls: the wrapper supplies
// Academy photographs and writes the active tile onto the stage.
export const DRIFT_WALL_DEFAULTS = {
  columns: 5,
  tileWidth: 200,
  tileHeight: 132,
  gap: 18,
  radius: 14,
  tilt: 16,
  turn: -14,
  roll: 0,
  perspective: 1200,
  depth: 120,
  speed: 42,
  direction: 'up' as (typeof DRIFT_DIRECTIONS)[number],
  variance: 0.45,
  parallax: 0.6,
  pauseOnHover: false,
  lift: 64,
  fade: 0.6,
  dim: 0.55,
  grayscale: false,
  overlayColor: '#212121',
  reducedMotion: 'never' as ReducedMotionMode,
};
