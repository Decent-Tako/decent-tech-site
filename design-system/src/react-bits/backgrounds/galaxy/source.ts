import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Galaxy',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/galaxy',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Galaxy/Galaxy.tsx',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Galaxy/Galaxy.css',
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
      why: 'The upstream file draws four layers of hashed stars in one fragment shader on a full-screen triangle through the ogl Renderer, Program, and Mesh. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

// One entry per upstream prop, with the upstream default. The stars have no
// colour prop; hueShift and saturation set their tint over the transparent
// canvas, so the stage colour behind them is the brand ink.
export const GALAXY_DEFAULTS = {
  focal: [0.5, 0.5] as [number, number],
  rotation: [1.0, 0.0] as [number, number],
  starSpeed: 0.5,
  density: 1,
  hueShift: 140,
  disableAnimation: false,
  speed: 1.0,
  mouseInteraction: true,
  glowIntensity: 0.3,
  saturation: 0.0,
  mouseRepulsion: true,
  repulsionStrength: 2,
  twinkleIntensity: 0.3,
  rotationSpeed: 0.1,
  autoCenterRepulsion: 0,
  transparent: true,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
