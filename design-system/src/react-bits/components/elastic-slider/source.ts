import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ElasticSlider',
  section: 'Components',
  page: 'https://reactbits.dev/components/elastic-slider',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ElasticSlider/ElasticSlider.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ElasticSlider/ElasticSlider.tsx',
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
      why: 'The upstream file uses motion springs to stretch the track past its ends and snap back. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// One entry per upstream prop a person can set. `leftIcon`, `rightIcon`,
// `className`, `paused`, and `onValueChange` are not controls: the wrapper
// supplies Brand Sans glyphs and writes the value onto the stage.
export const ELASTIC_SLIDER_DEFAULTS = {
  defaultValue: 50,
  startingValue: 0,
  maxValue: 100,
  isStepped: false,
  stepSize: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};
