import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'Cubes',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/cubes',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Cubes/Cubes.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Cubes/Cubes.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'gsap',
      version: '3.15.0',
      licence: 'GSAP Standard License, no charge (https://gsap.com/standard-license)',
      unpackedKb: 6111,
      why: 'The upstream file tweens rotateX/rotateY on each cube toward the pointer and ripples face colour on click. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// cubeSize 0 and cellGap 0 mean "use the upstream auto layout" (1fr cells, 5% gap).
export const CUBES_DEFAULTS = {
  gridSize: 10,
  cubeSize: 0,
  maxAngle: 45,
  radius: 3,
  easing: 'power3.out',
  duration: { enter: 0.3, leave: 0.6 },
  cellGap: 0,
  borderStyle: '1px solid #FFFFFF',
  // Brand ink. Upstream default #120F17.
  faceColor: '#212121',
  shadow: false,
  autoAnimate: true,
  rippleOnClick: true,
  // Brand paper. Upstream default #fff.
  rippleColor: '#FFFFFF',
  rippleSpeed: 2,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const GSAP_EASES = [
  'none',
  'power1.out',
  'power2.out',
  'power3.out',
  'power2.inOut',
] as const;
