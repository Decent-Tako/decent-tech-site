import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ScrollVelocity',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/scroll-velocity',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrollVelocity/ScrollVelocity.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ScrollVelocity/ScrollVelocity.tsx',
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
      why: 'The upstream file drives a looping marquee with useAnimationFrame, useScroll, useVelocity, and useSpring.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

// scrollContainerRef, className, paused, reduced, onOffset, and style props
// are not controls. texts uses the first two feature titles.
export const SCROLL_VELOCITY_DEFAULTS = {
  texts: [FEATURES[0].title, FEATURES[1].title],
  velocity: 100,
  damping: 50,
  stiffness: 400,
  numCopies: 6,
  velocityMapping: { input: [0, 1000] as [number, number], output: [0, 5] as [number, number] },
  parallaxClassName: 'parallax',
  scrollerClassName: 'scroller',
  reducedMotion: 'never' as ReducedMotionMode,
};
