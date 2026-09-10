import type { FluidConfig } from './fluid';
import type { ReducedMotionMode } from '../pointer/source';

export const SPLASH_SOURCE = {
  origin: {
    name: 'WebGL-Fluid-Simulation',
    author: 'Pavel Dobryakov',
    repo: 'https://github.com/PavelDoGreat/WebGL-Fluid-Simulation',
    file: 'https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/blob/master/script.js',
    version: 'master a2d2929, pushed 2024-11-12',
    licence: 'MIT',
    licenceUrl:
      'https://github.com/PavelDoGreat/WebGL-Fluid-Simulation/blob/master/LICENSE',
    licenceFile: 'LICENSE-webgl-fluid-simulation.txt',
  },
  reference: {
    name: 'React Bits Splash Cursor',
    page: 'https://reactbits.dev/animations/splash-cursor',
    file: 'https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Animations/SplashCursor/SplashCursor.tsx',
    version: 'main, read 2026-09-10',
    licence: 'MIT plus Commons Clause',
  },
  licencePath:
    'Rebuilt from the MIT origin; React Bits file not copied. React Bits was read for prop names and defaults only.',
} as const;

export const SPLASH_DEFAULTS: FluidConfig & { reducedMotion: ReducedMotionMode } =
  {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1440,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 3,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    BACK_COLOR: { r: 0.5, g: 0, b: 0 },
    TRANSPARENT: true,
    RAINBOW_MODE: true,
    // Brand token --accent-blue. React Bits uses #ff0000.
    COLOR: '#0035B1',
    reducedMotion: 'never',
  };

export const SPLASH_STAGE_HEIGHT = 360;
