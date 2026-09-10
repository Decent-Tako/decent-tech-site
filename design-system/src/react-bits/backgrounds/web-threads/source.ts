import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type WebThreadsFanMode = 'center' | 'left' | 'right';

export const WEB_THREADS_FAN_MODES: readonly WebThreadsFanMode[] = [
  'center',
  'left',
  'right',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'WebThreads',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/web-threads',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/WebThreads/WebThreads.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/WebThreads/WebThreads.tsx',
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
      why: 'The upstream file draws a fan of sine threads on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, onError, and className are not controls. Colour defaults
// are brand tokens: color1 accent-blue #0035B1 (upstream #5227FF), color2
// accent-yellow #DEF54F (upstream #FF9FFC), color3 paper #FFFFFF, backgroundColor
// paper #FFFFFF.
export const WEB_THREADS_DEFAULTS = {
  color1: '#0035B1',
  color2: '#DEF54F',
  color3: '#FFFFFF',
  speed: 0.2,
  threadCount: 6,
  frequency: 5.0,
  spread: 0.18,
  taper: 1.0,
  position: 0.5,
  fanMode: 'center' as WebThreadsFanMode,
  glow: 0.02,
  falloff: 0.6,
  thickness: 1.1,
  brightness: 0.6,
  opacity: 1.0,
  mirror: true,
  shimmer: false,
  grain: true,
  grainIntensity: 0.05,
  mouseInteraction: true,
  mouseStrength: 0.3,
  backgroundColor: '#FFFFFF',
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
