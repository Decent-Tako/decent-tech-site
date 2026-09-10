import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Beams',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/beams',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Beams/Beams.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Beams/Beams.tsx',
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
      why: 'The upstream file builds stacked noise planes on three.js. The local copy drives the scene with a WebGLRenderer so @react-three/fiber does not leak JSX types into Motion stories.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// paused, onReady, and onError are not controls: the wrapper owns pause and ready.
export const BEAMS_DEFAULTS = {
  beamWidth: 2,
  beamHeight: 15,
  beamNumber: 12,
  lightColor: '#FFFFFF',
  beamColor: '#0035B1',
  backgroundColor: '#212121',
  speed: 2,
  noiseIntensity: 1.75,
  scale: 0.2,
  rotation: 0,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
