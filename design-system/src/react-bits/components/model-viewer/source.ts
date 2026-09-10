import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ModelViewer',
  section: 'Components',
  page: 'https://reactbits.dev/components/model-viewer',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ModelViewer/ModelViewer.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: '@react-three/fiber',
      version: '9.7.0',
      licence: 'MIT',
      unpackedKb: 2137,
      why: 'The upstream file mounts a Canvas and drives the camera with useFrame. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/pmndrs/react-three-fiber',
    },
    {
      package: '@react-three/drei',
      version: '10.7.8',
      licence: 'MIT',
      unpackedKb: 1710,
      why: 'The upstream file loads the GLB with useGLTF, adds Environment, ContactShadows, OrbitControls, and Html.',
      repo: 'https://github.com/pmndrs/drei',
    },
    {
      package: 'three',
      version: '0.180.0',
      licence: 'MIT',
      unpackedKb: 30044,
      why: 'The upstream file uses THREE maths, lights, and the WebGL renderer.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

export const MODEL_VIEWER_PRESETS = [
  'city',
  'sunset',
  'night',
  'dawn',
  'studio',
  'apartment',
  'forest',
  'park',
  'none',
] as const;

export type ModelViewerPreset = (typeof MODEL_VIEWER_PRESETS)[number];

// One entry per upstream prop a person can set. `url`, `placeholderSrc`, and
// `onModelLoaded` are not controls: the wrapper supplies a local GLB and a
// FEATURES photograph.
export const MODEL_VIEWER_DEFAULTS = {
  width: 400,
  height: 400,
  modelXOffset: 0,
  modelYOffset: 0,
  defaultRotationX: -50,
  defaultRotationY: 20,
  defaultZoom: 0.5,
  minZoomDistance: 0.5,
  maxZoomDistance: 10,
  enableMouseParallax: true,
  enableManualRotation: true,
  enableHoverRotation: true,
  enableManualZoom: true,
  ambientIntensity: 0.3,
  keyLightIntensity: 1,
  fillLightIntensity: 0.5,
  rimLightIntensity: 0.8,
  environmentPreset: 'none' as ModelViewerPreset,
  autoFrame: false,
  showScreenshotButton: false,
  fadeIn: false,
  autoRotate: false,
  autoRotateSpeed: 0.35,
  reducedMotion: 'never' as ReducedMotionMode,
};
