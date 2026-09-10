// Portfolio page cursor: fluid splats over the whole page. The host sits
// over the copy with pointer-events none, so the pointer is read from
// document and the links below still take the click.
import { useEffect, useRef } from 'react';

import {
  FluidSimulation,
  type FluidConfig,
  hexToRgb,
} from '../../motion-examples/splash-cursor/fluid';
import type { SceneProps } from '../scenes';
import { number, useSceneState } from '../sceneSupport';

const CONFIG: FluidConfig = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  CAPTURE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 2.5,
  VELOCITY_DISSIPATION: 1.6,
  PRESSURE: 0.1,
  PRESSURE_ITERATIONS: 20,
  CURL: 4,
  SPLAT_RADIUS: 0.25,
  SPLAT_FORCE: 6000,
  SHADING: true,
  COLOR_UPDATE_SPEED: 10,
  BACK_COLOR: { r: 0, g: 0, b: 0 },
  TRANSPARENT: true,
  RAINBOW_MODE: false,
  COLOR: '#ffcb73',
};

export default function SplashCursorScene({ host, dataset, onReady, onDone }: SceneProps) {
  const { paused, reduce } = useSceneState(host);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<FluidSimulation | null>(null);
  const pausedRef = useRef(paused);
  const reduceRef = useRef(reduce);
  const onReadyRef = useRef(onReady);
  const onDoneRef = useRef(onDone);
  const color = dataset.color ?? CONFIG.COLOR;
  const radius = number(dataset.radius, CONFIG.SPLAT_RADIUS);

  useEffect(() => {
    onReadyRef.current = onReady;
    onDoneRef.current = onDone;
  }, [onReady, onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sim = FluidSimulation.create(canvas, { ...CONFIG, COLOR: color, SPLAT_RADIUS: radius });
    simRef.current = sim;
    if (!sim) return;
    // One splat at the centre so the first frame has colour, then the loop
    // unless motion is reduced.
    sim.splat(0.5, 0.5, 0, 0, hexToRgb(color, { r: 1, g: 0.8, b: 0.45 }));
    sim.tick();
    onReadyRef.current();
    // A cursor has no entry animation: the first frame is the settled state.
    onDoneRef.current();
    if (!pausedRef.current) sim.start();
    return () => {
      sim.destroy();
      simRef.current = null;
    };
  }, [color, radius]);

  useEffect(() => {
    pausedRef.current = paused;
    reduceRef.current = reduce;
    const sim = simRef.current;
    if (!sim) return;
    if (paused) sim.stop();
    else sim.start();
  }, [paused, reduce]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const sim = simRef.current;
      const canvas = canvasRef.current;
      if (!sim || !canvas || pausedRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        sim.leavePointer();
        return;
      }
      sim.movePointer(x, y);
    };
    const leave = () => simRef.current?.leavePointer();
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <canvas ref={canvasRef} className="scene__canvas" aria-hidden="true" />;
}
