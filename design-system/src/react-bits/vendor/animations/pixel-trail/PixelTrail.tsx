/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/PixelTrail/PixelTrail.tsx
 * Page: https://reactbits.dev/animations/pixel-trail
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. Drive the scene with three.js directly. @react-three/fiber and drei
 *    leak JSX types that break Motion primitive stories in this library.
 * 2. preserveDrawingBuffer so tests can read pixels after a frame.
 * 3. paused skips new trail stamps. seedCenter writes one stamp at the middle.
 * 4. onReady fires after the first draw. onUnavailable fires when WebGL is missing.
 * 5. data-testid on the canvas. Pointer listeners sit on the host, not window.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import './PixelTrail.css';

interface GooeyFilterProps {
  id?: string;
  strength?: number;
}

interface PixelTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  color?: string;
  className?: string;
  gooeyFilter?: { id: string; strength: number };
  paused?: boolean;
  seedCenter?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
}

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = `
uniform vec2 resolution;
uniform sampler2D mouseTrail;
uniform float gridSize;
uniform vec3 pixelColor;

vec2 coverUv(vec2 uv) {
  vec2 s = resolution.xy / max(resolution.x, resolution.y);
  vec2 newUv = (uv - 0.5) * s + 0.5;
  return clamp(newUv, 0.0, 1.0);
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / resolution;
  vec2 uv = coverUv(screenUv);
  vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;
  float trail = texture2D(mouseTrail, gridUvCenter).r;
  gl_FragColor = vec4(pixelColor, trail);
}
`;

const GooeyFilter = ({ id = 'goo-filter', strength = 10 }: GooeyFilterProps) => {
  return (
    <svg className="goo-filter-container">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

export default function PixelTrail({
  gridSize = 40,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  color = '#ffffff',
  className = '',
  gooeyFilter,
  paused = false,
  seedCenter = false,
  onReady,
  onUnavailable,
}: PixelTrailProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const onReadyRef = useRef(onReady);
  const onUnavailableRef = useRef(onUnavailable);
  const propsRef = useRef({ gridSize, trailSize, maxAge, interpolate, color, seedCenter });
  pausedRef.current = paused;
  onReadyRef.current = onReady;
  onUnavailableRef.current = onUnavailable;
  propsRef.current = { gridSize, trailSize, maxAge, interpolate, color, seedCenter };

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const host: HTMLDivElement = node;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      onUnavailableRef.current?.();
      return;
    }
    if (!renderer.getContext()) {
      onUnavailableRef.current?.();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute('data-testid', 'pixel-trail-canvas');
    renderer.domElement.className = `pixel-canvas ${className}`.trim();
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const trailCanvas = document.createElement('canvas');
    trailCanvas.width = 512;
    trailCanvas.height = 512;
    const trailCtx = trailCanvas.getContext('2d');
    if (!trailCtx) {
      onUnavailableRef.current?.();
      return;
    }
    trailCtx.fillStyle = 'black';
    trailCtx.fillRect(0, 0, 512, 512);
    const trailTexture = new THREE.CanvasTexture(trailCanvas);
    trailTexture.minFilter = THREE.NearestFilter;
    trailTexture.magFilter = THREE.NearestFilter;
    trailTexture.wrapS = THREE.ClampToEdgeWrapping;
    trailTexture.wrapT = THREE.ClampToEdgeWrapping;

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        resolution: { value: new THREE.Vector2(1, 1) },
        mouseTrail: { value: trailTexture },
        gridSize: { value: gridSize },
        pixelColor: { value: new THREE.Color(color) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const last = { x: 0.5, y: 0.5, has: false };

    function stamp(u: number, v: number) {
      const radius = Math.max(4, propsRef.current.trailSize * 512);
      const x = u * 512;
      const y = (1 - v) * 512;
      const steps = Math.max(1, Math.round(propsRef.current.interpolate));
      const fromX = last.has ? last.x : x;
      const fromY = last.has ? last.y : y;
      for (let i = 1; i <= steps; i += 1) {
        const px = fromX + ((x - fromX) * i) / steps;
        const py = fromY + ((y - fromY) * i) / steps;
        const grd = trailCtx!.createRadialGradient(px, py, 0, px, py, radius);
        grd.addColorStop(0, 'rgba(255,255,255,1)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        trailCtx!.globalCompositeOperation = 'lighter';
        trailCtx!.fillStyle = grd;
        trailCtx!.beginPath();
        trailCtx!.arc(px, py, radius, 0, Math.PI * 2);
        trailCtx!.fill();
      }
      last.x = x;
      last.y = y;
      last.has = true;
      trailTexture.needsUpdate = true;
    }

    function fade(deltaMs: number) {
      const age = Math.max(50, propsRef.current.maxAge);
      const alpha = Math.min(0.35, deltaMs / age);
      trailCtx!.globalCompositeOperation = 'source-over';
      trailCtx!.fillStyle = `rgba(0,0,0,${alpha})`;
      trailCtx!.fillRect(0, 0, 512, 512);
      trailTexture.needsUpdate = true;
    }

    function resize() {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      if (!host.isConnected) return;
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = `${width}px`;
      renderer.domElement.style.height = `${height}px`;
      material.uniforms.resolution.value.set(
        width * renderer.getPixelRatio(),
        height * renderer.getPixelRatio(),
      );
    }

    function onPointerMove(event: PointerEvent) {
      if (pausedRef.current) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const u = (event.clientX - rect.left) / rect.width;
      const v = 1 - (event.clientY - rect.top) / rect.height;
      stamp(u, v);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener('pointermove', onPointerMove);
    resize();

    if (propsRef.current.seedCenter) {
      stamp(0.5, 0.5);
    }

    let lastT = 0;
    let notifiedReady = false;
    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const delta = lastT ? t - lastT : 16;
      lastT = t;
      if (!pausedRef.current) {
        fade(delta);
      }
      material.uniforms.gridSize.value = propsRef.current.gridSize;
      (material.uniforms.pixelColor.value as THREE.Color).set(propsRef.current.color);
      renderer.render(scene, camera);
      if (!notifiedReady) {
        notifiedReady = true;
        onReadyRef.current?.();
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
      mesh.geometry.dispose();
      material.dispose();
      trailTexture.dispose();
      renderer.dispose();
    };
  }, [className, color, gridSize]);

  return (
    <>
      {gooeyFilter ? <GooeyFilter id={gooeyFilter.id} strength={gooeyFilter.strength} /> : null}
      <div
        ref={hostRef}
        className="pixel-trail-host"
        style={gooeyFilter ? { filter: `url(#${gooeyFilter.id})` } : undefined}
      />
    </>
  );
}
