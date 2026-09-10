import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLineWaves from '../../vendor/backgrounds/line-waves/LineWaves';
import { LINE_WAVES_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './line-waves.css';

export type LineWavesProps = {
  speed?: number;
  innerLineCount?: number;
  outerLineCount?: number;
  warpIntensity?: number;
  rotation?: number;
  edgeFadeWidth?: number;
  colorCycleSpeed?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
  lightMode?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[4];

export function LineWaves({
  speed = LINE_WAVES_DEFAULTS.speed,
  innerLineCount = LINE_WAVES_DEFAULTS.innerLineCount,
  outerLineCount = LINE_WAVES_DEFAULTS.outerLineCount,
  warpIntensity = LINE_WAVES_DEFAULTS.warpIntensity,
  rotation = LINE_WAVES_DEFAULTS.rotation,
  edgeFadeWidth = LINE_WAVES_DEFAULTS.edgeFadeWidth,
  colorCycleSpeed = LINE_WAVES_DEFAULTS.colorCycleSpeed,
  brightness = LINE_WAVES_DEFAULTS.brightness,
  color1 = LINE_WAVES_DEFAULTS.color1,
  color2 = LINE_WAVES_DEFAULTS.color2,
  color3 = LINE_WAVES_DEFAULTS.color3,
  enableMouseInteraction = LINE_WAVES_DEFAULTS.enableMouseInteraction,
  mouseInfluence = LINE_WAVES_DEFAULTS.mouseInfluence,
  lightMode = LINE_WAVES_DEFAULTS.lightMode,
  reducedMotion = LINE_WAVES_DEFAULTS.reducedMotion,
}: LineWavesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Line Waves"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl full-screen triangle. Two displacement fields warp a
              ridge line pattern. Time cycles the three colours. The pointer
              adds a local warp.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour defaults are brand tokens: color1 paper #FFFFFF, color2 accent-blue #0035B1, color3 accent-yellow #DEF54F (upstream all #ffffff). The caption is the Street card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeWebgl());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="line-waves-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="line-waves-fill">
        <UpstreamLineWaves
          key={run}
          speed={motionSpeed}
          innerLineCount={innerLineCount}
          outerLineCount={outerLineCount}
          warpIntensity={warpIntensity}
          rotation={rotation}
          edgeFadeWidth={edgeFadeWidth}
          colorCycleSpeed={colorCycleSpeed}
          brightness={brightness}
          color1={color1}
          color2={color2}
          color3={color3}
          enableMouseInteraction={enableMouseInteraction}
          mouseInfluence={mouseInfluence}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="line-waves__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
