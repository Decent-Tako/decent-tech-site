import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFaultyTerminal from '../../vendor/backgrounds/faulty-terminal/FaultyTerminal';
import {
  FAULTY_TERMINAL_DEFAULTS,
  REACT_BITS_SOURCE,
  type FaultyTerminalGrid,
} from './source';

import './faulty-terminal.css';

export type FaultyTerminalProps = {
  scale?: number;
  gridMul?: FaultyTerminalGrid;
  digitSize?: number;
  timeScale?: number;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
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

const CARD = FEATURES[1];

export function FaultyTerminal({
  scale = FAULTY_TERMINAL_DEFAULTS.scale,
  gridMul = FAULTY_TERMINAL_DEFAULTS.gridMul,
  digitSize = FAULTY_TERMINAL_DEFAULTS.digitSize,
  timeScale = FAULTY_TERMINAL_DEFAULTS.timeScale,
  scanlineIntensity = FAULTY_TERMINAL_DEFAULTS.scanlineIntensity,
  glitchAmount = FAULTY_TERMINAL_DEFAULTS.glitchAmount,
  flickerAmount = FAULTY_TERMINAL_DEFAULTS.flickerAmount,
  noiseAmp = FAULTY_TERMINAL_DEFAULTS.noiseAmp,
  chromaticAberration = FAULTY_TERMINAL_DEFAULTS.chromaticAberration,
  dither = FAULTY_TERMINAL_DEFAULTS.dither,
  curvature = FAULTY_TERMINAL_DEFAULTS.curvature,
  tint = FAULTY_TERMINAL_DEFAULTS.tint,
  mouseReact = FAULTY_TERMINAL_DEFAULTS.mouseReact,
  mouseStrength = FAULTY_TERMINAL_DEFAULTS.mouseStrength,
  dpr = FAULTY_TERMINAL_DEFAULTS.dpr,
  pageLoadAnimation = FAULTY_TERMINAL_DEFAULTS.pageLoadAnimation,
  brightness = FAULTY_TERMINAL_DEFAULTS.brightness,
  lightMode = FAULTY_TERMINAL_DEFAULTS.lightMode,
  reducedMotion = FAULTY_TERMINAL_DEFAULTS.reducedMotion,
}: FaultyTerminalProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionTime = reduce ? 0 : timeScale;

  return (
    <ReactBitsFrame
      title="Faulty Terminal"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl CRT digit field. Time, glitch, flicker, scanlines, and curvature
              drive the noise. The pointer brightens nearby cells.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets timeScale to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, pause, onReady, onError, and HTML rest props are not controls. The frame Pause button owns pause. tint is brand paper #FFFFFF. dpr default is 1; upstream uses min(devicePixelRatio, 2). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="faulty-terminal-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionTime),
      }}
    >
      <div className="faulty-terminal-fill">
        <UpstreamFaultyTerminal
          key={run}
          scale={scale}
          gridMul={gridMul}
          digitSize={digitSize}
          timeScale={motionTime}
          pause={paused || reduce}
          scanlineIntensity={scanlineIntensity}
          glitchAmount={glitchAmount}
          flickerAmount={flickerAmount}
          noiseAmp={noiseAmp}
          chromaticAberration={chromaticAberration}
          dither={dither}
          curvature={curvature}
          tint={tint}
          mouseReact={mouseReact}
          mouseStrength={mouseStrength}
          dpr={dpr}
          pageLoadAnimation={pageLoadAnimation}
          brightness={brightness}
          lightMode={lightMode}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="faulty-terminal__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
