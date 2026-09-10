import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMetaBalls from '../../vendor/animations/meta-balls/MetaBalls';
import { META_BALLS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './meta-balls.css';

export type MetaBallsProps = {
  color?: (typeof META_BALLS_DEFAULTS)['color'];
  speed?: (typeof META_BALLS_DEFAULTS)['speed'];
  enableMouseInteraction?: (typeof META_BALLS_DEFAULTS)['enableMouseInteraction'];
  hoverSmoothness?: (typeof META_BALLS_DEFAULTS)['hoverSmoothness'];
  animationSize?: (typeof META_BALLS_DEFAULTS)['animationSize'];
  ballCount?: (typeof META_BALLS_DEFAULTS)['ballCount'];
  clumpFactor?: (typeof META_BALLS_DEFAULTS)['clumpFactor'];
  cursorBallSize?: (typeof META_BALLS_DEFAULTS)['cursorBallSize'];
  cursorBallColor?: (typeof META_BALLS_DEFAULTS)['cursorBallColor'];
  enableTransparency?: (typeof META_BALLS_DEFAULTS)['enableTransparency'];
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl2(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[0];

export function MetaBalls({
  color = META_BALLS_DEFAULTS.color,
  speed = META_BALLS_DEFAULTS.speed,
  enableMouseInteraction = META_BALLS_DEFAULTS.enableMouseInteraction,
  hoverSmoothness = META_BALLS_DEFAULTS.hoverSmoothness,
  animationSize = META_BALLS_DEFAULTS.animationSize,
  ballCount = META_BALLS_DEFAULTS.ballCount,
  clumpFactor = META_BALLS_DEFAULTS.clumpFactor,
  cursorBallSize = META_BALLS_DEFAULTS.cursorBallSize,
  cursorBallColor = META_BALLS_DEFAULTS.cursorBallColor,
  enableTransparency = META_BALLS_DEFAULTS.enableTransparency,
  reducedMotion = META_BALLS_DEFAULTS.reducedMotion,
}: MetaBallsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Meta Balls"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 shader sums <code>{ballCount}</code> orbiting
              spheres and a cursor ball of size <code>{cursorBallSize}</code>.
              Colour is brand paper. Speed is <code>{speed}</code>.
            </>
          }
          controls="Pause holds the clock and keeps the last frame. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onUnavailable are local. preserveDrawingBuffer is on so the play can read pixels. The caption is the Week 0 card from src/pages/content.ts. Colour defaults are brand paper #FFFFFF (upstream #ffffff)."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeWebgl2());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink meta-balls-stage"
      stageTestId="meta-balls-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <UpstreamMetaBalls
        key={run}
        color={color}
        speed={reduce ? 0 : speed}
        enableMouseInteraction={reduce ? false : enableMouseInteraction}
        hoverSmoothness={hoverSmoothness}
        animationSize={animationSize}
        ballCount={ballCount}
        clumpFactor={clumpFactor}
        cursorBallSize={cursorBallSize}
        cursorBallColor={cursorBallColor}
        enableTransparency={enableTransparency}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onUnavailable={() => setWebgl('unavailable')}
      />
      <p className="meta-balls-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
