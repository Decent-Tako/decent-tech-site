import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'GlitchText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/glitch-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/GlitchText/GlitchText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/GlitchText/GlitchText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// `text` is the wrapper children. className, paused, and reduced are not
// controls.
export const GLITCH_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  speed: 0.5,
  enableShadows: true,
  enableOnHover: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
