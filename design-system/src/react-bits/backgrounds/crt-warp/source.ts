import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CRTWarp',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/crt-warp',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/CRTWarp/CRTWarp.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/CRTWarp/CRTWarp.tsx',
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
      why: 'The upstream file draws a CRT plasma shader on a three.js WebGLRenderer and ShaderMaterial. Motion cannot compile GLSL or own that renderer.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// className, style, paused, onReady, and onError are not controls: the wrapper
// owns pause and ready.
export const CRT_WARP_DEFAULTS = {
  color: '#DEF54F',
  backgroundColor: '#212121',
  speed: 0.5,
  curvature: 0.25,
  scanlineStrength: 0.25,
  scanlineFrequency: 200,
  waveAmplitude: 0.3,
  waveFrequency: 2.5,
  bloom: 1.5,
  bloomRadius: 1,
  noise: 0.1,
  vignette: 0,
  brightness: 1.25,
  pixelation: 1,
  rgbShift: 0.015,
  mouseReact: true,
  mouseStrength: 0.5,
  dpr: 1,
  fps: 30,
  reducedMotion: 'never' as ReducedMotionMode,
};
