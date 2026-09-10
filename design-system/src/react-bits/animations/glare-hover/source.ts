import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GlareHover',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/glare-hover',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/GlareHover/GlareHover.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/GlareHover/GlareHover.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop, with the upstream default. children, className,
// and style are not controls: the wrapper owns the card content.
export const GLARE_HOVER_DEFAULTS = {
  width: '500px',
  height: '500px',
  background: '#212121',
  borderRadius: '10px',
  borderColor: '#4A4A4A',
  glareColor: '#FFFFFF',
  glareOpacity: 0.5,
  glareAngle: -45,
  glareSize: 250,
  transitionDuration: 650,
  playOnce: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
