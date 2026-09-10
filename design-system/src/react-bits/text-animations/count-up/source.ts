import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'CountUp',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/count-up',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/CountUp/CountUp.tsx',
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
      why: 'The upstream file springs a number with useMotionValue, useSpring, and useInView.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// `to` is required upstream with no default. The control uses the $3,000
// participant goal. onStart, onEnd, className, and paused are not controls.
export const COUNT_UP_DEFAULTS = {
  to: 3000,
  from: 0,
  direction: 'up' as const,
  delay: 0,
  duration: 2,
  startWhen: true,
  separator: '',
  reducedMotion: 'never' as ReducedMotionMode,
};
