import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Carousel',
  section: 'Components',
  page: 'https://reactbits.dev/components/carousel',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Carousel/Carousel.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Carousel/Carousel.tsx',
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
      why: 'The upstream file uses motion/react for the track x spring, drag, and per-card rotateY. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/motiondivision/motion',
    },
    {
      package: 'react-icons',
      version: '5.7.0',
      licence: 'MIT',
      unpackedKb: 86213,
      why: 'The upstream file imports Feather icons from react-icons/fi for the default demo slides. The wrapper supplies Academy cards, but the vendor file still imports the package.',
      repo: 'https://github.com/react-icons/react-icons',
    },
  ],
};

// One entry per upstream prop a person can set. `items`, `paused`,
// `instant`, and `onIndexChange` are not controls: the wrapper supplies
// Academy cards and writes the active index onto the stage.
export const CAROUSEL_DEFAULTS = {
  baseWidth: 300,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false,
  loop: false,
  round: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
