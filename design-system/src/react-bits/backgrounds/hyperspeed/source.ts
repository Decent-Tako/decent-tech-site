import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Hyperspeed',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/hyperspeed',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Hyperspeed/HyperSpeedPresets.ts',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Hyperspeed/Hyperspeed.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Hyperspeed/Hyperspeed.tsx',
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
      why: 'The upstream file builds a road, car lights, and sticks on three.js. Motion cannot own that scene graph.',
      repo: 'https://github.com/mrdoob/three.js',
    },
    {
      package: 'postprocessing',
      version: '6.39.5',
      licence: 'Zlib',
      unpackedKb: 2709,
      why: 'The upstream file composites BloomEffect and SMAAEffect through EffectComposer.',
      repo: 'https://github.com/pmndrs/postprocessing',
    },
  ],
};

export const HYPERSPEED_PRESETS = ['one', 'two', 'three', 'four', 'five', 'six'] as const;
export type HyperspeedPreset = (typeof HYPERSPEED_PRESETS)[number];

// effectOptions, paused, onReady, and onError are not controls. preset
// selects the upstream demo options. Nested colours stay with the preset
// except background, which is brand ink 0x212121 (upstream 0x000000).
export const HYPERSPEED_DEFAULTS = {
  preset: 'one' as HyperspeedPreset,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
