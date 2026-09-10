/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Antigravity/Antigravity.tsx
 * Page: https://reactbits.dev/animations/antigravity
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. Drop @react-three/fiber. Its JSX map of THREE TSL names (div, code, label)
 *    collides with HTML tags and breaks Motion types. The sketch now uses a
 *    three.js WebGLRenderer, the same camera, and the same particle step.
 * 2. Bind pointer listeners to the canvas parent, not window.
 * 3. preserveDrawingBuffer: true so tests can read pixels after a frame.
 * 4. paused stops the frame loop and keeps the last frame.
 * 5. onReady fires after the first draw. onUnavailable fires when WebGL is missing.
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
  paused?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
}

type Particle = {
  t: number;
  factor: number;
  speed: number;
  xFactor: number;
  yFactor: number;
  zFactor: number;
  mx: number;
  my: number;
  mz: number;
  cx: number;
  cy: number;
  cz: number;
  vx: number;
  vy: number;
  vz: number;
  randomRadiusOffset: number;
};

function makeGeometry(shape: AntigravityProps['particleShape']) {
  if (shape === 'sphere') return new THREE.SphereGeometry(0.2, 16, 16);
  if (shape === 'box') return new THREE.BoxGeometry(0.3, 0.3, 0.3);
  if (shape === 'tetrahedron') return new THREE.TetrahedronGeometry(0.3);
  return new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
}

function viewportSize(camera: THREE.PerspectiveCamera, aspect: number) {
  const distance = camera.position.z;
  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
  return { width: height * aspect, height };
}

const Antigravity: React.FC<AntigravityProps> = ({
  count = 300,
  magnetRadius = 10,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 2,
  lerpSpeed = 0.1,
  color = '#FF9FFC',
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10,
  paused = false,
  onReady,
  onUnavailable,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const onReadyRef = useRef(onReady);
  const onUnavailableRef = useRef(onUnavailable);
  pausedRef.current = paused;
  onReadyRef.current = onReady;
  onUnavailableRef.current = onUnavailable;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      onUnavailableRef.current?.();
      return;
    }
    if (!renderer.getContext()) {
      onUnavailableRef.current?.();
      renderer.dispose();
      return;
    }

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
    camera.position.set(0, 0, 50);
    const scene = new THREE.Scene();
    const dummy = new THREE.Object3D();
    const clock = new THREE.Clock();

    const geometry = makeGeometry(particleShape);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    scene.add(mesh);

    const pointerNdc = { x: 0, y: 0 };
    const lastMousePos = { x: 0, y: 0 };
    let lastMouseMoveTime = 0;
    const virtualMouse = { x: 0, y: 0 };

    let view = { width: 100, height: 100 };
    const particles: Particle[] = [];

    const seedParticles = () => {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        const x = (Math.random() - 0.5) * view.width;
        const y = (Math.random() - 0.5) * view.height;
        const z = (Math.random() - 0.5) * 20;
        particles.push({
          t: Math.random() * 100,
          factor: 20 + Math.random() * 100,
          speed: 0.01 + Math.random() / 200,
          xFactor: -50 + Math.random() * 100,
          yFactor: -50 + Math.random() * 100,
          zFactor: -50 + Math.random() * 100,
          mx: x,
          my: y,
          mz: z,
          cx: x,
          cy: y,
          cz: z,
          vx: 0,
          vy: 0,
          vz: 0,
          randomRadiusOffset: (Math.random() - 0.5) * 2,
        });
      }
    };

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      view = viewportSize(camera, camera.aspect);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const step = () => {
      const elapsed = clock.getElapsedTime();
      const mouseDist = Math.hypot(pointerNdc.x - lastMousePos.x, pointerNdc.y - lastMousePos.y);
      if (mouseDist > 0.001) {
        lastMouseMoveTime = Date.now();
        lastMousePos.x = pointerNdc.x;
        lastMousePos.y = pointerNdc.y;
      }

      let destX = (pointerNdc.x * view.width) / 2;
      let destY = (pointerNdc.y * view.height) / 2;

      if (autoAnimate && Date.now() - lastMouseMoveTime > 2000) {
        destX = Math.sin(elapsed * 0.5) * (view.width / 4);
        destY = Math.cos(elapsed * 0.5 * 2) * (view.height / 4);
      }

      virtualMouse.x += (destX - virtualMouse.x) * 0.05;
      virtualMouse.y += (destY - virtualMouse.y) * 0.05;

      const targetX = virtualMouse.x;
      const targetY = virtualMouse.y;
      const globalRotation = elapsed * rotationSpeed;

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        particle.t += particle.speed / 2;
        const t = particle.t;
        const { mx, my, mz, cz, randomRadiusOffset } = particle;

        const projectionFactor = 1 - cz / 50;
        const projectedTargetX = targetX * projectionFactor;
        const projectedTargetY = targetY * projectionFactor;

        const dx = mx - projectedTargetX;
        const dy = my - projectedTargetY;
        const dist = Math.hypot(dx, dy);

        let targetPosX = mx;
        let targetPosY = my;
        let targetPosZ = mz * depthFactor;

        if (dist < magnetRadius) {
          const angle = Math.atan2(dy, dx) + globalRotation;
          const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
          const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));
          const currentRingRadius = ringRadius + wave + deviation;
          targetPosX = projectedTargetX + currentRingRadius * Math.cos(angle);
          targetPosY = projectedTargetY + currentRingRadius * Math.sin(angle);
          targetPosZ = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);
        }

        particle.cx += (targetPosX - particle.cx) * lerpSpeed;
        particle.cy += (targetPosY - particle.cy) * lerpSpeed;
        particle.cz += (targetPosZ - particle.cz) * lerpSpeed;

        dummy.position.set(particle.cx, particle.cy, particle.cz);
        dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
        dummy.rotateX(Math.PI / 2);

        const currentDistToMouse = Math.hypot(
          particle.cx - projectedTargetX,
          particle.cy - projectedTargetY,
        );
        const distFromRing = Math.abs(currentDistToMouse - ringRadius);
        const scaleFactor = Math.max(0, Math.min(1, 1 - distFromRing / 10));
        const finalScale =
          scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
        dummy.scale.set(finalScale, finalScale, finalScale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    resize();
    seedParticles();
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(host);
    host.addEventListener('pointermove', onPointerMove);

    let raf = 0;
    let ready = false;
    const loop = () => {
      if (!pausedRef.current) {
        step();
        if (!ready) {
          ready = true;
          onReadyRef.current?.();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    step();
    ready = true;
    onReadyRef.current?.();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      mesh.dispose();
      renderer.dispose();
    };
  }, [
    count,
    magnetRadius,
    ringRadius,
    waveSpeed,
    waveAmplitude,
    particleSize,
    lerpSpeed,
    color,
    autoAnimate,
    particleVariance,
    rotationSpeed,
    depthFactor,
    pulseSpeed,
    particleShape,
    fieldStrength,
  ]);

  return <div ref={hostRef} style={{ width: '100%', height: '100%' }} />;
};

export default Antigravity;
