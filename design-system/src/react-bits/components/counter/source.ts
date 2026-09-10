import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Counter',
  section: 'Components',
  page: 'https://reactbits.dev/components/counter',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Counter/Counter.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/Counter/Counter.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'motion',
      version: '13.2.0',
      licence: 'MIT',
      unpackedKb: 701,
      why: 'The upstream file uses motion useSpring and useTransform to roll each digit to the current place value. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/motiondivision/motion',
    },
  ],
};

export const FONT_WEIGHTS = [400, 700] as const;

// One entry per upstream prop a person can set. `places`, style objects,
// and `paused` are not controls: places come from the value, and the
// wrapper writes the running value onto the stage. Value 3000 is the
// Academy goal from HERO.facts; upstream has no default because value is
// required.
export const COUNTER_DEFAULTS = {
  value: 3000,
  fontSize: 100,
  padding: 0,
  gap: 8,
  borderRadius: 4,
  horizontalPadding: 8,
  textColor: '#212121',
  fontWeight: 700 as (typeof FONT_WEIGHTS)[number],
  gradientHeight: 16,
  gradientFrom: '#FFFFFF',
  gradientTo: 'transparent',
  reducedMotion: 'never' as ReducedMotionMode,
};
