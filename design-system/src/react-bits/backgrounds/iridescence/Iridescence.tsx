import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamIridescence from '../../vendor/backgrounds/iridescence/Iridescence';
import { IRIDESCENCE_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './iridescence.css';

export type IridescenceProps = {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
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

export function Iridescence({
  color = IRIDESCENCE_DEFAULTS.color,
  speed = IRIDESCENCE_DEFAULTS.speed,
  amplitude = IRIDESCENCE_DEFAULTS.amplitude,
  mouseReact = IRIDESCENCE_DEFAULTS.mouseReact,
  reducedMotion = IRIDESCENCE_DEFAULTS.reducedMotion,
}: IridescenceProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Iridescence"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              One fragment shader folds the pixel position through eight sine and cosine
              passes at <code>speed {speed}</code>, then maps the result through a cosine
              palette multiplied by <code>color</code>. With <code>mouseReact</code> the pointer
              shifts the fold by <code>amplitude {amplitude}</code>.
            </>
          }
          controls="Pause skips the render through the local paused prop. Replay remounts the upstream component, so time starts at zero."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The colour is an RGB triple in 0..1, as upstream. With WebGL missing the frame shows the fallback paragraph and nothing mounts. Reduced motion mounts the sketch paused, so it draws one still frame. The canvas draws every frame, so the play function samples its pixels without preserveDrawingBuffer."
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
      stageClassName="rb-frame__stage--ink iridescence__stage"
      stageTestId="iridescence-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <div className="iridescence__fill">
        <UpstreamIridescence
          key={run}
          color={color}
          speed={speed}
          amplitude={amplitude}
          mouseReact={mouseReact}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
        />
      </div>
      <p className="iridescence__caption">{HERO.kicker}</p>
    </ReactBitsFrame>
  );
}
