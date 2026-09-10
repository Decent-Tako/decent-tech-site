import { cancelFrame, frame, type FrameData } from 'motion';
import {
  animate,
  clamp,
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
  type Transition,
} from 'motion/react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

import { usePointerPosition } from '../pointer/usePointerPosition';
import { ListsFrame } from './Frame';
import {
  BOBBLE_HOVER_DEFAULTS,
  BOBBLE_TILES,
  EXAMPLES,
  MOTION_RUNTIME,
  PLUS_ADAPTER,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type BobbleHoverProps = {
  gridSize?: number;
  offsetFactor?: number;
  scaleFactor?: number;
  stretchFactor?: number;
  rotateFactor?: number;
  maxSpeed?: number;
  stiffness?: number;
  damping?: number;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function slab(
  start: number,
  delta: number,
  lowEdge: number,
  highEdge: number,
  span: { t0: number; t1: number },
): boolean {
  if (delta === 0) {
    return start >= lowEdge && start <= highEdge;
  }
  let enter = (lowEdge - start) / delta;
  let exit = (highEdge - start) / delta;
  if (enter > exit) {
    const tmp = enter;
    enter = exit;
    exit = tmp;
  }
  if (enter > span.t0) span.t0 = enter;
  if (exit < span.t1) span.t1 = exit;
  return span.t0 <= span.t1;
}

function checkLineHit(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  rect: DOMRect,
) {
  const span = { t0: 0, t1: 1 };
  if (!slab(x0, x1 - x0, rect.left, rect.right, span)) return null;
  if (!slab(y0, y1 - y0, rect.top, rect.bottom, span)) return null;
  return span.t0;
}

function useCollisionDetection<T extends HTMLElement>(
  ref: RefObject<T | null>,
  x: MotionValue<number>,
  y: MotionValue<number>,
  onHit: (delta: number, vx: number, vy: number) => void,
  enabled: boolean,
) {
  const onHitRef = useRef(onHit);
  useLayoutEffect(() => {
    onHitRef.current = onHit;
  });

  useEffect(() => {
    if (!enabled) return undefined;
    let rect: DOMRect | null = null;
    let wasHit = false;
    let lastX: number | undefined;
    let lastY: number | undefined;

    function measureElement() {
      const el = ref.current;
      if (!el) return;
      rect = el.getBoundingClientRect();
      frame.preRender(detect);
    }

    function detect({ delta: frameDelta }: FrameData) {
      if (!rect) return;
      const cx = x.get();
      const cy = y.get();
      if (cx === lastX && cy === lastY) return;
      lastX = cx;
      lastY = cy;
      const px = x.getPrevious() ?? cx;
      const py = y.getPrevious() ?? cy;
      const entry = checkLineHit(px, py, cx, cy, rect);
      if (entry !== null) {
        if (!wasHit) {
          const seconds = frameDelta / 1000;
          const vx = seconds > 0 ? (cx - px) / seconds : 0;
          const vy = seconds > 0 ? (cy - py) / seconds : 0;
          onHitRef.current(frameDelta * (1 - entry), vx, vy);
        }
        wasHit = true;
      } else {
        wasHit = false;
      }
    }

    frame.read(measureElement, true);

    return () => {
      cancelFrame(measureElement);
      cancelFrame(detect);
    };
  }, [ref, x, y, enabled]);
}

function useTouchPointer(x: MotionValue<number>, y: MotionValue<number>) {
  useEffect(() => {
    let nextX = 0;
    let nextY = 0;
    const flush = () => {
      x.set(nextX);
      y.set(nextY);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      nextX = event.clientX;
      nextY = event.clientY;
      frame.update(flush);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      x.jump(event.clientX);
      y.jump(event.clientY);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      cancelFrame(flush);
    };
  }, [x, y]);
}

function useMouseReentry(x: MotionValue<number>, y: MotionValue<number>) {
  useEffect(() => {
    let needsReset = true;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !needsReset) return;
      x.jump(event.clientX);
      y.jump(event.clientY);
      needsReset = false;
    };
    const onOut = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && !event.relatedTarget) {
        needsReset = true;
      }
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerout', onOut);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
    };
  }, [x, y]);
}

