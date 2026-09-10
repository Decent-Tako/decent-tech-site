import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LaserFlow',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/laser-flow',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/LaserFlow/LaserFlow.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/LaserFlow/LaserFlow.tsx',
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
      why: 'The sketch draws a full-screen RawShaderMaterial beam with a three.js WebGLRenderer. motion cannot compile the GLSL wisp and fog pass.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// dpr follows the device, so it is not a control. paused, onReady, and
// onUnavailable are local.
export const LASER_FLOW_DEFAULTS = {
  wispDensity: 1,
  mouseSmoothTime: 0.0,
  mouseTiltStrength: 0.01,
  horizontalBeamOffset: 0.1,
  verticalBeamOffset: 0.0,
  flowSpeed: 0.35,
  verticalSizing: 2.0,
  horizontalSizing: 0.5,
  fogIntensity: 0.45,
  fogScale: 0.3,
  wispSpeed: 15.0,
  wispIntensity: 5.0,
  flowStrength: 0.25,
  decay: 1.1,
  falloffStart: 1.2,
  fogFallSpeed: 0.6,
  // Brand accent yellow. Upstream default #FF79C6.
  color: '#DEF54F',
  // Brand ink. Upstream default #000000.
  backgroundColor: '#212121',
  reducedMotion: 'never' as ReducedMotionMode,
};
