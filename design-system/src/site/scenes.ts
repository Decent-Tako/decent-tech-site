// The scene registry. Each page names a scene in HTML with data-scene (the
// full-bleed background) or data-effect (a text animation or a cursor), and
// site-entry.tsx mounts the named module into that element. Every entry is
// a dynamic import, so each scene is its own chunk and a page downloads only
// what it mounts.
import type { ComponentType } from 'react';

export type SceneProps = {
  /** The element the scene mounts into. */
  host: HTMLElement;
  /** The data-* attributes of the host, for colours and numbers. */
  dataset: DOMStringMap;
  /** The text the host held before the scene mounted. Text scenes render it. */
  text: string;
  /** Called once, after the first frame has drawn. */
  onReady: () => void;
  /** Called once the entry animation has finished. Sets data-done on the host. */
  onDone: () => void;
};

export type SceneModule = { default: ComponentType<SceneProps> };

export type SceneEntry = {
  load: () => Promise<SceneModule>;
  /** True when the scene draws with WebGL and needs the probe. */
  webgl: boolean;
};

export const SCENES: Readonly<Record<string, SceneEntry>> = {
  'liquid-ether': { load: () => import('./scenes/LiquidEtherScene'), webgl: true },
  galaxy: { load: () => import('./scenes/GalaxyScene'), webgl: true },
  threads: { load: () => import('./scenes/ThreadsScene'), webgl: true },
  iridescence: { load: () => import('./scenes/IridescenceScene'), webgl: true },
  plasma: { load: () => import('./scenes/PlasmaScene'), webgl: true },
  'splash-cursor': { load: () => import('./scenes/SplashCursorScene'), webgl: true },
  ribbons: { load: () => import('./scenes/RibbonsScene'), webgl: true },
  'split-text': { load: () => import('./scenes/SplitTextScene'), webgl: false },
  'scrambled-text': { load: () => import('./scenes/ScrambledTextScene'), webgl: false },
  'shiny-text': { load: () => import('./scenes/ShinyTextScene'), webgl: false },
  'magnetic-form': { load: () => import('./scenes/MagneticFormScene'), webgl: false },
  'section-dots': { load: () => import('./scenes/SectionDotsScene'), webgl: false },
  'next-dot': { load: () => import('./scenes/NextDotScene'), webgl: false },
};

export const SCENE_NAMES = Object.keys(SCENES);
