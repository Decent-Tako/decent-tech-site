import { publicAsset } from '../../../brand/assets';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ElasticMesh',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/elastic-mesh',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ElasticMesh/ElasticMesh.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ElasticMesh/ElasticMesh.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'ogl',
      version: '1.0.11',
      licence: 'Unlicense',
      unpackedKb: 413,
      why: 'The upstream file builds an OGL mesh, spring physics, and a fragment shader for the elastic surface. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const MESH_INTERACTIONS = ['hover', 'drag'] as const;

// One entry per upstream prop, with the upstream default. image, color, and
// grid defaults use Academy assets and brand tokens. className and style are
// not controls: the wrapper owns layout.
export const ELASTIC_MESH_DEFAULTS = {
  image: publicAsset('photos/find-your-uncomfortable.jpg'),
  color1: '#0035B1',
  color2: '#212121',
  highlight: '#FFFFFF',
  showGrid: true,
  gridDensity: 20,
  gridOpacity: 0.28,
  gridColor: '#FFFFFF',
  borderRadius: 25,
  stiffness: 0.05,
  damping: 0.2,
  grabRadius: 0.6,
  pull: 0.4,
  wobble: 5,
  tilt: 14,
  shading: 0.5,
  resolution: 25,
  interaction: 'hover' as (typeof MESH_INTERACTIONS)[number],
  enabled: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
