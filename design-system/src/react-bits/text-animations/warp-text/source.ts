import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'WarpText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/warp-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/WarpText/WarpText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/WarpText/WarpText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'ogl',
      version: '1.0.11',
      licence: 'Unlicense',
      unpackedKb: 413,
      why: 'The upstream file draws a WebGL 2 warp of a text canvas through ogl Renderer, Program, Mesh, Triangle, and Texture.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// className, style, paused, reduced, onReady, onError, and onPointer are not
// controls. color is paper; upstream default #f8f5ff. fontFamily is Brand Sans;
// upstream default inherit. fontWeight is 700; upstream default 800.
export const WARP_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  color: '#FFFFFF',
  warpStrength: 0.08,
  warpScale: 1.7,
  speed: 0.55,
  pointerInfluence: 0.42,
  pointerStrength: 0.38,
  refraction: 0.018,
  ripple: true,
  fontSize: 'clamp(3rem, 10vw, 9rem)',
  fontWeight: 700,
  fontFamily: 'Brand Sans, Arial, sans-serif',
  letterSpacing: '-0.06em',
  lineHeight: 0.9,
  reducedMotion: 'never' as ReducedMotionMode,
};
