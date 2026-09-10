import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ColorBends',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/color-bends',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/ColorBends/ColorBends.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/ColorBends/ColorBends.tsx',
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
      why: 'The upstream file draws a warped colour-band shader on a three.js WebGLRenderer, Scene, OrthographicCamera, and ShaderMaterial. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// className, style, paused, onReady, and onError are not controls: the
// wrapper owns pause, ready, and layout. Colour default is brand tokens;
// upstream default is an empty list, which uses the implicit three-channel
// formula instead of a colour array.
export const COLOR_BENDS_DEFAULTS = {
  rotation: 90,
  speed: 0.2,
  colors: ['#0035B1', '#DEF54F', '#FFFFFF'] as string[],
  transparent: true,
  autoRotate: 0,
  scale: 1,
  frequency: 1,
  warpStrength: 1,
  mouseInfluence: 1,
  parallax: 0.5,
  noise: 0.15,
  iterations: 1,
  intensity: 1.5,
  bandWidth: 6,
  reducedMotion: 'never' as ReducedMotionMode,
};
