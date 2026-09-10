import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type ScanDirection = 'vertical' | 'horizontal' | 'diagonal';

export const SCAN_DIRECTIONS: readonly ScanDirection[] = [
  'vertical',
  'horizontal',
  'diagonal',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Scanner',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/scanner',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Scanner/Scanner.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Scanner/Scanner.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  licence: 'MIT + Commons Clause',
  vendoredOn: '2026-09-10',
  runtime: [
    {
      package: 'ogl',
      version: '1.0.11',
      licence: 'Unlicense',
      unpackedKb: 413,
      why: 'The upstream file draws a WebGL 2 scan field on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, onError, and className are not controls. Colour
// defaults are brand accent-blue, accent-yellow, and paper (upstream
// #5227FF, #FF9FFC, #FFFFFF).
export const SCANNER_DEFAULTS = {
  color1: '#0035B1',
  color2: '#DEF54F',
  color3: '#FFFFFF',
  speed: 0.5,
  sweepSpeed: 0.25,
  sweepWidth: 1.6,
  sweepFalloff: 6,
  scale: 1.5,
  frequency: 2,
  ripple: 0.22,
  bandDensity: 11,
  lineSharpness: 5.5,
  glow: 0.22,
  scanDirection: 'vertical' as ScanDirection,
  colorSpread: 0.7,
  brightness: 1.0,
  contrast: 1.15,
  softness: 1.4,
  vignette: 0.45,
  scanline: true,
  grain: true,
  grainIntensity: 0.05,
  opacity: 1.0,
  mouseInteraction: true,
  mouseRadius: 0.5,
  mouseStrength: 0.5,
  reducedMotion: 'never' as ReducedMotionMode,
};
