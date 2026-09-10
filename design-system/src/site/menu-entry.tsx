// Site entry: mounts the Infinite Menu into #menu-stage on the home page.
// Built by vite.site.config.ts into dist-site/assets/menu.js and menu.css.
// The link list in the page stays the keyboard path and the no-WebGL path.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { SiteMenu } from './SiteMenu';

import './menu.css';

// Probe for WebGL 2 on a throwaway canvas. The vendored class throws when the
// context is null, so the probe runs once before anything mounts.
function probeWebgl(): boolean {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return false;
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return true;
}

function mount() {
  const stage = document.getElementById('menu-stage');
  if (!stage) return;
  if (!probeWebgl()) {
    stage.dataset.webgl = 'unavailable';
    return;
  }
  // The stage plate colour is a site token; read it so no hex lives here.
  // An empty value leaves the vendored default in place.
  const backgroundColor =
    getComputedStyle(stage).getPropertyValue('--stage').trim() || undefined;
  const markReady = () => {
    stage.dataset.webgl = 'ready';
  };
  createRoot(stage).render(
    <StrictMode>
      <SiteMenu backgroundColor={backgroundColor} onReady={markReady} />
    </StrictMode>,
  );
}

mount();
