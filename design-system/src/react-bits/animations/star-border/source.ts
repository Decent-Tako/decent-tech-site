import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'StarBorder',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/star-border',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/StarBorder/StarBorder.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/StarBorder/StarBorder.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// as, className, children, and rest are not controls. The label is the
// Week 0 call to action from src/pages/content.ts. paused and reduced are local.
export const STAR_BORDER_DEFAULTS = {
  // Brand accent yellow. Upstream default white.
  color: '#DEF54F',
  speed: '6s',
  thickness: 1,
  // Brand ink. Upstream default #000000.
  backgroundColor: '#212121',
  // Brand paper. Upstream default #ffffff.
  textColor: '#FFFFFF',
  // Brand charcoal. Upstream default #222222.
  borderColor: '#4A4A4A',
  reducedMotion: 'never' as ReducedMotionMode,
};
