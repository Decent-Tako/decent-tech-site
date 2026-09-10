import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDotField from '../../vendor/backgrounds/dot-field/DotField';
import { DOT_FIELD_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './dot-field.css';

export type DotFieldProps = {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  reducedMotion?: ReducedMotionMode;
};

function probeCanvas(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return ctx ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[3];

export function DotField({
  dotRadius = DOT_FIELD_DEFAULTS.dotRadius,
  dotSpacing = DOT_FIELD_DEFAULTS.dotSpacing,
  cursorRadius = DOT_FIELD_DEFAULTS.cursorRadius,
  cursorForce = DOT_FIELD_DEFAULTS.cursorForce,
  bulgeOnly = DOT_FIELD_DEFAULTS.bulgeOnly,
  bulgeStrength = DOT_FIELD_DEFAULTS.bulgeStrength,
  glowRadius = DOT_FIELD_DEFAULTS.glowRadius,
  sparkle = DOT_FIELD_DEFAULTS.sparkle,
  waveAmplitude = DOT_FIELD_DEFAULTS.waveAmplitude,
  gradientFrom = DOT_FIELD_DEFAULTS.gradientFrom,
  gradientTo = DOT_FIELD_DEFAULTS.gradientTo,
  glowColor = DOT_FIELD_DEFAULTS.glowColor,
  reducedMotion = DOT_FIELD_DEFAULTS.reducedMotion,
}: DotFieldProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeCanvas);
  const reduce = useReduce(reducedMotion);
  const motionWave = reduce ? 0 : waveAmplitude;

  return (
    <ReactBitsFrame
      title="Dot Field"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas grid of dots. The pointer bulges the field. Optional sparkle
              and a sine wave offset the dots.
            </>
          }
          controls="Pause holds the bulge and the wave. Replay remounts the field. Reduced motion sets waveAmplitude to 0 and holds the field."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onError are not controls. Colour defaults are brand tokens: gradientFrom accent-blue (upstream rgba(168, 85, 247, 0.35)), gradientTo accent-yellow (upstream rgba(180, 151, 207, 0.25)), glowColor paper #FFFFFF (upstream #120F17). The caption is the Challenge week card from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeCanvas());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="dot-field-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionWave),
      }}
    >
      <div className="dot-field-fill">
        <UpstreamDotField
          key={run}
          dotRadius={dotRadius}
          dotSpacing={dotSpacing}
          cursorRadius={cursorRadius}
          cursorForce={cursorForce}
          bulgeOnly={bulgeOnly}
          bulgeStrength={bulgeStrength}
          glowRadius={glowRadius}
          sparkle={sparkle}
          waveAmplitude={motionWave}
          gradientFrom={gradientFrom}
          gradientTo={gradientTo}
          glowColor={glowColor}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="dot-field__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
