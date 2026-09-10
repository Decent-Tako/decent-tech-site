import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'MetaBalls',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/meta-balls',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/MetaBalls/MetaBalls.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/MetaBalls/MetaBalls.tsx',
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
      why: 'The sketch draws marching-squares metaballs on an ogl Renderer, Program, Mesh, Triangle, and Camera. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onUnavailable are local. Colour defaults are brand
// paper, which matches the upstream #ffffff.
export const META_BALLS_DEFAULTS = {
  // Brand paper. Upstream default #ffffff.
  color: '#FFFFFF',
  speed: 0.3,
  enableMouseInteraction: true,
  hoverSmoothness: 0.05,
  animationSize: 30,
  ballCount: 15,
  clumpFactor: 1,
  cursorBallSize: 3,
  // Brand paper. Upstream default #ffffff.
  cursorBallColor: '#FFFFFF',
  enableTransparency: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
