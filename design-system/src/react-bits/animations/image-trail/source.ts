import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ImageTrail',
  section: 'Animations',
  page: 'https://reactbits.dev/animations/image-trail',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ImageTrail/ImageTrail.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/ImageTrail/ImageTrail.tsx',
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
      why: 'Each trail variant tweens the next photograph with gsap.set and gsap.timeline as the pointer moves. motion would replace those eight variant classes.',
      repo: 'https://github.com/greensock/GSAP',
    },
  ],
};

// items is not a control: the wrapper always passes Academy photographs.
// paused is local.
export const IMAGE_TRAIL_DEFAULTS = {
  variant: 1,
  reducedMotion: 'never' as ReducedMotionMode,
};

export const IMAGE_TRAIL_VARIANTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
