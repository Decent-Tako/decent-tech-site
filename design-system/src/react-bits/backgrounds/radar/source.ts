import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Radar',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/radar',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Radar/Radar.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Radar/Radar.tsx',
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
      why: 'The upstream file draws a sweeping radar on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. colour default is brand
// accent-blue #0035B1 (upstream #9f29ff). backgroundColor is brand ink
// #212121 (upstream #000000).
export const RADAR_DEFAULTS = {
  speed: 1.0,
  scale: 0.5,
  ringCount: 10.0,
  spokeCount: 10.0,
  ringThickness: 0.05,
  spokeThickness: 0.01,
  sweepSpeed: 1.0,
  sweepWidth: 2.0,
  sweepLobes: 1.0,
  color: '#0035B1',
  backgroundColor: '#212121',
  falloff: 2.0,
  brightness: 1.0,
  enableMouseInteraction: true,
  mouseInfluence: 0.1,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
