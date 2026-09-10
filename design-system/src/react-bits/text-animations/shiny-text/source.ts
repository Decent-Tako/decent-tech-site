import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ShinyText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/shiny-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ShinyText/ShinyText.tsx',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ShinyText/ShinyText.css',
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
      why: 'The upstream file drives a motion value from useAnimationFrame and maps it to background-position with useTransform on a motion.span. motion is the library baseline, so no new copy ships.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

export const SHINE_DIRECTIONS = ['left', 'right'] as const;

// One entry per upstream prop, with the upstream default. `text` is the
// Academy hero kicker and `className` is not a control. Colour defaults are
// brand tokens: the base is paper on the ink stage and the shine is accent
// yellow. Upstream: #b5b5b5 and #ffffff.
export const SHINY_TEXT_DEFAULTS = {
  disabled: false,
  speed: 2,
  color: '#FFFFFF',
  shineColor: '#DEF54F',
  spread: 120,
  yoyo: false,
  pauseOnHover: false,
  direction: 'left' as (typeof SHINE_DIRECTIONS)[number],
  delay: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
