import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Silk',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/silk',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Silk/Silk.tsx',
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
      why: 'The upstream file draws a silk noise plane on three.js through @react-three/fiber. The local copy drives the scene with a WebGLRenderer so fiber does not leak JSX types into Motion stories.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// paused, onReady, onError, and className are not controls. Colour default
// is brand charcoal #4A4A4A (upstream #7B7481).
export const SILK_DEFAULTS = {
  speed: 5,
  scale: 1,
  color: '#4A4A4A',
  noiseIntensity: 1.5,
  rotation: 0,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
