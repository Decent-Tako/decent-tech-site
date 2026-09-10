import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Stepper',
  section: 'Components',
  page: 'https://reactbits.dev/components/stepper',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Stepper/Stepper.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Stepper/Stepper.tsx',
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
      why: 'The upstream file uses AnimatePresence and motion springs to slide each step and grow the connector. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// One entry per upstream prop a person can set. children, className props,
// button props, callbacks, and renderStepIndicator are not controls: the
// wrapper supplies FEATURES as steps.
export const STEPPER_DEFAULTS = {
  initialStep: 1,
  backButtonText: 'Back',
  nextButtonText: 'Continue',
  disableStepIndicators: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
