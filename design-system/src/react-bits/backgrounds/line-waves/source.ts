import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LineWaves',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/line-waves',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LineWaves/LineWaves.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LineWaves/LineWaves.tsx',
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
      why: 'The upstream file draws warped line fields on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, and onError are not controls. Colour defaults are brand
// tokens: color1 paper #FFFFFF, color2 accent-blue #0035B1, color3
// accent-yellow #DEF54F (upstream all #ffffff).
export const LINE_WAVES_DEFAULTS = {
  speed: 0.3,
  innerLineCount: 32.0,
  outerLineCount: 36.0,
  warpIntensity: 1.0,
  rotation: -45,
  edgeFadeWidth: 0.0,
  colorCycleSpeed: 1.0,
  brightness: 0.2,
  color1: '#FFFFFF',
  color2: '#0035B1',
  color3: '#DEF54F',
  enableMouseInteraction: true,
  mouseInfluence: 2.0,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
