import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ScrollExpand',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/scroll-expand',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ScrollExpand/ScrollExpand.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ScrollExpand/ScrollExpand.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// src, mediaType, poster, alt, title, scrollHint, children, className,
// style, and useWindowScroll are not controls. The photograph and copy
// come from src/pages/content.ts. paused and onProgress are local.
export const SCROLL_EXPAND_DEFAULTS = {
  startWidth: 42,
  startHeight: 58,
  startRadius: 24,
  endRadius: 0,
  mediaZoom: 1.35,
  scrollDistance: 1.2,
  holdDistance: 0.35,
  smoothing: 0.1,
  overlayScrim: 0.45,
  enabled: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
