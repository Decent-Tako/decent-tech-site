import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Antigravity',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/antigravity',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Antigravity/Antigravity.tsx',
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
      why: 'The sketch builds an InstancedMesh of capsules, spheres, boxes, or tetrahedra and steps each instance toward a ring around the pointer. motion cannot drive a three.js instance matrix.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// One entry per upstream prop, with the upstream default. `paused`,
// `onReady`, and `onUnavailable` are local and are not controls.
export const ANTIGRAVITY_DEFAULTS = {
  count: 300,
  magnetRadius: 10,
  ringRadius: 10,
  waveSpeed: 0.4,
  waveAmplitude: 1,
  particleSize: 2,
  lerpSpeed: 0.1,
  // Brand accent yellow. Upstream default #FF9FFC.
  color: '#DEF54F',
  autoAnimate: false,
  particleVariance: 1,
  rotationSpeed: 0,
  depthFactor: 1,
  pulseSpeed: 3,
  particleShape: 'capsule' as 'capsule' | 'sphere' | 'box' | 'tetrahedron',
  fieldStrength: 10,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const PARTICLE_SHAPES = ['capsule', 'sphere', 'box', 'tetrahedron'] as const;
