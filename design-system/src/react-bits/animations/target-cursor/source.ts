import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'TargetCursor',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/target-cursor',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/TargetCursor/TargetCursor.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/TargetCursor/TargetCursor.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'gsap',
      version: '3.15.0',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 6111,
      why: 'The upstream file tweens a four-corner cursor to the pointer, spins it, and locks the corners onto a target on hover. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// containerRef and onLock are not controls: the wrapper binds them to the
// stage. createPortal from react-dom is the app runtime, not an extra package.
export const TARGET_CURSOR_DEFAULTS = {
  targetSelector: '.cursor-target',
  spinDuration: 2,
  hideDefaultCursor: true,
  hoverDuration: 0.2,
  parallaxOn: true,
  // Brand paper. Upstream default #ffffff.
  cursorColor: '#FFFFFF',
  // Brand accent yellow. Upstream default unset.
  cursorColorOnTarget: '#DEF54F',
  reducedMotion: 'never' as ReducedMotionMode,
};
