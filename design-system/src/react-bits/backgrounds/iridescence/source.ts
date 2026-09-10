import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Iridescence',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/iridescence',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Iridescence/Iridescence.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Iridescence/Iridescence.tsx',
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
      why: 'The upstream file draws a cosine interference field on an ogl Renderer, Program, Mesh, Color, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. Colour is RGB 0-1.
// Default is brand accent-blue #0035B1 as [0, 0.208, 0.694]. Upstream [1, 1, 1].
export const IRIDESCENCE_DEFAULTS = {
  color: [0, 0.208, 0.694] as [number, number, number],
  speed: 1.0,
  amplitude: 0.1,
  mouseReact: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
