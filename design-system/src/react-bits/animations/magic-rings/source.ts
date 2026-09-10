import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'MagicRings',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/magic-rings',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/MagicRings/MagicRings.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/MagicRings/MagicRings.tsx',
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
      why: 'The sketch draws expanding rings with a three.js ShaderMaterial on a full-screen quad. motion cannot compile the GLSL ring field.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// paused, onReady, and onUnavailable are local.
export const MAGIC_RINGS_DEFAULTS = {
  // Brand accent yellow. Upstream default #fc42ff.
  color: '#DEF54F',
  // Brand accent blue. Upstream default #42fcff.
  colorTwo: '#0035B1',
  speed: 1,
  ringCount: 6,
  attenuation: 10,
  lineThickness: 2,
  baseRadius: 0.35,
  radiusStep: 0.1,
  scaleRate: 0.1,
  opacity: 1,
  blur: 0,
  noiseAmount: 0.1,
  rotation: 0,
  ringGap: 1.5,
  fadeIn: 0.7,
  fadeOut: 0.5,
  followMouse: false,
  mouseInfluence: 0.2,
  hoverScale: 1.2,
  parallax: 0.05,
  clickBurst: false,
  alphaMode: 'luminance' as 'luminance' | 'coverage',
  reducedMotion: 'never' as ReducedMotionMode,
};

export const MAGIC_RINGS_ALPHA = ['luminance', 'coverage'] as const;
