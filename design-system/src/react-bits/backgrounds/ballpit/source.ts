import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Ballpit',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/ballpit',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Ballpit/Ballpit.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'gsap',
      version: '3.15.0',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 6111,
      why: 'The upstream file registers gsap Observer next to the three.js pit. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
    {
      package: 'three',
      version: '0.180.0',
      licence: 'MIT',
      unpackedKb: 30044,
      why: 'The upstream file runs instanced spheres, lights, and a custom physical material on a three.js WebGLRenderer. Motion cannot own that scene.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// className, paused, onReady, onError, maxX, maxY, maxZ, controlSphere0, and
// materialParams are not controls: the wrapper owns pause, and the pit sizes
// itself from the stage.
export const BALLPIT_DEFAULTS = {
  followCursor: true,
  count: 80,
  colors: ['#0035B1', '#DEF54F', '#FFFFFF'] as string[],
  ambientColor: '#FFFFFF',
  ambientIntensity: 1,
  lightIntensity: 200,
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  reducedMotion: 'never' as ReducedMotionMode,
};
