/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Backgrounds/Silk/Silk.tsx
 * Page: https://reactbits.dev/backgrounds/silk
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. Drive the scene with three.js directly. @react-three/fiber leaks JSX types
 *    that break Motion primitive stories in this library.
 * 2. preserveDrawingBuffer: true so play can sample the canvas after pause.
 * 3. paused, onReady, and onError props so the story can hold time and prove paint.
 * 4. Advance time for 12 frames before Pause holds, so a still frame has paint.
 */
import { useEffect, useRef, type FC } from 'react';
import * as THREE from 'three';

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uLightMode;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float grain = rnd / 15.0 * uNoiseIntensity;
  vec3 result = uColor * pattern - vec3(grain);
if (uLightMode > 0.5) {
  float fold = smoothstep(0.28, 0.9, pattern);
  float specular = smoothstep(0.72, 0.98, pattern);
  vec3 shadowColor = uColor * 0.72;
  vec3 bodyColor = min(uColor * 1.18, vec3(1.0));
  vec3 lightBase = mix(shadowColor, bodyColor, fold);
  lightBase = mix(lightBase, vec3(1.0), specular * 0.92);
  float fineNoise = noise(gl_FragCoord.xy * 0.63 + vec2(17.0, 41.0));
  float grainSignal = (rnd + fineNoise - 1.0);
  float grainStrength = clamp(uNoiseIntensity * 0.038, 0.0, 0.16);
  result = lightBase + grainSignal * grainStrength;
}
  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`;

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  lightMode?: boolean;
  className?: string;
  paused?: boolean;
  onReady?: () => void;
  onError?: () => void;
}

const Silk: FC<SilkProps> = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  lightMode = false,
  className = '',
  paused = false,
  onReady,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  pausedRef.current = paused;
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      onErrorRef.current?.();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new THREE.Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uLightMode: { value: lightMode ? 1 : 0 },
      uTime: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    let frames = 0;
    let notifiedReady = false;
    const WARM = 12;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const delta = clock.getDelta();
      const hold = pausedRef.current && frames >= WARM;
      if (!hold) {
        uniforms.uTime.value += 0.1 * delta;
        frames += 1;
      }
      uniforms.uSpeed.value = speed;
      uniforms.uScale.value = scale;
      uniforms.uNoiseIntensity.value = noiseIntensity;
      uniforms.uColor.value.setRGB(...hexToNormalizedRGB(color));
      uniforms.uRotation.value = rotation;
      uniforms.uLightMode.value = lightMode ? 1 : 0;
      renderer.render(scene, camera);
      if (!notifiedReady) {
        notifiedReady = true;
        onReadyRef.current?.();
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [speed, scale, color, noiseIntensity, rotation, lightMode]);

  return (
    <div
      ref={containerRef}
      className={`silk-container ${className}`.trim()}
      role="img"
      aria-label="Silk"
    />
  );
};

export default Silk;
