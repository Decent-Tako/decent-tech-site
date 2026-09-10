import { useEffect, useRef, useState } from 'react';

import { PointerFrame } from '../pointer/PointerFrame';
import { useReduce } from '../pointer/reduce';
import type { ReducedMotionMode } from '../pointer/source';
import { FluidSimulation, type FluidColor, type FluidConfig } from './fluid';
import { SPLASH_DEFAULTS, SPLASH_SOURCE, SPLASH_STAGE_HEIGHT } from './source';
import './splash-cursor.css';

export type SplashCursorProps = {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: FluidColor;
  TRANSPARENT?: boolean;
  RAINBOW_MODE?: boolean;
  COLOR?: string;
  reducedMotion?: ReducedMotionMode;
};

type WebglState = 'pending' | 'ready' | 'unavailable';

const REPLAY_SPLATS = 5;

export function SplashCursor({
  SIM_RESOLUTION = SPLASH_DEFAULTS.SIM_RESOLUTION,
  DYE_RESOLUTION = SPLASH_DEFAULTS.DYE_RESOLUTION,
  CAPTURE_RESOLUTION = SPLASH_DEFAULTS.CAPTURE_RESOLUTION,
  DENSITY_DISSIPATION = SPLASH_DEFAULTS.DENSITY_DISSIPATION,
  VELOCITY_DISSIPATION = SPLASH_DEFAULTS.VELOCITY_DISSIPATION,
  PRESSURE = SPLASH_DEFAULTS.PRESSURE,
  PRESSURE_ITERATIONS = SPLASH_DEFAULTS.PRESSURE_ITERATIONS,
  CURL = SPLASH_DEFAULTS.CURL,
  SPLAT_RADIUS = SPLASH_DEFAULTS.SPLAT_RADIUS,
  SPLAT_FORCE = SPLASH_DEFAULTS.SPLAT_FORCE,
  SHADING = SPLASH_DEFAULTS.SHADING,
  COLOR_UPDATE_SPEED = SPLASH_DEFAULTS.COLOR_UPDATE_SPEED,
  BACK_COLOR = SPLASH_DEFAULTS.BACK_COLOR,
  TRANSPARENT = SPLASH_DEFAULTS.TRANSPARENT,
  RAINBOW_MODE = SPLASH_DEFAULTS.RAINBOW_MODE,
  COLOR = SPLASH_DEFAULTS.COLOR,
  reducedMotion = SPLASH_DEFAULTS.reducedMotion,
}: SplashCursorProps) {
  const reduce = useReduce(reducedMotion);
  const [paused, setPaused] = useState(false);
  const [webgl, setWebgl] = useState<WebglState>('pending');

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<FluidSimulation | null>(null);
  const pausedRef = useRef(paused);
  const reduceRef = useRef(reduce);

  const config: FluidConfig = {
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
    RAINBOW_MODE,
    COLOR,
  };
  const initialConfig = useRef(config);

  // Create the simulation once the canvas is in the document.
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    stage.dataset.splats = '0';
    const sim = FluidSimulation.create(canvas, initialConfig.current, () => {
      stage.dataset.splats = String(sim?.splats ?? 0);
    });
    simRef.current = sim;
    setWebgl(sim ? 'ready' : 'unavailable');
    if (!sim) return;

    if (reduceRef.current) {
      // Reduced motion: one still splat at the centre, no frame loop.
      sim.splat(0.5, 0.5, 0, 0, hexToStill(initialConfig.current));
      sim.tick();
    } else if (!pausedRef.current) {
      sim.start();
    }

    return () => {
      sim.destroy();
      simRef.current = null;
    };
  }, []);

  // Pointer input goes to the stage element, not the window.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleMove = (event: PointerEvent) => {
      if (pausedRef.current) return;
      const sim = simRef.current;
      if (!sim) return;
      const rect = stage.getBoundingClientRect();
      sim.movePointer(event.clientX - rect.left, event.clientY - rect.top);
      if (reduceRef.current) sim.tick();
    };
    const handleLeave = () => {
      simRef.current?.leavePointer();
    };

    stage.addEventListener('pointermove', handleMove);
    stage.addEventListener('pointerleave', handleLeave);
    return () => {
      stage.removeEventListener('pointermove', handleMove);
      stage.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  // Pause and reduced motion stop the frame loop.
  useEffect(() => {
    pausedRef.current = paused;
    reduceRef.current = reduce;
    const sim = simRef.current;
    if (!sim) return;
    if (paused || reduce) sim.stop();
    else sim.start();
  }, [paused, reduce, webgl]);

  // Controls change the live simulation.
  useEffect(() => {
    simRef.current?.setConfig({
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      BACK_COLOR: { r: BACK_COLOR.r, g: BACK_COLOR.g, b: BACK_COLOR.b },
      TRANSPARENT,
      RAINBOW_MODE,
      COLOR,
    });
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR.r,
    BACK_COLOR.g,
    BACK_COLOR.b,
    TRANSPARENT,
    RAINBOW_MODE,
    COLOR,
  ]);

  const replay = () => {
    const sim = simRef.current;
    if (!sim) return;
    sim.reset();
    sim.burst(REPLAY_SPLATS);
    if (pausedRef.current || reduceRef.current) sim.tick();
  };

  const { origin, reference } = SPLASH_SOURCE;

  return (
    <PointerFrame
      title="Splash cursor"
      attribution={
        <>
          Rebuilt from Pavel Dobryakov&apos;s{' '}
          <a href={origin.repo}>{origin.name}</a> ({origin.licence},{' '}
          {origin.version}). Props follow{' '}
          <a href={reference.page}>{reference.name}</a> ({reference.licence},
          reference only). Mechanism: Navier-Stokes advection, curl, and
          pressure passes on framebuffer textures, splatted at the pointer.
          Origin file <a href={origin.file}>{origin.file}</a>. Reference file{' '}
          <a href={reference.file}>{reference.file}</a>. No extra runtime:
          WebGL only. Continuous. Pause stops the frame loop. Replay clears the
          field and fires {REPLAY_SPLATS} splats.
        </>
      }
      fixedNote={`The stage is ${SPLASH_STAGE_HEIGHT} pixels tall and the canvas fills it. The origin draws full-screen; here the canvas is absolute inside the stage, never fixed. Bloom, sunrays, and screenshot capture from the origin are not ported. CAPTURE_RESOLUTION is kept for prop parity and has no effect.`}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={replay}
      reducedMotion={reducedMotion}
      stageClassName="splash-cursor__stage"
      stageTestId="splash-stage"
      stageRef={stageRef}
      stageData={{
        'data-webgl': webgl,
        'data-paused': paused ? 'true' : 'false',
        'data-reduced': reduce ? 'true' : 'false',
      }}
    >
      <canvas
        ref={canvasRef}
        className="splash-cursor__canvas"
        role="img"
        aria-label="Fluid splash that follows the pointer"
      />
      {webgl === 'unavailable' ? (
        <p className="splash-cursor__fallback" data-webgl="unavailable">
          WebGL is not available here, so the fluid cannot render. The
          simulation needs a WebGL context with half-float render targets.
        </p>
      ) : null}
      {webgl === 'ready' ? (
        <p className="splash-cursor__hint" aria-hidden="true">
          Move the pointer over the stage.
        </p>
      ) : null}
    </PointerFrame>
  );
}

/** Colour for the single still splat under reduced motion. */
function hexToStill(config: FluidConfig): FluidColor {
  const raw = config.COLOR.trim().replace('#', '');
  const n = /^[0-9a-fA-F]{6}$/.test(raw) ? Number.parseInt(raw, 16) : 0x0035b1;
  return {
    r: (((n >> 16) & 255) / 255) * 0.6,
    g: (((n >> 8) & 255) / 255) * 0.6,
    b: ((n & 255) / 255) * 0.6,
  };
}
