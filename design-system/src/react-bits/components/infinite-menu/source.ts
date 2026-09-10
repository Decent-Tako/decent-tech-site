import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'InfiniteMenu',
  section: 'Components',
  page: 'https://reactbits.dev/components/infinite-menu',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/InfiniteMenu/InfiniteMenu.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/InfiniteMenu/InfiniteMenu.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'gl-matrix',
      version: '3.4.3',
      licence: 'MIT',
      unpackedKb: 752,
      why: 'The upstream file builds instance matrices, quaternion rotation, and the projection matrix. Motion does not do 3D matrix math.',
      repo: 'https://github.com/toji/gl-matrix',
    },
  ],
};

// One entry per upstream prop a person can set. `items`, `inertia`,
// `onInit`, and `onActiveItemChange` are not controls: the wrapper
// supplies DESTINATIONS photographs and wires Pause.
export const INFINITE_MENU_DEFAULTS = {
  scale: 1,
  backgroundColor: '#212121',
  itemCount: 4,
  reducedMotion: 'never' as ReducedMotionMode,
};
