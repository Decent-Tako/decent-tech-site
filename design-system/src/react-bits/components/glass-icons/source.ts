import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const GLASS_ICON_PALETTES = ['named', 'brand'] as const;
export type GlassIconPalette = (typeof GLASS_ICON_PALETTES)[number];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GlassIcons',
  section: 'Components',
  page: 'https://reactbits.dev/components/glass-icons',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/GlassIcons/GlassIcons.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/GlassIcons/GlassIcons.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per wrapper control. `items` and `className` are not
// controls: the wrapper supplies PAGE_NAV labels. `palette` maps each
// item.color to the named upstream gradients or brand hex values.
export const GLASS_ICONS_DEFAULTS = {
  palette: 'named' as GlassIconPalette,
  reducedMotion: 'never' as ReducedMotionMode,
};
