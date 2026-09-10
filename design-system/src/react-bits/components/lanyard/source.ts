import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const LANYARD_FITS = ['cover', 'contain'] as const;

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Lanyard',
  section: 'Components',
  page: 'https://reactbits.dev/components/lanyard',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Lanyard/Lanyard.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Lanyard/Lanyard.tsx',
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
      why: 'The upstream file builds a Three.js scene for the badge, clip, and strap. Motion cannot own a WebGL context.',
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
      why: 'The upstream file uses useGLTF, useTexture, Environment, and Lightformer. Motion has no GLTF loader.',
      repo: 'https://github.com/pmndrs/drei',
    },
    {
      package: '@react-three/rapier',
      version: '2.2.0',
      licence: 'MIT',
      unpackedKb: 284,
      why: 'The upstream file hangs the badge from rope and spherical joints. Motion has no rigid-body solver.',
      repo: 'https://github.com/pmndrs/react-three-rapier',
    },
    {
      package: 'meshline',
      version: '3.3.1',
      licence: 'MIT',
      unpackedKb: 50,
      why: 'The upstream file draws the strap as a textured mesh line. Three.Line cannot billboard that ribbon.',
      repo: 'https://github.com/pmndrs/meshline',
    },
  ],
};

// One entry per upstream prop a person can set. `position` and `gravity`
// are split into numbers. `frontImage`, `backImage`, and `lanyardImage`
// are not controls: the wrapper supplies Academy photographs and the
// vendored strap texture.
export const LANYARD_DEFAULTS = {
  cameraZ: 30,
  gravityY: -40,
  fov: 20,
  // Brand ink stage needs an opaque buffer so play can sample pixels.
  // Upstream default true.
  transparent: false,
  imageFit: 'cover' as (typeof LANYARD_FITS)[number],
  lanyardWidth: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};
