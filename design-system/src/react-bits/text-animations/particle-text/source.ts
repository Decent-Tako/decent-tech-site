import { FEATURES } from '../../../pages/content';
import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ParticleText',
  section: 'TextAnimations',
  page: 'https://reactbits.dev/text-animations/particle-text',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ParticleText/ParticleText.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/ParticleText/ParticleText.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const PARTICLE_TRIGGERS = ['mount', 'hover', 'click'] as const;

// className, style, paused, reduced, and onReady are not controls.
// color is ink; upstream default #ffffff. highlightColor is accent blue;
// upstream default #8b5cf6. fontFamily is Brand Sans; upstream inherit.
// fontWeight is 700; upstream 800.
export const PARTICLE_TEXT_DEFAULTS = {
  text: FEATURES[0].title,
  particleSize: 2,
  density: 4,
  color: '#212121',
  highlightColor: '#0035B1',
  scatter: 180,
  gatherDuration: 1600,
  stagger: 420,
  pointerRepel: 40,
  repelRadius: 120,
  idleDrift: 0.7,
  trigger: 'mount' as (typeof PARTICLE_TRIGGERS)[number],
  fontSize: 'clamp(3rem, 12vw, 8rem)',
  fontWeight: 700 as number | string,
  fontFamily: "'Brand Sans', Arial, sans-serif",
  glow: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