function Tile({
  index,
  pointerX,
  pointerY,
  spring,
  offsetFactor,
  scaleFactor,
  stretchFactor,
  rotateFactor,
  maxSpeed,
  enabled,
}: {
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  spring: Transition;
  offsetFactor: number;
  scaleFactor: number;
  stretchFactor: number;
  rotateFactor: number;
  maxSpeed: number;
  enabled: boolean;
}) {
  const tile = BOBBLE_TILES[index % BOBBLE_TILES.length];
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const originX = useMotionValue(0.5);
  const originY = useMotionValue(0.5);

  function bobble(delta: number, rawVx: number, rawVy: number) {
    const vx = clamp(-maxSpeed, maxSpeed, rawVx);
    const vy = clamp(-maxSpeed, maxSpeed, rawVy);
    const speed = Math.min(Math.hypot(vx, vy), maxSpeed);
    originX.set(0.5 + (0.5 * vx) / maxSpeed);
    originY.set(0.5 + (0.5 * vy) / maxSpeed);
    const pop = speed * scaleFactor;
    const stretch = (Math.abs(vx) - Math.abs(vy)) * stretchFactor;
    const delay = -delta / 1000;
    animate(x, 0, { ...spring, velocity: vx * offsetFactor, delay });
    animate(y, 0, { ...spring, velocity: vy * offsetFactor, delay });
    animate(rotate, 0, { ...spring, velocity: vx * rotateFactor, delay });
    animate(scaleX, 1, { ...spring, velocity: pop + stretch, delay });
    animate(scaleY, 1, { ...spring, velocity: pop - stretch, delay });
  }

  useCollisionDetection(ref, pointerX, pointerY, bobble, enabled);

  return (
    <motion.div
      ref={ref}
      className="lists-bobble__tile"
      style={{ x, y, rotate, scaleX, scaleY, originX, originY }}
    >
      <img src={tile.photo.src} alt={tile.photo.alt} data-photo="true" />
      <span className="lists-bobble__label">{tile.label}</span>
    </motion.div>
  );
}

export function BobbleHover({
  gridSize = BOBBLE_HOVER_DEFAULTS.gridSize,
  offsetFactor = BOBBLE_HOVER_DEFAULTS.offsetFactor,
  scaleFactor = BOBBLE_HOVER_DEFAULTS.scaleFactor,
  stretchFactor = BOBBLE_HOVER_DEFAULTS.stretchFactor,
  rotateFactor = BOBBLE_HOVER_DEFAULTS.rotateFactor,
  maxSpeed = BOBBLE_HOVER_DEFAULTS.maxSpeed,
  stiffness = BOBBLE_HOVER_DEFAULTS.stiffness,
  damping = BOBBLE_HOVER_DEFAULTS.damping,
  paused: pausedProp = BOBBLE_HOVER_DEFAULTS.paused,
  reducedMotion = BOBBLE_HOVER_DEFAULTS.reducedMotion,
}: BobbleHoverProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }
  const pointer = usePointerPosition();
  useTouchPointer(pointer.x, pointer.y);
  useMouseReentry(pointer.x, pointer.y);
  const running = !paused && !reduce;
  const spring: Transition = { type: 'spring', stiffness, damping };
  const size = Math.max(1, Math.round(gridSize));
  const tiles = size * size;

  return (
    <ListsFrame
      title="Bobble hover"
      mechanism={
        <>
          <code>usePointerPosition</code> writes pointer <code>x</code>/
          <code>y</code>. Each tile runs <code>frame.read</code> then{' '}
          <code>frame.preRender</code> and clips the pointer segment against
          its rect. A hit calls <code>animate()</code> on <code>x</code>,{' '}
          <code>y</code>, <code>rotate</code>, <code>scaleX</code>, and{' '}
          <code>scaleY</code> with rest 0/1 and injected velocity, plus a
          negative delay so the wave follows a fast swipe.
        </>
      }
      docs={MOTION_RUNTIME.docsMotionValue}
      example={EXAMPLES.bobbleHover.page}
      live={EXAMPLES.bobbleHover.live}
      chunk={EXAMPLES.bobbleHover.chunk}
      extraRuntime={
        <>
          Extra runtime {PLUS_ADAPTER.name}. {PLUS_ADAPTER.unpackedKb} KB.{' '}
          {PLUS_ADAPTER.why} The article page is Motion+ and prints a stub. The
          live chunk publishes the full source. Pointer/Magnetic filings uses
          the same adapter.
        </>
      }
      priorNote="Pointer/Magnetic filings and Cursor floating target already use the Academy plusAdapter for usePointerPosition."
      fixedNote="Each tile is clamp(88px, 12vw, 136px) so the Week 0 photograph and label stay legible. visualiseOrigin stays out of Controls because upstream marks it debug-only. This loop is continuous, so Pause freezes collision. Replay remounts the springs."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      onReplay={() => setRunId((value) => value + 1)}
      reducedMotion={reducedMotion}
      testId="bobble-hover"
      running={running}
      runId={runId}
    >
      <div className="lists-example__stage lists-example__stage--tall">
        <div className="lists-bobble">
          <div
            key={runId}
            className="lists-bobble__grid"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {Array.from({ length: tiles }, (_, index) => (
              <Tile
                key={`${runId}-${index}`}
                index={index}
                pointerX={pointer.x}
                pointerY={pointer.y}
                spring={spring}
                offsetFactor={offsetFactor}
                scaleFactor={scaleFactor}
                stretchFactor={stretchFactor}
                rotateFactor={rotateFactor}
                maxSpeed={maxSpeed}
                enabled={running}
              />
            ))}
          </div>
        </div>
      </div>
    </ListsFrame>
  );
}
