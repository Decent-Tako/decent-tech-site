import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LetterGlitch',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/letter-glitch',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LetterGlitch/LetterGlitch.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// className, paused, onReady, and onError are not controls. Colour defaults
// are brand tokens: glitchColors accent-blue, accent-yellow, paper
// (upstream #2b4539, #61dca3, #61b3dc). backgroundColor is brand ink
// (upstream black).
export const LETTER_GLITCH_DEFAULTS = {
  glitchColors: ['#0035B1', '#DEF54F', '#FFFFFF'],
  glitchSpeed: 50,
  centerVignette: false,
  outerVignette: true,
  smooth: true,
  lightMode: false,
  backgroundColor: '#212121',
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
  reducedMotion: 'never' as ReducedMotionMode,
};
