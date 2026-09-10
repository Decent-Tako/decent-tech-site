import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'OptionWheel',
  section: 'Components',
  page: 'https://reactbits.dev/components/option-wheel',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/OptionWheel/OptionWheel.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/OptionWheel/OptionWheel.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const OPTION_WHEEL_SIDES = ['left', 'right'] as const;

export type OptionWheelSide = (typeof OPTION_WHEEL_SIDES)[number];

// One entry per upstream prop a person can set. `items` and `onChange` are
// not controls: the wrapper supplies FEATURES titles. soundUrl stays empty
// so the story does not fetch audio.
export const OPTION_WHEEL_DEFAULTS = {
  defaultSelected: 3,
  textColor: '#A6A6A6',
  activeColor: '#FFFFFF',
  side: 'left' as OptionWheelSide,
  fontSize: 3,
  spacing: 1.4,
  curve: 1,
  tilt: 6,
  blur: 2,
  fade: 0.25,
  minOpacity: 0.75,
  smoothing: 200,
  inset: 80,
  loop: false,
  draggable: true,
  soundUrl: '',
  soundVolume: 0.5,
  reducedMotion: 'never' as ReducedMotionMode,
};
