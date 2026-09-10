import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LineSidebar',
  section: 'Components',
  page: 'https://reactbits.dev/components/line-sidebar',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/LineSidebar/LineSidebar.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/LineSidebar/LineSidebar.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const LINE_SIDEBAR_FALLOFFS = ['linear', 'smooth', 'sharp'] as const;

export type LineSidebarFalloff = (typeof LINE_SIDEBAR_FALLOFFS)[number];

// One entry per upstream prop a person can set. `items`, `onItemClick`, and
// `className` are not controls: the wrapper supplies PAGE_NAV and writes
// the active index onto the stage.
export const LINE_SIDEBAR_DEFAULTS = {
  accentColor: '#0035B1',
  textColor: '#A6A6A6',
  markerColor: '#4A4A4A',
  showIndex: true,
  showMarker: true,
  proximityRadius: 100,
  maxShift: 30,
  falloff: 'smooth' as LineSidebarFalloff,
  markerLength: 60,
  markerGap: 0,
  tickScale: 0.5,
  scaleTick: true,
  itemGap: 20,
  fontSize: 1.1,
  smoothing: 100,
  defaultActive: null as number | null,
  reducedMotion: 'never' as ReducedMotionMode,
};
