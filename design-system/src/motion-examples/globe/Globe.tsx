import createGlobe from 'cobe';
import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import {
  ACADEMY_CITIES,
  COBE_DEMO,
  COBE_DOCS,
  COBE_SOURCE,
  COBE_TYPES,
  GLOBE_DEFAULTS,
  GLOBE_DPR,
  GLOBE_SIZE,
  type ReducedMotionMode,
} from './globeData';
import './globe.css';

export type GlobeProps = {
  phi?: number;
  theta?: number;
  rotationSpeed?: number;
  mapSamples?: number;
  mapBrightness?: number;
  mapBaseBrightness?: number;
  diffuse?: number;
  dark?: number;
  baseColor?: string;
  markerColor?: string;
  glowColor?: string;
  markerSize?: number;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function hexToRgb01(hex: string): [number, number, number] {
  const raw = hex.trim().replace('#', '');
  const value =
    raw.length === 3
      ? raw
          .split('')
          .map((part) => part + part)
          .join('')
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return [0, 0, 0];
  }
  const n = Number.parseInt(value, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function shouldReduce(
  mode: ReducedMotionMode,
  prefersReduce: boolean | null,
): boolean {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return prefersReduce === true;
}

function markersForSize(markerSize: number) {
  return ACADEMY_CITIES.map((city) => ({
    location: [city.lat, city.lon] as [number, number],
    size: markerSize,
  }));
}

export function Globe({
  phi = GLOBE_DEFAULTS.phi,
  theta = GLOBE_DEFAULTS.theta,
  rotationSpeed = GLOBE_DEFAULTS.rotationSpeed,
  mapSamples = GLOBE_DEFAULTS.mapSamples,
  mapBrightness = GLOBE_DEFAULTS.mapBrightness,
  mapBaseBrightness = GLOBE_DEFAULTS.mapBaseBrightness,
  diffuse = GLOBE_DEFAULTS.diffuse,
  dark = GLOBE_DEFAULTS.dark,
  baseColor = GLOBE_DEFAULTS.baseColor,
  markerColor = GLOBE_DEFAULTS.markerColor,
  glowColor = GLOBE_DEFAULTS.glowColor,
  markerSize = GLOBE_DEFAULTS.markerSize,
  paused: pausedProp = GLOBE_DEFAULTS.paused,
  reducedMotion = GLOBE_DEFAULTS.reducedMotion,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduce = useReducedMotion();
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const rotating = !paused && !reduce && rotationSpeed > 0;

  const phiRef = useRef(phi);
  const rotatingRef = useRef(rotating);
  const speedRef = useRef(rotationSpeed);
  const thetaRef = useRef(theta);
  const samplesRef = useRef(mapSamples);
  const brightnessRef = useRef(mapBrightness);
  const baseBrightnessRef = useRef(mapBaseBrightness);
  const diffuseRef = useRef(diffuse);
  const darkRef = useRef(dark);
  const baseColorRef = useRef(hexToRgb01(baseColor));
  const markerColorRef = useRef(hexToRgb01(markerColor));
  const glowColorRef = useRef(hexToRgb01(glowColor));
  const markersRef = useRef(markersForSize(markerSize));

  useEffect(() => {
    phiRef.current = phi;
    rotatingRef.current = rotating;
    speedRef.current = rotationSpeed;
    thetaRef.current = theta;
    samplesRef.current = mapSamples;
    brightnessRef.current = mapBrightness;
    baseBrightnessRef.current = mapBaseBrightness;
    diffuseRef.current = diffuse;
    darkRef.current = dark;
    baseColorRef.current = hexToRgb01(baseColor);
    markerColorRef.current = hexToRgb01(markerColor);
    glowColorRef.current = hexToRgb01(glowColor);
    markersRef.current = markersForSize(markerSize);
  }, [
    phi,
    rotating,
    rotationSpeed,
    theta,
    mapSamples,
    mapBrightness,
    mapBaseBrightness,
    diffuse,
    dark,
    baseColor,
    markerColor,
    glowColor,
    markerSize,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = GLOBE_SIZE * GLOBE_DPR;
    const globe = createGlobe(canvas, {
      devicePixelRatio: GLOBE_DPR,
      width,
      height: width,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: darkRef.current,
      diffuse: diffuseRef.current,
      mapSamples: samplesRef.current,
      mapBrightness: brightnessRef.current,
      mapBaseBrightness: baseBrightnessRef.current,
      baseColor: baseColorRef.current,
      markerColor: markerColorRef.current,
      glowColor: glowColorRef.current,
      markers: markersRef.current,
      scale: 1,
      offset: [0, 0],
      opacity: 1,
      onRender: (state) => {
        if (rotatingRef.current) {
          phiRef.current += speedRef.current;
        }
        state.phi = phiRef.current;
        state.theta = thetaRef.current;
        state.mapSamples = samplesRef.current;
        state.mapBrightness = brightnessRef.current;
        state.mapBaseBrightness = baseBrightnessRef.current;
        state.diffuse = diffuseRef.current;
        state.dark = darkRef.current;
        state.baseColor = baseColorRef.current;
        state.markerColor = markerColorRef.current;
        state.glowColor = glowColorRef.current;
        state.markers = markersRef.current;
        state.width = width;
        state.height = width;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <article
      className="academy-globe"
      data-testid="academy-globe"
      data-rotating={rotating ? 'true' : 'false'}
    >
      <div className="academy-globe__bar">
        <h1 className="academy-globe__title">Globe</h1>
        <button
          type="button"
          className="academy-globe__pause"
          onClick={() => setPaused((current) => !current)}
        >
          {paused || reduce ? 'Resume' : 'Pause'}
        </button>
      </div>
      <p className="academy-globe__intro">
        Package <code>cobe</code> 0.6.5. Licence MIT. Mechanism:{' '}
        <code>onRender</code> is the Phenomenon animation loop. It must set{' '}
        <code>state.phi</code> and add a step each frame, or the globe stays
        still. Docs <a href={COBE_DOCS}>{COBE_DOCS}</a>. Demo{' '}
        <a href={COBE_DEMO}>{COBE_DEMO}</a>. Source{' '}
        <a href={COBE_SOURCE}>{COBE_SOURCE}</a>. Types{' '}
        <a href={COBE_TYPES}>{COBE_TYPES}</a>. Extra runtime because Motion
        does not draw a 3D globe. Pause stops the <code>phi</code> step. A
        Replay control would remount a loop that never ends. Speed is the
        control for how fast it turns. Prior Academy use: Magic UI catalogue
        demo, static and crushed.
      </p>
      <p className="academy-globe__fixed">
        The canvas stays {GLOBE_SIZE} by {GLOBE_SIZE} pixels because cobe draws
        a square WebGL globe. The catalogue demo put a 600 canvas in a 320 by
        224 box. Markers at 0.08 need this size to read. Intended viewport 640
        pixels and above. <code>devicePixelRatio</code> stays 2,{' '}
        <code>scale</code> stays 1, and <code>offset</code> stays [0, 0] so the
        globe stays centred on that square.
      </p>
      <div className="academy-globe__layout">
        <div
          className="academy-globe__stage"
          data-testid="academy-globe-stage"
        >
          <canvas
            ref={canvasRef}
            className="academy-globe__canvas"
            width={GLOBE_SIZE * GLOBE_DPR}
            height={GLOBE_SIZE * GLOBE_DPR}
            role="img"
            tabIndex={-1}
            aria-label="WebGL globe with Australian Academy cities"
          />
        </div>
        <div>
          <p className="academy-globe__cities-title">Academy cities</p>
          <ul className="academy-globe__cities">
            {ACADEMY_CITIES.map((city) => (
              <li key={city.name} className="academy-globe__city">
                <span className="academy-globe__city-name">{city.name}</span>
                <span className="academy-globe__city-coord">
                  {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
