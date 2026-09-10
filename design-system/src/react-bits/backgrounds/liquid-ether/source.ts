import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LiquidEther',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/liquid-ether',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LiquidEther/LiquidEther.tsx',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LiquidEther/LiquidEther.css',
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
      why: 'The upstream file runs a Navier-Stokes fluid solver as a chain of three.js render targets: advection, viscosity, divergence, pressure, and a colour pass through a palette texture. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// Upstream default colours are #5227FF, #FF9FFC, #B497CF. The brand
// defaults below are accent blue, accent yellow, and paper.
export const LIQUID_ETHER_COLORS = ['#0035B1', '#DEF54F', '#FFFFFF'];

// One entry per upstream prop, with the upstream default. `style` and
// `className` are not controls: the wrapper owns the box.
export const LIQUID_ETHER_DEFAULTS = {
  mouseForce: 20,
  cursorSize: 100,
  isViscous: false,
  viscous: 30,
  iterationsViscous: 32,
  iterationsPoisson: 32,
  dt: 0.014,
  BFECC: true,
  resolution: 0.5,
  isBounce: false,
  colors: LIQUID_ETHER_COLORS,
  autoDemo: true,
  autoSpeed: 0.5,
  autoIntensity: 2.2,
  takeoverDuration: 0.25,
  autoResumeDelay: 1000,
  autoRampDuration: 0.6,
  // Brand token --ink. Upstream default #FFFFFF.
  backgroundColor: '#212121',
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
