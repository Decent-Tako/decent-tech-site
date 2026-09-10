import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LiquidEther',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/liquid-ether',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LiquidEther/LiquidEther.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LiquidEther/LiquidEther.tsx',
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
      why: 'The upstream file runs a three.js fluid sim with ping-pong FBOs and RawShaderMaterial. Motion cannot own that WebGL loop.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// className, style, paused, onReady, and onError are not controls. Colour
// defaults are brand tokens: #0035B1, #DEF54F, #FFFFFF (upstream #5227FF,
// #FF9FFC, #B497CF). backgroundColor is unused in the sketch; upstream
// hard-codes a transparent clear.
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
  colors: ['#0035B1', '#DEF54F', '#FFFFFF'],
  autoDemo: true,
  autoSpeed: 0.5,
  autoIntensity: 2.2,
  takeoverDuration: 0.25,
  autoResumeDelay: 1000,
  autoRampDuration: 0.6,
  backgroundColor: '#FFFFFF',
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
