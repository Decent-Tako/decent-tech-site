import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLiquidEther from '../../vendor/backgrounds/liquid-ether/LiquidEther';
import { LIQUID_ETHER_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './liquid-ether.css';

export type LiquidEtherProps = {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
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

const CARD = FEATURES[2];

export function LiquidEther({
  mouseForce = LIQUID_ETHER_DEFAULTS.mouseForce,
  cursorSize = LIQUID_ETHER_DEFAULTS.cursorSize,
  isViscous = LIQUID_ETHER_DEFAULTS.isViscous,
  viscous = LIQUID_ETHER_DEFAULTS.viscous,
  iterationsViscous = LIQUID_ETHER_DEFAULTS.iterationsViscous,
  iterationsPoisson = LIQUID_ETHER_DEFAULTS.iterationsPoisson,
  dt = LIQUID_ETHER_DEFAULTS.dt,
  BFECC = LIQUID_ETHER_DEFAULTS.BFECC,
  resolution = LIQUID_ETHER_DEFAULTS.resolution,
  isBounce = LIQUID_ETHER_DEFAULTS.isBounce,
  colors = LIQUID_ETHER_DEFAULTS.colors,
  autoDemo = LIQUID_ETHER_DEFAULTS.autoDemo,
  autoSpeed = LIQUID_ETHER_DEFAULTS.autoSpeed,
  autoIntensity = LIQUID_ETHER_DEFAULTS.autoIntensity,
  takeoverDuration = LIQUID_ETHER_DEFAULTS.takeoverDuration,
  autoResumeDelay = LIQUID_ETHER_DEFAULTS.autoResumeDelay,
  autoRampDuration = LIQUID_ETHER_DEFAULTS.autoRampDuration,
  backgroundColor = LIQUID_ETHER_DEFAULTS.backgroundColor,
  lightMode = LIQUID_ETHER_DEFAULTS.lightMode,
  reducedMotion = LIQUID_ETHER_DEFAULTS.reducedMotion,
}: LiquidEtherProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : autoSpeed;

  return (
    <ReactBitsFrame
      title="Liquid Ether"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js ping-pong fluid sim. Velocity advects through FBOs,
              then a palette maps speed to colour. Auto-demo walks a virtual
              pointer when the user is idle.
            </>
          }
          controls="Pause holds the sim after the first frame. Replay remounts the sketch. Reduced motion sets autoSpeed to 0 and holds the sim."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, style, paused, onReady, and onError are not controls. Colour defaults are brand tokens: #0035B1, #DEF54F, #FFFFFF (upstream #5227FF, #FF9FFC, #B497CF). backgroundColor is unused in the sketch; upstream hard-codes a transparent clear. The caption is the Tools card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="liquid-ether-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="liquid-ether-fill">
        <UpstreamLiquidEther
          key={run}
          mouseForce={mouseForce}
          cursorSize={cursorSize}
          isViscous={isViscous}
          viscous={viscous}
          iterationsViscous={iterationsViscous}
          iterationsPoisson={iterationsPoisson}
          dt={dt}
          BFECC={BFECC}
          resolution={resolution}
          isBounce={isBounce}
          colors={colors}
          autoDemo={autoDemo && !reduce}
          autoSpeed={motionSpeed}
          autoIntensity={autoIntensity}
          takeoverDuration={takeoverDuration}
          autoResumeDelay={autoResumeDelay}
          autoRampDuration={autoRampDuration}
          backgroundColor={backgroundColor}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="liquid-ether__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[2].label} {HERO.facts[2].value}.
      </p>
    </ReactBitsFrame>
  );
}
