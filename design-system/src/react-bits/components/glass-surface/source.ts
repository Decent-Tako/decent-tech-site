import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const GLASS_CHANNELS = ['R', 'G', 'B'] as const;
export type GlassChannel = (typeof GLASS_CHANNELS)[number];

export const GLASS_BLEND_MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
  'plus-darker',
  'plus-lighter',
] as const;
export type GlassBlendMode = (typeof GLASS_BLEND_MODES)[number];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GlassSurface',
  section: 'Components',
  page: 'https://reactbits.dev/components/glass-surface',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/GlassSurface/GlassSurface.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/GlassSurface/GlassSurface.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop a person can set. `children`, `className`,
// and `style` are not controls: the wrapper supplies Academy copy over a
// photograph.
export const GLASS_SURFACE_DEFAULTS = {
  width: 200,
  height: 80,
  borderRadius: 20,
  borderWidth: 0.07,
  brightness: 50,
  opacity: 0.93,
  blur: 11,
  displace: 0,
  backgroundOpacity: 0,
  saturation: 1,
  distortionScale: -180,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20,
  xChannel: 'R' as GlassChannel,
  yChannel: 'G' as GlassChannel,
  mixBlendMode: 'difference' as GlassBlendMode,
  reducedMotion: 'never' as ReducedMotionMode,
};
