import type { ReducedMotionMode } from '../pointer/source';

export const INFINITE_SOURCE = {
  name: 'React Bits Infinite Menu',
  page: 'https://reactbits.dev/components/infinite-menu',
  repo: 'https://github.com/DavidHDev/react-bits',
  files: {
    tsx: 'https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/InfiniteMenu/InfiniteMenu.tsx',
    css: 'https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/InfiniteMenu/InfiniteMenu.css',
  },
  commit: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  licenceUrl: 'https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md',
  licenceNote:
    'The Commons Clause forbids selling, sublicensing, or redistributing the components themselves, alone, in a bundle, or as a ported version. Vendored for learning and experimentation on Ben\'s instruction, 2026-09-10.',
  glMatrix: {
    package: 'gl-matrix',
    version: '3.4.3',
    licence: 'MIT',
    repo: 'https://github.com/toji/gl-matrix',
  },
} as const;

export const INFINITE_DEFAULTS = {
  scale: 1,
  backgroundColor: '#212121',
  itemCount: 4,
  reducedMotion: 'never' as ReducedMotionMode,
};
