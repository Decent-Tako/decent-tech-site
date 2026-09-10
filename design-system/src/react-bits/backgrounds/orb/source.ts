import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Orb',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/orb',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Orb/Orb.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Orb/Orb.tsx',
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
      why: 'The upstream file draws a simplex-noise orb on an ogl Renderer, Program, Mesh, Triangle, and Vec3. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. hue is a rotation in
// degrees, not a colour token. backgroundColor is brand ink #212121
// (upstream #000000).
export const ORB_DEFAULTS = {
  hue: 0,
  hoverIntensity: 0.2,
  rotateOnHover: true,
  forceHoverState: false,
  backgroundColor: '#212121',
  reducedMotion: 'never' as ReducedMotionMode,
};
