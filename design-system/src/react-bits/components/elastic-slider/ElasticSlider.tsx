import { useState } from 'react';

import { HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamElasticSlider from '../../vendor/components/elastic-slider/ElasticSlider';
import { ELASTIC_SLIDER_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './elastic-slider.css';

export type ElasticSliderProps = {
  defaultValue?: number;
  startingValue?: number;
  maxValue?: number;
  isStepped?: boolean;
  stepSize?: number;
  reducedMotion?: ReducedMotionMode;
};

export function ElasticSlider({
  defaultValue = ELASTIC_SLIDER_DEFAULTS.defaultValue,
  startingValue = ELASTIC_SLIDER_DEFAULTS.startingValue,
  maxValue = ELASTIC_SLIDER_DEFAULTS.maxValue,
  isStepped = ELASTIC_SLIDER_DEFAULTS.isStepped,
  stepSize = ELASTIC_SLIDER_DEFAULTS.stepSize,
  reducedMotion = ELASTIC_SLIDER_DEFAULTS.reducedMotion,
}: ElasticSliderProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [value, setValue] = useState(defaultValue);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Elastic Slider"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Drag stretches the track past its ends, then a spring snaps it
              back. Range <code>{startingValue}</code> to <code>{maxValue}</code>
              {isStepped ? ` in steps of ${stepSize}` : ''}.
            </>
          }
          controls="Pause ignores pointer drag. Replay remounts the slider."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="leftIcon, rightIcon, className, paused, and onValueChange are not controls. Icons are inline SVG, not Chakra. The caption is the Goal fact from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setValue(defaultValue);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="elastic-slider-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-value': String(Math.round(value)),
        'data-stepped': isStepped ? 'true' : 'false',
      }}
    >
      <p className="elastic-slider__goal">
        {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
      <UpstreamElasticSlider
        key={run}
        defaultValue={defaultValue}
        startingValue={startingValue}
        maxValue={maxValue}
        isStepped={isStepped}
        stepSize={stepSize}
        paused={paused || reduce}
        onValueChange={setValue}
      />
    </ReactBitsFrame>
  );
}
