import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSwarmCursor from '../../vendor/animations/swarm-cursor/SwarmCursor';
import { REACT_BITS_SOURCE, SWARM_CURSOR_DEFAULTS } from './source';

import './swarm-cursor.css';

export type SwarmCursorProps = {
  color?: string;
  accentColor?: string;
  count?: number;
  size?: number;
  merge?: number;
  glow?: number;
  opacity?: number;
  spread?: number;
  separation?: number;
  speed?: number;
  wander?: number;
  trail?: number;
  scatterOnClick?: boolean;
  enabled?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[2];

function probeWebgl(): WebglState {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return 'unavailable';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return 'pending';
}

export function SwarmCursor({
  color = SWARM_CURSOR_DEFAULTS.color,
  accentColor = SWARM_CURSOR_DEFAULTS.accentColor,
  count = SWARM_CURSOR_DEFAULTS.count,
  size = SWARM_CURSOR_DEFAULTS.size,
  merge = SWARM_CURSOR_DEFAULTS.merge,
  glow = SWARM_CURSOR_DEFAULTS.glow,
  opacity = SWARM_CURSOR_DEFAULTS.opacity,
  spread = SWARM_CURSOR_DEFAULTS.spread,
  separation = SWARM_CURSOR_DEFAULTS.separation,
  speed = SWARM_CURSOR_DEFAULTS.speed,
  wander = SWARM_CURSOR_DEFAULTS.wander,
  trail = SWARM_CURSOR_DEFAULTS.trail,
  scatterOnClick = SWARM_CURSOR_DEFAULTS.scatterOnClick,
  enabled = SWARM_CURSOR_DEFAULTS.enabled,
  reducedMotion = SWARM_CURSOR_DEFAULTS.reducedMotion,
}: SwarmCursorProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Swarm Cursor"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              <code>count {count}</code> particles flock to the pointer with speed{' '}
              <code>{speed}</code>, spread <code>{spread}</code>, and separation{' '}
              <code>{separation}</code>. Each stamp is size <code>{size}</code> with trail{' '}
              <code>{trail}</code>. An ogl field buffer merges them at{' '}
              <code>merge {merge}</code> and a glow pass tints the core with brand paper
              and the halo with brand accent yellow. Click scatters them when{' '}
              <code>scatterOnClick</code> is on.
            </>
          }
          controls="Pause holds the physics step through the local paused prop. Replay remounts the swarm at the centre."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, children, and the rest HTML attributes are not controls. Pointer listeners live on the upstream container. With WebGL missing the frame shows the fallback paragraph and nothing mounts. Reduced motion mounts the sketch paused, so it paints one still frame. The canvas draws every frame while running, so the play function samples its pixels without preserveDrawingBuffer; the reduced-motion story asserts the ready state instead, because the buffer clears after the one still frame shows. Colour default is brand paper #FFFFFF (upstream #ffffff). Accent default is brand accent yellow #DEF54F (upstream #ffffff). The card is the Tools card from src/pages/content.ts."
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
      stageClassName="rb-frame__stage--ink swarm-cursor-stage"
      stageTestId="swarm-cursor-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-scatter': scatterOnClick ? 'true' : 'false',
      }}
    >
      <UpstreamSwarmCursor
        key={run}
        color={color}
        accentColor={accentColor}
        count={count}
        size={size}
        merge={merge}
        glow={glow}
        opacity={opacity}
        spread={spread}
        separation={separation}
        speed={speed}
        wander={wander}
        trail={trail}
        scatterOnClick={scatterOnClick}
        enabled={enabled}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
      >
        <div className="swarm-cursor-copy">
          <p>{CARD.kicker}</p>
          <p>{CARD.title}</p>
          <p>{CARD.copy}</p>
        </div>
      </UpstreamSwarmCursor>
    </ReactBitsFrame>
  );
}
