import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamEvilEye from '../../vendor/backgrounds/evil-eye/EvilEye';
import { EVIL_EYE_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './evil-eye.css';

export type EvilEyeProps = {
  eyeColor?: string;
  intensity?: number;
  pupilSize?: number;
  irisWidth?: number;
  glowIntensity?: number;
  scale?: number;
  noiseScale?: number;
  pupilFollow?: number;
  flameSpeed?: number;
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

const CARD = FEATURES[0];

export function EvilEye({
  eyeColor = EVIL_EYE_DEFAULTS.eyeColor,
  intensity = EVIL_EYE_DEFAULTS.intensity,
  pupilSize = EVIL_EYE_DEFAULTS.pupilSize,
  irisWidth = EVIL_EYE_DEFAULTS.irisWidth,
  glowIntensity = EVIL_EYE_DEFAULTS.glowIntensity,
  scale = EVIL_EYE_DEFAULTS.scale,
  noiseScale = EVIL_EYE_DEFAULTS.noiseScale,
  pupilFollow = EVIL_EYE_DEFAULTS.pupilFollow,
  flameSpeed = EVIL_EYE_DEFAULTS.flameSpeed,
  backgroundColor = EVIL_EYE_DEFAULTS.backgroundColor,
  lightMode = EVIL_EYE_DEFAULTS.lightMode,
  reducedMotion = EVIL_EYE_DEFAULTS.reducedMotion,
}: EvilEyeProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionFlame = reduce ? 0 : flameSpeed;

  return (
    <ReactBitsFrame
      title="Evil Eye"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl polar-noise iris. Time drives flame. The pointer moves the pupil
              through <code>uMouse</code>.
            </>
          }
          controls="Pause holds uTime. Replay remounts the sketch. Reduced motion sets flameSpeed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour defaults are brand tokens: eyeColor accent-yellow #DEF54F (upstream #FF6F37), backgroundColor ink #212121 (upstream #000000). The caption is the Week 0 card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="evil-eye-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionFlame),
      }}
    >
      <div className="evil-eye-fill">
        <UpstreamEvilEye
          key={run}
          eyeColor={eyeColor}
          intensity={intensity}
          pupilSize={pupilSize}
          irisWidth={irisWidth}
          glowIntensity={glowIntensity}
          scale={scale}
          noiseScale={noiseScale}
          pupilFollow={pupilFollow}
          flameSpeed={motionFlame}
          backgroundColor={backgroundColor}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="evil-eye__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
