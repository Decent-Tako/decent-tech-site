import type { CSSProperties } from 'react';

import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'FloatingLines',
  section: 'Backgrounds',
  page: 'https://reactbits.dev/backgrounds/floating-lines',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/FloatingLines/FloatingLines.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/FloatingLines/FloatingLines.tsx',
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
      why: 'The upstream file draws sine-wave lines on a three.js ShaderMaterial plane. Motion cannot compile GLSL or own a GL context.',
      repo: 'https://github.com/mrdoob/three.js',
    },
  ],
};

export const WAVE_NAMES = ['top', 'middle', 'bottom'] as const;
export type WaveName = (typeof WAVE_NAMES)[number];

export type WavePosition = {
  x: number;
  y: number;
  rotate: number;
};

export const BLEND_MODES = [
  'normal',
  'screen',
  'lighten',
  'multiply',
  'overlay',
] as const satisfies readonly CSSProperties['mixBlendMode'][];

// paused, onReady, and onError are not controls: the wrapper owns pause and ready.
export const FLOATING_LINES_DEFAULTS = {
  linesGradient: ['#0035B1', '#DEF54F'] as string[],
  enabledWaves: ['top', 'middle', 'bottom'] as WaveName[],
  lineCount: [6] as number[],
  lineDistance: [5] as number[],
  topWavePosition: { x: 10.0, y: 0.5, rotate: -0.4 } as WavePosition,
  middleWavePosition: { x: 5.0, y: 0.0, rotate: 0.2 } as WavePosition,
  bottomWavePosition: { x: 2.0, y: -0.7, rotate: -1 } as WavePosition,
  animationSpeed: 1,
  interactive: true,
  bendRadius: 5.0,
  bendStrength: -0.5,
  mouseDamping: 0.05,
  parallax: true,
  parallaxStrength: 0.2,
  mixBlendMode: 'screen' as CSSProperties['mixBlendMode'],
  backgroundColor: '#212121',
  lightMode: false,
  reducedMotion: 'never' as ReducedMotionMode,
};
