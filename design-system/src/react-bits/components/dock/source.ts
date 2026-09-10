import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Dock',
  section: 'Components',
  page: 'https://reactbits.dev/components/dock',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Dock/Dock.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Dock/Dock.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'motion',
      version: '13.2.0',
      licence: 'MIT',
      unpackedKb: 701,
      why: 'The upstream file uses motion springs and transforms to scale each item by pointer distance. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// One entry per upstream prop a person can set. `items`, `className`,
// `spring`, and `paused` are not controls: the wrapper supplies PAGE_NAV
// and splits spring into mass, stiffness, and damping.
export const DOCK_DEFAULTS = {
  distance: 200,
  panelHeight: 68,
  baseItemSize: 50,
  dockHeight: 256,
  magnification: 70,
  springMass: 0.1,
  springStiffness: 150,
  springDamping: 12,
  reducedMotion: 'never' as ReducedMotionMode,
};
