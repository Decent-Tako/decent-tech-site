import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Lightfall',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/lightfall',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Lightfall/Lightfall.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Lightfall/Lightfall.tsx',
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
      why: 'The upstream file raymarches falling streaks on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// className, dpr, mixBlendMode, paused, onReady, and onError are not
// controls. Colour defaults are brand tokens: #0035B1, #DEF54F, #FFFFFF
// (upstream #A6C8FF, #5227FF, #FF9FFC). backgroundColor is ink #212121
// (upstream #0A29FF).
export const LIGHTFALL_DEFAULTS = {
  colors: ['#0035B1', '#DEF54F', '#FFFFFF'],
  backgroundColor: '#212121',
  speed: 0.5,
  streakCount: 2,
  streakWidth: 1,
  streakLength: 1,
  glow: 1,
  density: 0.6,
  twinkle: 1,
  zoom: 3,
  backgroundGlow: 0.5,
  opacity: 1,
  mouseInteraction: true,
  mouseStrength: 0.5,
  mouseRadius: 1,
  mouseDampening: 0.15,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
