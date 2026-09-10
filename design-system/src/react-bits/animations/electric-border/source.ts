import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ElectricBorder',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/electric-border',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ElectricBorder/ElectricBorder.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ElectricBorder/ElectricBorder.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop, with the upstream default. children, className,
// and style are not controls: the wrapper owns the card content.
export const ELECTRIC_BORDER_DEFAULTS = {
  color: '#0035B1',
  speed: 1,
  chaos: 0.12,
  borderRadius: 24,
  reducedMotion: 'never' as ReducedMotionMode,
};
