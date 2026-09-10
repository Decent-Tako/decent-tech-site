import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Folder',
  section: 'Components',
  page: 'https://reactbits.dev/components/folder',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Folder/Folder.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Folder/Folder.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop a person can set. `items` and `className`
// are not controls: the wrapper supplies FEATURES titles on the papers.
export const FOLDER_DEFAULTS = {
  color: '#0035B1',
  size: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};
