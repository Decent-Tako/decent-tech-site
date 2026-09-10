import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamWaves from '../../vendor/backgrounds/waves/Waves';
import { REACT_BITS_SOURCE, WAVES_DEFAULTS } from './source';

import './waves.css';

export type WavesProps = {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[4];

export function Waves({
  lineColor = WAVES_DEFAULTS.lineColor,
  backgroundColor = WAVES_DEFAULTS.backgroundColor,
  waveSpeedX = WAVES_DEFAULTS.waveSpeedX,
  waveSpeedY = WAVES_DEFAULTS.waveSpeedY,
  waveAmpX = WAVES_DEFAULTS.waveAmpX,
  waveAmpY = WAVES_DEFAULTS.waveAmpY,
  xGap = WAVES_DEFAULTS.xGap,
  yGap = WAVES_DEFAULTS.yGap,
  friction = WAVES_DEFAULTS.friction,
  tension = WAVES_DEFAULTS.tension,
  maxCursorMove = WAVES_DEFAULTS.maxCursorMove,
  reducedMotion = WAVES_DEFAULTS.reducedMotion,
}: WavesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const reduce = useReduce(reducedMotion);
  const motionSpeedX = reduce ? 0 : waveSpeedX;
  const motionSpeedY = reduce ? 0 : waveSpeedY;

  return (
    <ReactBitsFrame
      title="Waves"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2d canvas of Perlin-noise lines. Speed {waveSpeedX} / {waveSpeedY}{' '}
              and amplitude {waveAmpX} / {waveAmpY} drift the grid. The pointer
              pulls nearby points.
            </>
          }
          controls="Pause holds the line clock after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, className, and style are not controls. lineColor default is brand ink #212121 (upstream black). backgroundColor is brand paper #FFFFFF (upstream transparent). Pointer listeners bind to the container, not window. The caption is the Street card from src/pages/content.ts. This sketch is a 2d canvas, so there is no WebGL fallback."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setReady(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="waves-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-ready': ready ? 'true' : 'false',
        'data-speed': String(motionSpeedX),
      }}
    >
      <div className="waves-fill">
        <UpstreamWaves
          key={run}
          lineColor={lineColor}
          backgroundColor={backgroundColor}
          waveSpeedX={motionSpeedX}
          waveSpeedY={motionSpeedY}
          waveAmpX={waveAmpX}
          waveAmpY={waveAmpY}
          xGap={xGap}
          yGap={yGap}
          friction={friction}
          tension={tension}
          maxCursorMove={maxCursorMove}
          paused={paused || reduce}
          onReady={() => setReady(true)}
        />
      </div>
      <p className="waves__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
