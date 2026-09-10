import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FluidGlass',
  section: 'Components',
  page: 'https://reactbits.dev/components/fluid-glass',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/FluidGlass/FluidGlass.tsx',
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
      why: 'The upstream file builds a Three.js scene for a transmissive glass mesh. Motion cannot own a WebGL context.',
      repo: 'https://github.com/mrdoob/three.js',
    },
    {
      package: '@react-three/fiber',
      version: '9.7.0',
      licence: 'MIT',
      unpackedKb: 2137,
      why: 'The upstream file mounts the Three.js scene through a React reconciler. Direct types overwrite JSX, so the vendor file imports a local JS re-export.',
      repo: 'https://github.com/pmndrs/react-three-fiber',
    },
    {
      package: '@react-three/drei',
      version: '10.7.8',
      licence: 'MIT',
      unpackedKb: 1710,
      why: 'The upstream file uses MeshTransmissionMaterial, useGLTF, ScrollControls, and drei Image. Motion has no glass shader.',
      repo: 'https://github.com/pmndrs/drei',
    },
    {
      package: 'maath',
      version: '0.10.8',
      licence: 'MIT',
      unpackedKb: 298,
      why: 'The upstream file uses maath easing.damp3 to follow the pointer. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/pmndrs/maath',
    },
  ],
};

export const FLUID_GLASS_MODES = ['lens', 'bar', 'cube'] as const;

// One entry per upstream prop a person can set. `lensProps`, `barProps`,
// `cubeProps`, `images`, `headline`, `paused`, and `onReady` are not
// controls: the wrapper supplies Academy photographs and ior.
export const FLUID_GLASS_DEFAULTS = {
  mode: 'lens' as (typeof FLUID_GLASS_MODES)[number],
  backgroundColor: '#212121',
  textColor: '#FFFFFF',
  ior: 1.15,
  reducedMotion: 'never' as ReducedMotionMode,
};
