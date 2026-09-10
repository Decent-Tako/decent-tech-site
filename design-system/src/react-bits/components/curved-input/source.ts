import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CurvedInput',
  section: 'Components',
  page: 'https://reactbits.dev/components/curved-input',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/CurvedInput/CurvedInput.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/CurvedInput/CurvedInput.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const CURVED_THEMES = ['dark', 'light'] as const;
export const CURVED_SHADOWS = ['sm', 'md', 'lg'] as const;

// One entry per upstream prop a person can set. `value`, `onChange`,
// `onSubmit`, `name`, `ariaLabel`, `icon`, `className`, `style`, and
// `paused` are not controls: the wrapper owns the field value and writes
// it onto the stage. Placeholder and button text are Academy copy.
export const CURVED_INPUT_DEFAULTS = {
  defaultValue: '',
  placeholder: 'Set the goal to $3,000',
  buttonText: 'Open Week 0',
  type: 'email',
  theme: 'dark' as (typeof CURVED_THEMES)[number],
  width: 450,
  bend: 28,
  height: 64,
  cornerRadius: 18,
  borderWidth: 1.5,
  fontSize: 16,
  backgroundColor: '#212121',
  textColor: '#FFFFFF',
  placeholderColor: '#A6A6A6',
  borderColor: '#D9D9D9',
  buttonColor: '#0035B1',
  buttonTextColor: '#FFFFFF',
  iconColor: '#DEF54F',
  shadowSize: 'md' as (typeof CURVED_SHADOWS)[number],
  shadowColor: '#212121',
  showButton: true,
  showIcon: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
