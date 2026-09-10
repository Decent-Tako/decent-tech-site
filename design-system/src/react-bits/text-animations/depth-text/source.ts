import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import { FEATURES } from '../../../pages/content';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'DepthText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/depth-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/DepthText/DepthText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/DepthText/DepthText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// faceColor and depthColor use paper and accent blue. Upstream defaults are
// #f8fafc and #7c3aed. className, style, paused, and onFrame are not controls.
export const DEPTH_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  layers: 34,
  depth: 2.4,
  faceColor: '#FFFFFF',
  depthColor: '#0035B1',
  tilt: 7.5,
  pointerTracking: true,
  smoothing: 0.14,
  perspective: 900,
  autoOrbit: true,
  orbitSpeed: 0.35,
  fontSize: 'clamp(3rem, 12vw, 7rem)',
  fontWeight: 700,
  shadow: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
