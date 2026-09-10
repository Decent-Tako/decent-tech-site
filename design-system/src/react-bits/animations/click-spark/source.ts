import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ClickSpark',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/click-spark',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ClickSpark/ClickSpark.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

export const CLICK_SPARK_DEFAULTS = {
  // Brand accent yellow. Upstream default #fff.
  sparkColor: '#DEF54F',
  sparkSize: 10,
  sparkRadius: 15,
  sparkCount: 8,
  duration: 400,
  easing: 'ease-out' as 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out',
  extraScale: 1.0,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const SPARK_EASES = ['linear', 'ease-in', 'ease-out', 'ease-in-out'] as const;
