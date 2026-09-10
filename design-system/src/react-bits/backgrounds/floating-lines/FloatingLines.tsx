import { useState, type CSSProperties } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFloatingLines from '../../vendor/backgrounds/floating-lines/FloatingLines';
import {
  FLOATING_LINES_DEFAULTS,
  REACT_BITS_SOURCE,
  type WaveName,
  type WavePosition,
} from './source';

import './floating-lines.css';

export type FloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: WaveName[];
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: CSSProperties['mixBlendMode'];
  backgroundColor?: string;
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

export function FloatingLines({
  linesGradient = FLOATING_LINES_DEFAULTS.linesGradient,
  enabledWaves = FLOATING_LINES_DEFAULTS.enabledWaves,
  lineCount = FLOATING_LINES_DEFAULTS.lineCount,
  lineDistance = FLOATING_LINES_DEFAULTS.lineDistance,
  topWavePosition = FLOATING_LINES_DEFAULTS.topWavePosition,
  middleWavePosition = FLOATING_LINES_DEFAULTS.middleWavePosition,
  bottomWavePosition = FLOATING_LINES_DEFAULTS.bottomWavePosition,
  animationSpeed = FLOATING_LINES_DEFAULTS.animationSpeed,
  interactive = FLOATING_LINES_DEFAULTS.interactive,
  bendRadius = FLOATING_LINES_DEFAULTS.bendRadius,
  bendStrength = FLOATING_LINES_DEFAULTS.bendStrength,
  mouseDamping = FLOATING_LINES_DEFAULTS.mouseDamping,
  parallax = FLOATING_LINES_DEFAULTS.parallax,
  parallaxStrength = FLOATING_LINES_DEFAULTS.parallaxStrength,
  mixBlendMode = FLOATING_LINES_DEFAULTS.mixBlendMode,
  backgroundColor = FLOATING_LINES_DEFAULTS.backgroundColor,
  lightMode = FLOATING_LINES_DEFAULTS.lightMode,
  reducedMotion = FLOATING_LINES_DEFAULTS.reducedMotion,
}: FloatingLinesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : animationSpeed;

  return (
    <ReactBitsFrame
      title="Floating Lines"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js full-screen plane. Three sine-wave bands bend toward the
              pointer and shift with parallax.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets animationSpeed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour defaults are brand tokens: linesGradient accent-blue #0035B1 and accent-yellow #DEF54F (upstream used a hardcoded pink and blue when linesGradient was empty), backgroundColor ink #212121 (upstream #000000). The caption is the Learn card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="floating-lines-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="floating-lines-fill">
        <UpstreamFloatingLines
          key={run}
          linesGradient={linesGradient}
          enabledWaves={enabledWaves}
          lineCount={lineCount}
          lineDistance={lineDistance}
          topWavePosition={topWavePosition}
          middleWavePosition={middleWavePosition}
          bottomWavePosition={bottomWavePosition}
          animationSpeed={motionSpeed}
          interactive={interactive}
          bendRadius={bendRadius}
          bendStrength={bendStrength}
          mouseDamping={mouseDamping}
          parallax={parallax}
          parallaxStrength={parallaxStrength}
          mixBlendMode={mixBlendMode}
          backgroundColor={backgroundColor}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="floating-lines__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
