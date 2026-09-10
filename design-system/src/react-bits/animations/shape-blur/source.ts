import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ShapeBlur',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/shape-blur',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ShapeBlur/ShapeBlur.tsx',
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
      why: 'The sketch draws a signed-distance shape on a three.js ShaderMaterial and WebGLRenderer. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

export const SHAPE_BLUR_VARIATIONS = [0, 1, 2, 3] as const;

// className is not a control. paused, seedCenter, onReady, and onUnavailable
// are local.
export const SHAPE_BLUR_DEFAULTS = {
  variation: 0,
  pixelRatioProp: 2,
  shapeSize: 1.2,
  roundness: 0.4,
  borderSize: 0.05,
  circleSize: 0.3,
  circleEdge: 0.5,
  reducedMotion: 'never' as ReducedMotionMode,
};
