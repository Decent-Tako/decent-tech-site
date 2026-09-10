import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'LightPillar',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/light-pillar',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LightPillar/LightPillar.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/LightPillar/LightPillar.tsx',
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
      why: 'The upstream file raymarches a noise pillar on a three.js ShaderMaterial plane. Motion cannot own that WebGL loop.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

// className, paused, onReady, and onError are not controls. Colour defaults
// are brand tokens: topColor accent-blue #0035B1 (upstream #5227FF),
// bottomColor accent-yellow #DEF54F (upstream #FF9FFC).
export const LIGHT_PILLAR_DEFAULTS = {
  topColor: '#0035B1',
  bottomColor: '#DEF54F',
  intensity: 1.0,
  rotationSpeed: 0.3,
  interactive: false,
  glowAmount: 0.005,
  pillarWidth: 3.0,
  pillarHeight: 0.4,
  noiseIntensity: 0.5,
  mixBlendMode: 'screen' as const,
  pillarRotation: 0,
  quality: 'high' as const,
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
