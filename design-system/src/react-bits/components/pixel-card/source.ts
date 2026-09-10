import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PixelCard',
  section: 'Components',
  page: 'https://reactbits.dev/components/pixel-card',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/PixelCard/PixelCard.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/PixelCard/PixelCard.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const PIXEL_CARD_VARIANTS = ['default', 'blue', 'yellow', 'pink'] as const;

// One entry per upstream prop a person can set. `children` and `className`
// are not controls: the wrapper supplies the Week 0 card. Brand colours
// replace the upstream default slate list with ink, accent blue, and
// charcoal. The default variant gap and speed are 5 and 35.
export const PIXEL_CARD_DEFAULTS = {
  variant: 'default' as (typeof PIXEL_CARD_VARIANTS)[number],
  gap: 5,
  speed: 35,
  colors: '#212121,#0035B1,#4A4A4A',
  noFocus: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
