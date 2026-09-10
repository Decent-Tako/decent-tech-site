import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export type TopographyColorMode = 'elevation' | 'uniform' | 'alternating';

export const TOPOGRAPHY_COLOR_MODES: readonly TopographyColorMode[] = [
  'elevation',
  'uniform',
  'alternating',
];

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Topography',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/topography',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Topography/Topography.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Topography/Topography.tsx',
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
      why: 'The upstream file draws morphing contour bands on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, onError, and className are not controls. Colour defaults
// are brand tokens: lowColor accent-blue #0035B1 (upstream #5227FF), midColor
// accent-yellow #DEF54F (upstream #FF9FFC), highColor paper #FFFFFF.
export const TOPOGRAPHY_DEFAULTS = {
  lowColor: '#0035B1',
  midColor: '#DEF54F',
  highColor: '#FFFFFF',
  speed: 0.35,
  morphAmount: 3.0,
  morphSpeed: 0.05,
  bands: 2.0,
  thickness: 0.01,
  scale: 1.0,
  pixelSize: 1.0,
  glow: 0.5,
  colorMode: 'elevation' as TopographyColorMode,
  contrast: 3.0,
  brightness: 1.0,
  fillBands: false,
  opacity: 1.0,
  grain: true,
  grainIntensity: 0.05,
  mouseInteraction: true,
  mouseRadius: 0.3,
  mouseStrength: 0.4,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
