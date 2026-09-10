import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'OrbitImages',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/orbit-images',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/OrbitImages/OrbitImages.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/OrbitImages/OrbitImages.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'motion',
      version: '13.2.0',
      licence: 'MIT',
      unpackedKb: 701,
      why: 'The sketch offsets each photograph along an SVG path with a motion value and animate(). CSS offset-path cannot drive the shared progress clock or Pause.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

export const ORBIT_SHAPES = [
  'ellipse',
  'circle',
  'square',
  'rectangle',
  'triangle',
  'star',
  'heart',
  'infinity',
  'wave',
] as const;

export const ORBIT_DIRECTIONS = ['normal', 'reverse'] as const;
export const ORBIT_EASINGS = ['linear', 'easeIn', 'easeOut', 'easeInOut'] as const;

// images, altPrefix, customPath, width, height, paused, centerContent, and
// responsive are not controls: the wrapper owns the photographs, the stage
// size, and Pause.
export const ORBIT_IMAGES_DEFAULTS = {
  shape: 'ellipse' as (typeof ORBIT_SHAPES)[number],
  baseWidth: 1400,
  radiusX: 700,
  radiusY: 170,
  radius: 300,
  starPoints: 5,
  starInnerRatio: 0.5,
  rotation: -8,
  duration: 40,
  itemSize: 64,
  direction: 'normal' as (typeof ORBIT_DIRECTIONS)[number],
  fill: true,
  showPath: false,
  // Brand ink at 10%. Upstream default rgba(0,0,0,0.1).
  pathColor: 'rgba(33,33,33,0.1)',
  pathWidth: 2,
  easing: 'linear' as (typeof ORBIT_EASINGS)[number],
  reducedMotion: 'never' as ReducedMotionMode,
};
