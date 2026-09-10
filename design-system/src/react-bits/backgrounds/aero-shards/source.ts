import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'AeroShards',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/aero-shards',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/AeroShards/AeroShards.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/AeroShards/AeroShards.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'vgpu',
      version: '0.3.1',
      licence: 'MIT',
      unpackedKb: 6043,
      why: 'The upstream file drives a WebGPU shard field through vgpu init, draw, effect, and surface. Motion cannot compile WGSL or own a GPU device.',
      repo: 'https://github.com/vercel-labs/vgpu',
    },
  ],
};

export const AERO_SHARDS_PLACEMENTS = ['right', 'left', 'center', 'full'] as const;
export const AERO_SHARDS_FLOWS = ['stream', 'vortex', 'ribbon'] as const;
export const AERO_SHARDS_MATERIALS = ['pearl', 'chrome', 'satin'] as const;
export const AERO_SHARDS_DETAILS = ['bold', 'balanced', 'fine'] as const;
export const AERO_SHARDS_EFFECTS = ['none', 'dither', 'ascii'] as const;
export const AERO_SHARDS_INTERACTIONS = ['none', 'repel', 'attract'] as const;

// className, paused, onError, and onReady are not controls: the wrapper owns pause and ready.
export const AERO_SHARDS_DEFAULTS = {
  backgroundColor: '#212121',
  shardColor: '#FFFFFF',
  accentColor: '#0035B1',
  placement: 'full' as (typeof AERO_SHARDS_PLACEMENTS)[number],
  flow: 'stream' as (typeof AERO_SHARDS_FLOWS)[number],
  rippleIntensity: 1,
  holdToGather: true,
  material: 'pearl' as (typeof AERO_SHARDS_MATERIALS)[number],
  detail: 'balanced' as (typeof AERO_SHARDS_DETAILS)[number],
  effect: 'none' as (typeof AERO_SHARDS_EFFECTS)[number],
  scale: 1,
  spread: 1,
  depth: 1,
  speed: 1,
  spin: 1,
  interaction: 'repel' as (typeof AERO_SHARDS_INTERACTIONS)[number],
  density: 1.5,
  shardSize: 1.1,
  stretch: 1,
  turbulence: 1,
  glow: 1,
  edgeSoftness: 2,
  bloom: 0.5,
  grain: 0.05,
  chromaticAberration: 0.0075,
  transitionDuration: 1,
  interactionRadius: 1.5,
  interactionStrength: 0.5,
  reducedMotion: 'never' as ReducedMotionMode,
};
