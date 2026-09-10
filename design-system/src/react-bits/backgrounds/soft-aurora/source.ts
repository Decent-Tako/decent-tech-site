import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SoftAurora',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/soft-aurora',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/SoftAurora/SoftAurora.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/SoftAurora/SoftAurora.tsx',
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
      why: 'The upstream file draws two Perlin-noise aurora bands on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// paused, onReady, onError, and className are not controls. Colour defaults
// are brand tokens: color1 paper #FFFFFF (upstream #f7f7f7), color2
// accent-blue #0035B1 (upstream #e100ff).
export const SOFT_AURORA_DEFAULTS = {
  speed: 0.6,
  scale: 1.5,
  brightness: 1.0,
  color1: '#FFFFFF',
  color2: '#0035B1',
  noiseFrequency: 2.5,
  noiseAmplitude: 1.0,
  bandHeight: 0.5,
  bandSpread: 1.0,
  octaveDecay: 0.1,
  layerOffset: 0,
  colorSpeed: 1.0,
  enableMouseInteraction: true,
  mouseInfluence: 0.25,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
