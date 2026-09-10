import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'AnimatedList',
  section: 'Components',
  page: 'https://reactbits.dev/components/animated-list',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/AnimatedList/AnimatedList.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/AnimatedList/AnimatedList.tsx',
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
      why: 'The upstream file wraps each row in motion.div and uses useInView to scale and fade the row as it crosses the scroller. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// One entry per upstream prop a person can set. `items`, `onItemSelect`,
// `className`, and `itemClassName` are not controls: the wrapper supplies
// Academy copy and writes the selected index onto the stage.
export const ANIMATED_LIST_DEFAULTS = {
  showGradients: true,
  enableArrowNavigation: true,
  displayScrollbar: true,
  initialSelectedIndex: -1,
  reducedMotion: 'never' as ReducedMotionMode,
};
