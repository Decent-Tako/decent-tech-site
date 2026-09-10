import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Magnet',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/magnet',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Magnet/Magnet.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// wrapperClassName and innerClassName are not controls: the wrapper owns
// the classes. paused and onActive are local.
export const MAGNET_DEFAULTS = {
  padding: 100,
  disabled: false,
  magnetStrength: 2,
  activeTransition: 'transform 0.3s ease-out',
  inactiveTransition: 'transform 0.5s ease-in-out',
  reducedMotion: 'never' as ReducedMotionMode,
};
