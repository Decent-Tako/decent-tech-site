import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamVariableProximity from '../../vendor/text-animations/variable-proximity/VariableProximity';
import { VARIABLE_PROXIMITY_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './variable-proximity.css';

export type VariableProximityProps = {
  label?: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  radius?: number;
  falloff?: (typeof VARIABLE_PROXIMITY_DEFAULTS)['falloff'];
  reducedMotion?: ReducedMotionMode;
};

export function VariableProximity({
  label = VARIABLE_PROXIMITY_DEFAULTS.label,
  fromFontVariationSettings = VARIABLE_PROXIMITY_DEFAULTS.fromFontVariationSettings,
  toFontVariationSettings = VARIABLE_PROXIMITY_DEFAULTS.toFontVariationSettings,
  radius = VARIABLE_PROXIMITY_DEFAULTS.radius,
  falloff = VARIABLE_PROXIMITY_DEFAULTS.falloff,
  reducedMotion = VARIABLE_PROXIMITY_DEFAULTS.reducedMotion,
}: VariableProximityProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Variable Proximity"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each glyph maps pointer distance inside <code>{radius}</code> px to
              weight from 400 to 700 with a <code>{falloff}</code> falloff.
            </>
          }
          controls="Pause holds the frame loop. Replay remounts the word."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. containerRef, className, style, and onClick are not controls. paused, reduced, and onProximity are local. The Google Fonts import is gone. toFontVariationSettings uses wght 700 because Brand Sans has no 800 axis."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageTestId="variable-proximity-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-weight': '400',
        'data-copy': FEATURES[0].title,
      }}
    >
      <UpstreamVariableProximity
        key={run}
        label={label}
        fromFontVariationSettings={fromFontVariationSettings}
        toFontVariationSettings={toFontVariationSettings}
        containerRef={stageRef}
        radius={radius}
        falloff={falloff}
        paused={paused}
        reduced={reduce}
        onProximity={(weight) => {
          stageRef.current?.setAttribute('data-weight', String(weight));
        }}
      />
    </ReactBitsFrame>
  );
}
