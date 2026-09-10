import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ChromaGrid',
  section: 'Components',
  page: 'https://reactbits.dev/components/chroma-grid',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ChromaGrid/ChromaGrid.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ChromaGrid/ChromaGrid.tsx',
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
      why: 'The upstream file uses gsap.quickSetter and gsap.to to move the grayscale spotlight and fade it on pointer leave. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power4.out',
  'power2.inOut',
  'back.out(1.7)',
  'elastic.out(1, 0.3)',
  'expo.out',
  'sine.inOut',
] as const;

// One entry per upstream prop a person can set. `items`, `className`,
// `paused`, `instant`, and `onReveal` are not controls: the wrapper
// supplies Academy photographs and writes reveal onto the stage.
export const CHROMA_GRID_DEFAULTS = {
  radius: 300,
  columns: 3,
  rows: 2,
  damping: 0.45,
  fadeOut: 0.6,
  ease: 'power3.out',
  reducedMotion: 'never' as ReducedMotionMode,
};
