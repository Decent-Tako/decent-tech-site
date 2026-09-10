export const GLOBE_SIZE = 600;
export const GLOBE_DPR = 2;

export const ACADEMY_CITIES = [
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
  { name: 'Brisbane', lat: -27.4698, lon: 153.0251 },
  { name: 'Perth', lat: -31.9523, lon: 115.8613 },
  { name: 'Adelaide', lat: -34.9285, lon: 138.6007 },
  { name: 'Canberra', lat: -35.2809, lon: 149.13 },
] as const;

export type ReducedMotionMode = 'user' | 'always' | 'never';

export const GLOBE_DEFAULTS = {
  phi: 0,
  theta: 0.3,
  rotationSpeed: 0.005,
  mapSamples: 16000,
  mapBrightness: 1.2,
  mapBaseBrightness: 0,
  diffuse: 1.2,
  dark: 0,
  baseColor: '#212121',
  markerColor: '#DEF54F',
  glowColor: '#FFFFFF',
  markerSize: 0.08,
  paused: false,
  reducedMotion: 'never' as ReducedMotionMode,
};

/** Face the Australian capitals. phi = π − (lon·π/180 − π/2), theta = lat·π/180. */
export const AUSTRALIA_VIEW = {
  phi: 2.38,
  theta: -0.44,
};

export const COBE_DOCS = 'https://github.com/shuding/cobe';
export const COBE_DEMO = 'https://cobe.vercel.app';
export const COBE_SOURCE = 'https://github.com/shuding/cobe';
export const COBE_TYPES = 'https://unpkg.com/cobe@0.6.5/dist/index.d.ts';
