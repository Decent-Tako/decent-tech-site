export const MOTION_PRIMITIVES = {
  name: 'Motion Primitives',
  licence: 'MIT',
  lastPush: '2026-03-19',
  docs: 'https://motion-primitives.com',
  repo: 'https://github.com/ibelick/motion-primitives',
  registry: 'https://motion-primitives.com/c',
} as const;

export const MOTION_RUNTIME_NOTE =
  'Default runtime motion 13.2.0. Licence MIT. Docs https://motion.dev/docs/react . Source https://github.com/motiondivision/motion .';

export const REACT_USE_MEASURE = {
  package: 'react-use-measure',
  version: '2.1.7',
  licence: 'MIT',
  unpackedKb: 29,
  why: 'SlidingNumber measures each digit height so the reel can translate in pixels. InfiniteSlider measures the duplicated track so duration is distance / speed. Motion springs the digit and animates the offset. It does not measure the box. Toolbar expandable measures panel height so the spring has a pixel target. Motion does not measure layout boxes.',
  docs: 'https://github.com/pmndrs/react-use-measure',
} as const;
