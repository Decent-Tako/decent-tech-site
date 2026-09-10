import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'PixelTrail',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/pixel-trail',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/PixelTrail/PixelTrail.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/PixelTrail/PixelTrail.tsx',
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
      why: 'The sketch draws a pixel grid ShaderMaterial and a canvas trail texture on a three.js WebGLRenderer. The local copy drives three.js directly because @react-three/fiber leaks JSX types into Motion stories.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// easingFunction, canvasProps, glProps, gooeyFilter, and className are not
// controls. paused, seedCenter, onReady, and onUnavailable are local.
export const PIXEL_TRAIL_DEFAULTS = {
  gridSize: 40,
  trailSize: 0.1,
  maxAge: 250,
  interpolate: 5,
  // Brand paper. Upstream default #ffffff.
  color: '#FFFFFF',
  reducedMotion: 'never' as ReducedMotionMode,
};
