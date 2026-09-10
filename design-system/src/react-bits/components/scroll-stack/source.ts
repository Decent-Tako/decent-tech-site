import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ScrollStack',
  section: 'Components',
  page: 'https://reactbits.dev/components/scroll-stack',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ScrollStack/ScrollStack.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ScrollStack/ScrollStack.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'lenis',
      version: '1.3.26',
      licence: 'MIT',
      unpackedKb: 447,
      why: 'The upstream file uses Lenis to smooth the scroller and drive card pin, scale, and blur on scroll. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/darkroomengineering/lenis',
    },
  ],
};

// One entry per upstream prop a person can set. children, className, and
// useWindowScroll are not controls: the wrapper supplies FEATURES cards and
// keeps the scroller inside the stage.
export const SCROLL_STACK_DEFAULTS = {
  itemDistance: 100,
  itemScale: 0.03,
  itemStackDistance: 30,
  stackPosition: '20%',
  scaleEndPosition: '10%',
  baseScale: 0.85,
  scaleDuration: 0.5,
  rotationAmount: 0,
  blurAmount: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
