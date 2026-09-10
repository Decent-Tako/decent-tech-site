// Site entry: mounts the Infinite Menu into #menu-stage on the home page and
// one scene into every [data-scene] and [data-effect] element on any page.
// Built by vite.site.config.ts into dist-site/assets/site.js and site.css;
// each scene is its own chunk. The link list and the page copy stay the
// keyboard path and the no-WebGL path.
import { createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { SCENES } from './scenes';
import { SiteMenu } from './SiteMenu';

import './menu.css';
import './scenes.css';

// Probe for WebGL 2 on a throwaway canvas, once. The vendored classes throw
// when the context is null, so the probe runs before anything mounts.
let webglProbe: boolean | null = null;
function probeWebgl(): boolean {
  if (webglProbe !== null) return webglProbe;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext();
  webglProbe = gl !== null;
  return webglProbe;
}

function mountMenu() {
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

// Every canvas a scene draws is decorative.
function hideCanvases(host: HTMLElement) {
  host.querySelectorAll('canvas').forEach((canvas) => {
    canvas.setAttribute('aria-hidden', 'true');
  });
}

async function mountScene(host: HTMLElement) {
  const name = host.dataset.scene ?? host.dataset.effect ?? '';
  const entry = SCENES[name];
  if (!entry) {
    console.warn(`site: no scene named "${name}"; nothing mounted.`);
    return;
  }
  if (entry.webgl && !probeWebgl()) {
    host.dataset.webgl = 'unavailable';
    return;
  }
  host.dataset.webgl = 'pending';
  const text = host.textContent?.trim() ?? '';
  const onReady = () => {
    host.dataset.webgl = 'ready';
    hideCanvases(host);
  };
  try {
    const module = await entry.load();
    createRoot(host).render(
      <StrictMode>
        {createElement(module.default, { host, dataset: host.dataset, text, onReady })}
      </StrictMode>,
    );
  } catch (error) {
    // A failed chunk leaves the page as it was: copy in front, no scene.
    host.dataset.webgl = 'unavailable';
    console.warn(`site: scene "${name}" did not load.`, error);
  }
}

function mountScenes() {
  document
    .querySelectorAll<HTMLElement>('[data-scene], [data-effect]')
    .forEach((host) => void mountScene(host));
}

mountMenu();
mountScenes();
