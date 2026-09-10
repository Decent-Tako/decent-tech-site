import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const SPECULAR_BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
export const SPECULAR_BUTTON_TYPES = ['button', 'submit', 'reset'] as const;

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SpecularButton',
  section: 'Components',
  page: 'https://reactbits.dev/components/specular-button',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/SpecularButton/SpecularButton.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/SpecularButton/SpecularButton.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'ogl',
      version: '1.0.11',
      licence: 'Unlicense',
      unpackedKb: 413,
      why: 'The upstream file draws a rounded specular rim with an ogl WebGL 2 triangle and fragment shader. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// One entry per upstream prop a person can set. children, onClick, and
// className are not controls: the wrapper supplies DESTINATIONS[0].cta.
// Colour props use brand tokens. Upstream tint #ffffff, text #f5f5f5,
// line #ffffff, base #525252.
export const SPECULAR_BUTTON_DEFAULTS = {
  size: 'lg' as (typeof SPECULAR_BUTTON_SIZES)[number],
  radius: 18,
  tint: '#FFFFFF',
  tintOpacity: 0,
  blur: 0,
  textColor: '#FFFFFF',
  lineColor: '#FFFFFF',
  baseColor: '#4A4A4A',
  intensity: 1,
  shineSize: 10,
  shineFade: 40,
  thickness: 1,
  speed: 0.35,
  followMouse: true,
  proximity: 250,
  autoAnimate: false,
  disabled: false,
  type: 'button' as (typeof SPECULAR_BUTTON_TYPES)[number],
  reducedMotion: 'never' as ReducedMotionMode,
};
