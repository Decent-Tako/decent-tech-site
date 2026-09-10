import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LogoLoop',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/logo-loop',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/LogoLoop/LogoLoop.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/LogoLoop/LogoLoop.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// logos and renderItem are not controls: the wrapper always passes Academy
// copy as node items. paused and onOffset are local.
export const LOGO_LOOP_DEFAULTS = {
  speed: 120,
  direction: 'left' as 'left' | 'right' | 'up' | 'down',
  width: '100%',
  logoHeight: 28,
  gap: 32,
  pauseOnHover: true,
  fadeOut: false,
  // Brand paper. Upstream has no default; the CSS fallback is #ffffff.
  fadeOutColor: '#FFFFFF',
  scaleOnHover: false,
  ariaLabel: 'Partner logos',
  reducedMotion: 'never' as ReducedMotionMode,
};

export const LOGO_LOOP_DIRECTIONS = ['left', 'right', 'up', 'down'] as const;
