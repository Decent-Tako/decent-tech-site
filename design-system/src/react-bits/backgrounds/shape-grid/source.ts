import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type ShapeGridDirection = 'diagonal' | 'up' | 'right' | 'down' | 'left';
export type ShapeGridShape = 'square' | 'hexagon' | 'circle' | 'triangle';

export const SHAPE_GRID_DIRECTIONS: readonly ShapeGridDirection[] = [
  'diagonal',
  'up',
  'right',
  'down',
  'left',
];

export const SHAPE_GRID_SHAPES: readonly ShapeGridShape[] = [
  'square',
  'hexagon',
  'circle',
  'triangle',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ShapeGrid',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/shape-grid',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/ShapeGrid/ShapeGrid.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/ShapeGrid/ShapeGrid.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// paused and onReady are not controls. borderColor default is brand quiet
// #A6A6A6 (upstream #999). hoverFillColor is brand ink #212121 (upstream
// #222). No npm runtime: the sketch is a 2d canvas.
export const SHAPE_GRID_DEFAULTS = {
  direction: 'right' as ShapeGridDirection,
  speed: 1,
  borderColor: '#A6A6A6',
  squareSize: 40,
  hoverFillColor: '#212121',
  shape: 'square' as ShapeGridShape,
  hoverTrailAmount: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
