import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import { FEATURES } from '../../../pages/content';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ASCIIText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/ascii-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ASCIIText/ASCIIText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'three',
      version: '0.180.0',
      licence: 'MIT',
      unpackedKb: 30044,
      why: 'The upstream file builds a Three.js scene, a shader plane of the text, and an ASCII filter that samples the WebGL canvas each frame. Motion cannot draw that pipeline.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// One entry per upstream prop, with the upstream default. `text` uses the
// Week 0 title from content.ts; upstream default is 'David!'. `textColor`
// uses paper; upstream default is #fdf9f3. paused, onReady, and onFrame are
// local and are not controls.
export const ASCII_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  asciiFontSize: 8,
  textFontSize: 200,
  textColor: '#FFFFFF',
  planeBaseHeight: 8,
  enableWaves: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
