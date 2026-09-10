import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FaultyTerminal',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/faulty-terminal',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/FaultyTerminal/FaultyTerminal.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/FaultyTerminal/FaultyTerminal.tsx',
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
      why: 'The upstream file draws a CRT digit field on an ogl Renderer, Program, Mesh, Color, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export type FaultyTerminalGrid = [number, number];

// className, style, pause, onReady, onError, and HTML rest props are not
// controls: the wrapper owns pause and ready. tint is brand paper #FFFFFF
// (upstream #ffffff). dpr default is 1; upstream uses min(devicePixelRatio, 2).
export const FAULTY_TERMINAL_DEFAULTS = {
  scale: 1,
  gridMul: [2, 1] as FaultyTerminalGrid,
  digitSize: 1.5,
  timeScale: 0.3,
  scanlineIntensity: 0.3,
  glitchAmount: 1,
  flickerAmount: 1,
  noiseAmp: 1,
  chromaticAberration: 0,
  dither: 0,
  curvature: 0.2,
  tint: '#FFFFFF',
  mouseReact: true,
  mouseStrength: 0.2,
  dpr: 1,
  pageLoadAnimation: true,
  brightness: 1,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
