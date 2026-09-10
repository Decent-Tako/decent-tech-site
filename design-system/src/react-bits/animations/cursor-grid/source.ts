import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CursorGrid',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/cursor-grid',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/CursorGrid/CursorGrid.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/CursorGrid/CursorGrid.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const CURSOR_GRID_DEFAULTS = {
  cellSize: 70,
  // Brand accent blue. Upstream default #D946EF.
  color: '#0035B1',
  radius: 140,
  falloff: 'smooth' as 'linear' | 'smooth' | 'sharp',
  holdTime: 400,
  fadeDuration: 800,
  lineWidth: 1.2,
  maxOpacity: 1,
  fillOpacity: 0,
  gridOpacity: 0,
  cellRadius: 0,
  clickPulse: true,
  pulseSpeed: 600,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const FALLOFFS = ['linear', 'smooth', 'sharp'] as const;
