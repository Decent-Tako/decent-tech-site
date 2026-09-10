import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamThreads from '../../vendor/backgrounds/threads/Threads';
import { REACT_BITS_SOURCE, THREADS_DEFAULTS } from './source';

import './threads.css';

export type ThreadsProps = {
  color?: [number, number, number];
  amplitude?: number;
  distance?: number;
  enableMouseInteraction?: boolean;
  reducedMotion?: ReducedMotionMode;
};

// Probe once, before anything mounts. The ogl Renderer throws when the
// browser has no WebGL context.
function probeWebgl(): WebglState {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return 'unavailable';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return 'pending';
}

export function Threads({
  color = THREADS_DEFAULTS.color,
  amplitude = THREADS_DEFAULTS.amplitude,
  distance = THREADS_DEFAULTS.distance,
  enableMouseInteraction = THREADS_DEFAULTS.enableMouseInteraction,
  reducedMotion = THREADS_DEFAULTS.reducedMotion,
}: ThreadsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Threads"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              One fragment shader draws forty lines, each displaced by two octaves of Perlin
              noise scaled by <code>amplitude {amplitude}</code> and spread by{' '}
              <code>distance {distance}</code>. With <code>enableMouseInteraction</code> the
              pointer position eases into the noise offset at 5 percent per frame.
            </>
          }
          controls="Pause stops the render through the local paused prop. Replay remounts the upstream component, so time starts at zero."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The colour is an RGB triple in 0..1, as upstream. With WebGL missing the frame shows the fallback paragraph and nothing mounts. Reduced motion mounts the sketch paused, so it draws one still frame. The canvas draws every frame while running, so the play function samples its pixels without preserveDrawingBuffer; the reduced-motion story asserts the ready state instead, because the buffer clears after the one still frame shows."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl((state) => (state === 'unavailable' ? state : 'pending'));
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink threads__stage"
      stageTestId="threads-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <div className="threads__fill">
        <UpstreamThreads
          key={run}
          color={color}
          amplitude={amplitude}
          distance={distance}
          enableMouseInteraction={enableMouseInteraction}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
        />
      </div>
      <p className="threads__caption">{HERO.kicker}</p>
    </ReactBitsFrame>
  );
}
