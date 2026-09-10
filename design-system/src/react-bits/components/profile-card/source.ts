import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: 'ProfileCard',
  section: 'Components',
  page: 'https://reactbits.dev/components/profile-card',
  files: [
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ProfileCard/ProfileCard.css',
    'https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ProfileCard/ProfileCard.tsx',
  ],
  sha: '625f25025fed1c28e2de7d3ac5f12ee83542844d',
  vendoredOn: '2026-09-10',
  licence: 'MIT + Commons Clause',
  runtime: [],
};

// One entry per upstream prop a person can set. avatarUrl, miniAvatarUrl,
// iconUrl, grainUrl, name, title, handle, status, contactText, className,
// and onContactClick are not controls: the wrapper supplies Academy copy
// and photographs. behindGlowColor uses accent blue. Upstream glow was
// rgba(125, 190, 255, 0.67).
export const PROFILE_CARD_DEFAULTS = {
  innerGradient: 'linear-gradient(145deg,#0035B18c 0%,#DEF54F44 100%)',
  behindGlowEnabled: true,
  behindGlowColor: 'rgba(0, 53, 177, 0.67)',
  behindGlowSize: '50%',
  enableTilt: true,
  enableMobileTilt: false,
  mobileTiltSensitivity: 5,
  showUserInfo: true,
  reducedMotion: 'never' as ReducedMotionMode,
};
