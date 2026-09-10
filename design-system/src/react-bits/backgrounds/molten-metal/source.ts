import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import type { MoltenMetalColorMode } from '../../vendor/backgrounds/molten-metal/MoltenMetal';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'MoltenMetal',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/molten-metal',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/MoltenMetal/MoltenMetal.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/MoltenMetal/MoltenMetal.tsx',
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
      why: 'The upstream file draws a WebGL 2 fold-and-glow metal field on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const MOLTEN_METAL_COLOR_MODES: readonly MoltenMetalColorMode[] = [
  'molten',
  'ember',
  'frost',
];

// className, paused, onReady, and onError are not controls. Colour defaults
// are brand tokens: #0035B1, #DEF54F, #FFFFFF (upstream #5227FF, #FF9FFC,
// #FFFFFF). backgroundColor is the light-mode mix colour.
export const MOLTEN_METAL_DEFAULTS = {
  color1: '#0035B1',
  color2: '#DEF54F',
  color3: '#FFFFFF',
  speed: 0.35,
  scale: 4,
  detail: 3,
  glow: 1.6,
  coreSize: 0.1,
  swirl: 1,
  fold: -0.2,
  blackPoint: 0.05,
  brightness: 1.3,
  colorMode: 'molten' as MoltenMetalColorMode,
  grain: true,
  grainIntensity: 0.05,
  mouseInteraction: true,
  mouseStrength: 0.3,
  opacity: 1.0,
  backgroundColor: '#FFFFFF',
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
