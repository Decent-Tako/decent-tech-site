import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SwarmCursor',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/swarm-cursor',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/SwarmCursor/SwarmCursor.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/SwarmCursor/SwarmCursor.tsx',
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
      why: 'The upstream file flocks particles toward the pointer, stamps them into an ogl field buffer, and composites a glow pass. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// One entry per upstream prop, with the upstream default. className, style,
// children, and the rest HTML attributes are not controls: the wrapper owns
// the stage and the Academy copy.
export const SWARM_CURSOR_DEFAULTS = {
  // Brand paper. Upstream default #ffffff.
  color: '#FFFFFF',
  // Brand accent yellow. Upstream default #ffffff.
  accentColor: '#DEF54F',
  count: 10,
  size: 10,
  merge: 0.77,
  glow: 0.75,
  opacity: 1,
  spread: 100,
  separation: 0.15,
  speed: 2.5,
  wander: 0.25,
  trail: 0.75,
  scatterOnClick: true,
  enabled: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
