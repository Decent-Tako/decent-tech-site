import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LiquidChrome',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/liquid-chrome',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LiquidChrome/LiquidChrome.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LiquidChrome/LiquidChrome.tsx',
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
      why: 'The upstream file draws a cosine chrome field on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// className, paused, onReady, and onError are not controls. Colour is RGB
// 0-1. Default is brand ink #212121 as [0.129, 0.129, 0.129] (upstream
// [0.1, 0.1, 0.1]).
export const LIQUID_CHROME_DEFAULTS = {
  baseColor: [0.129, 0.129, 0.129] as [number, number, number],
  speed: 0.2,
  amplitude: 0.5,
  frequencyX: 3,
  frequencyY: 2,
  interactive: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
