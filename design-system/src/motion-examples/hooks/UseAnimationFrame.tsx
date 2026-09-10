import { useAnimationFrame, useReducedMotion } from 'motion/react';
import { useRef, useState, type CSSProperties } from 'react';

import { CUBE_FACES, USE_ANIMATION_FRAME_DEFAULTS } from './defaults';
import { HookFrame } from './Frame';
import {
  HOOK_EXAMPLES,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type UseAnimationFrameProps = {
  speed?: number;
  rotatePeriod?: number;
  bouncePeriod?: number;
  rotateAmplitude?: number;
  bounceAmplitude?: number;
  size?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function CubeRun({
  speed,
  rotatePeriod,
  bouncePeriod,
  rotateAmplitude,
  bounceAmplitude,
  size,
  caption,
  running,
}: {
  speed: number;
  rotatePeriod: number;
  bouncePeriod: number;
  rotateAmplitude: number;
  bounceAmplitude: number;
  size: number;
  caption: string;
  running: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pauseOffset = useRef(0);
  const pauseStart = useRef<number | null>(null);

  useAnimationFrame((t) => {
    const node = ref.current;
    if (!node) return;

    if (!running) {
      if (pauseStart.current == null) pauseStart.current = t;
      return;
    }

    if (pauseStart.current != null) {
      pauseOffset.current += t - pauseStart.current;
      pauseStart.current = null;
    }

    const local = (t - pauseOffset.current) * speed;
    const rotate = Math.sin(local / rotatePeriod) * rotateAmplitude;
    const y = (1 + Math.sin(local / bouncePeriod)) * -bounceAmplitude;
    node.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
    node.dataset.rotate = rotate.toFixed(1);
    node.dataset.y = y.toFixed(1);
  });

  return (
    <div
      className="hk-cube"
      style={{ '--hk-cube-size': `${size}px` } as CSSProperties}
    >
      <div
        ref={ref}
        className="hk-cube__body"
        role="img"
        aria-label={caption}
        data-rotate="0.0"
        data-y="0.0"
      >
        {CUBE_FACES.map((face) => (
          <div
            key={face.id}
            className={`hk-cube__face hk-cube__face--${face.id}`}
          >
            <p className="hk-cube__kicker">{face.kicker}</p>
            <p className="hk-cube__copy">{face.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UseAnimationFrame({
  speed = USE_ANIMATION_FRAME_DEFAULTS.speed,
  rotatePeriod = USE_ANIMATION_FRAME_DEFAULTS.rotatePeriod,
  bouncePeriod = USE_ANIMATION_FRAME_DEFAULTS.bouncePeriod,
  rotateAmplitude = USE_ANIMATION_FRAME_DEFAULTS.rotateAmplitude,
  bounceAmplitude = USE_ANIMATION_FRAME_DEFAULTS.bounceAmplitude,
  size = USE_ANIMATION_FRAME_DEFAULTS.size,
  caption = USE_ANIMATION_FRAME_DEFAULTS.caption,
  paused: pausedProp = USE_ANIMATION_FRAME_DEFAULTS.paused,
  reducedMotion = USE_ANIMATION_FRAME_DEFAULTS.reducedMotion,
  replayNonce = USE_ANIMATION_FRAME_DEFAULTS.replayNonce,
}: UseAnimationFrameProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }

  const running = !paused && !reduce;
  const example = HOOK_EXAMPLES.useAnimationFrame;

  return (
    <HookFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The cube stays 200 by 200 pixels at the upstream default so the six Academy week faces stay legible. perspective 800px and translateZ of half the size stay fixed because they are the 3D geometry. Face opacity is 1 so Brand Sans labels meet contrast. Upstream used 0.6. This loop is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="hk-use-animation-frame"
      running={running}
      runId={replayNonce}
      stageClass="hk__stage--cube"
    >
      <CubeRun
        key={`${replayNonce}-${rotatePeriod}-${bouncePeriod}-${size}`}
        speed={speed}
        rotatePeriod={rotatePeriod}
        bouncePeriod={bouncePeriod}
        rotateAmplitude={rotateAmplitude}
        bounceAmplitude={bounceAmplitude}
        size={size}
        caption={caption}
        running={running}
      />
      <p className="hk__caption">{caption}</p>
    </HookFrame>
  );
}
