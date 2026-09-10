import type { ReactBitsSource, ReducedMotionMode } from '../../types';
import type { FlowDirection } from '../../vendor/backgrounds/light-tunnel/LightTunnel';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LightTunnel',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/light-tunnel',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LightTunnel/LightTunnel.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LightTunnel/LightTunnel.tsx',
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
      why: 'The upstream file draws a fibre tunnel on an ogl Renderer, Program, Mesh, and Triangle. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/oframe/ogl',
    },
  ],
};

export const FLOW_DIRECTIONS = ['inward', 'outward'] as const satisfies readonly FlowDirection[];

// className, paused, onReady, and onError are not controls. Colour defaults
// are brand tokens: cableColor accent-blue #0035B1 (upstream #A855F7),
// pulseColor accent-yellow #DEF54F (upstream #A855F7), tunnelColor ink
// #212121 (upstream #5227FF).
export const LIGHT_TUNNEL_DEFAULTS = {
  cableColor: '#0035B1',
  pulseColor: '#DEF54F',
  tunnelColor: '#212121',
  tunnelOpacity: 0,
  speed: 0.1,
  flowDirection: 'outward' as FlowDirection,
  pulseSpeed: 2,
  pulseLength: 0.28,
  pulseBlend: 1,
  pulseWidth: 1,
  cableCount: 20,
  thickness: 0.35,
  rimWidth: 0.15,
  waviness: 0.3,
  sway: 0.5,
  size: 1.0,
  centerX: 0.0,
  centerY: 0.0,
  glow: 1.0,
  fadeNear: 0.5,
  fadeFar: 2,
  brightness: 1.0,
  colorVariance: true,
  grain: true,
  grainIntensity: 0.05,
  opacity: 1.0,
  mouseInteraction: true,
  mouseStrength: 0.1,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
