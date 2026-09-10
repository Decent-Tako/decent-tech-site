import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ReflectiveCard',
  section: 'Components',
  page: 'https://reactbits.dev/components/reflective-card',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ReflectiveCard/ReflectiveCard.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ReflectiveCard/ReflectiveCard.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [
    {
      package: 'lucide-react',
      version: '1.43.0',
      licence: 'ISC',
      unpackedKb: 33754,
      why: 'The upstream file draws Lock, Activity, and Fingerprint icons on the badge and footer. The component is vendored as-is, so its runtime comes with it.',
      repo: 'https://github.com/lucide-icons/lucide',
    },
  ],
};

// One entry per upstream prop a person can set. className, style, fallback
// photograph, and the copy fields are not controls. color is paper. Upstream
// text colour was white. overlayColor stays a paper wash.
export const REFLECTIVE_CARD_DEFAULTS = {
  blurStrength: 12,
  color: '#FFFFFF',
  metalness: 1,
  roughness: 0.4,
  overlayColor: 'rgba(255, 255, 255, 0.1)',
  displacementStrength: 20,
  noiseScale: 1,
  specularConstant: 1.2,
  grayscale: 1,
  glassDistortion: 0,
  reducedMotion: 'never' as ReducedMotionMode,
};
