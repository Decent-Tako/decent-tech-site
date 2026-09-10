import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ShinyText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/shiny-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ShinyText/ShinyText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ShinyText/ShinyText.tsx',
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
      why: 'The upstream file drives the shine position with useAnimationFrame and useMotionValue.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

export const SHINY_DIRECTIONS = ['left', 'right'] as const;

// className, paused, reduced, and onProgress are not controls. color is ink;
// upstream default #b5b5b5. shineColor is accent yellow; upstream #ffffff.
export const SHINY_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  disabled: false,
  speed: 2,
  color: '#212121',
  shineColor: '#DEF54F',
  spread: 120,
  yoyo: false,
  pauseOnHover: false,
  direction: 'left' as (typeof SHINY_DIRECTIONS)[number],
  delay: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
