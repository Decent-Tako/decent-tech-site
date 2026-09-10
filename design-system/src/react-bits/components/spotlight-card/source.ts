import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'SpotlightCard',
  section: 'Components',
  page: 'https://reactbits.dev/components/spotlight-card',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/SpotlightCard/SpotlightCard.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/SpotlightCard/SpotlightCard.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop a person can set. children and className are
// not controls. spotlightColor uses accent blue. Upstream default was
// rgba(255, 255, 255, 0.25).
export const SPOTLIGHT_CARD_DEFAULTS = {
  spotlightColor: 'rgba(0, 53, 177, 0.35)',
  reducedMotion: 'never' as ReducedMotionMode,
};
