import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Stack',
  section: 'Components',
  page: 'https://reactbits.dev/components/stack',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Stack/Stack.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Stack/Stack.tsx',
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
      why: 'The upstream file uses motion.div drag, rotateX/Y transforms, and a spring to send a card to the back. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// One entry per upstream prop a person can set. cards, animationConfig, and
// className are not controls: the wrapper supplies Academy photographs and
// passes stiffness and damping as the config object.
export const STACK_DEFAULTS = {
  randomRotation: false,
  sensitivity: 200,
  sendToBackOnClick: false,
  autoplay: false,
  autoplayDelay: 3000,
  pauseOnHover: false,
  mobileClickOnly: false,
  mobileBreakpoint: 768,
  stiffness: 260,
  damping: 20,
  reducedMotion: 'never' as ReducedMotionMode,
};
