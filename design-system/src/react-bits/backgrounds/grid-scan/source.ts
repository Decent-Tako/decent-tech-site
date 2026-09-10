import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GridScan',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/grid-scan',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GridScan/GridScan.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/GridScan/GridScan.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'three',
      version: '0.180.0',
      licence: 'MIT',
      unpackedKb: 30044,
      why: 'The upstream file draws a perspective grid on a three.js ShaderMaterial plane. Motion cannot own that WebGL loop.',
      repo: 'https://github.com/mrdoob/three.js',
    },
    {
      package: 'postprocessing',
      version: '6.39.5',
      licence: 'Zlib',
      unpackedKb: 2709,
      why: 'The upstream file adds BloomEffect and ChromaticAberrationEffect through EffectComposer when enablePost is true.',
      repo: 'https://github.com/pmndrs/postprocessing',
    },
    {
      package: 'face-api.js',
      version: '0.22.2',
      licence: 'MIT',
      unpackedKb: 4755,
      why: 'The upstream file can track a face from a webcam. The story keeps enableWebcam false, so the models do not load.',
      repo: 'https://github.com/justadudewhohacks/face-api.js',
    },
  ],
};

// modelsPath, className, style, paused, onReady, and onError are not
// controls. Webcam and gyro stay off in stories. Colour defaults are brand
// tokens: linesColor paper #FFFFFF (upstream #2F293A), scanColor
// accent-yellow #DEF54F (upstream #FF9FFC).
export const GRID_SCAN_DEFAULTS = {
  enableWebcam: false,
  showPreview: false,
  sensitivity: 0.55,
  lineThickness: 1,
  linesColor: '#FFFFFF',
  scanColor: '#DEF54F',
  scanOpacity: 0.4,
  gridScale: 0.1,
  lineStyle: 'solid' as const,
  lineJitter: 0.1,
  scanDirection: 'pingpong' as const,
  enablePost: true,
  bloomIntensity: 0,
  bloomThreshold: 0,
  bloomSmoothing: 0,
  chromaticAberration: 0.002,
  noiseIntensity: 0.01,
  scanGlow: 0.5,
  scanSoftness: 2,
  scanPhaseTaper: 0.9,
  scanDuration: 2.0,
  scanDelay: 2.0,
  enableGyro: false,
  scanOnClick: false,
  snapBackDelay: 250,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
