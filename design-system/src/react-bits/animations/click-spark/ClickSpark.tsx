import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamClickSpark from '../../vendor/animations/click-spark/ClickSpark';
import { CLICK_SPARK_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './click-spark.css';

export type ClickSparkProps = {
  sparkColor?: (typeof CLICK_SPARK_DEFAULTS)['sparkColor'];
  sparkSize?: (typeof CLICK_SPARK_DEFAULTS)['sparkSize'];
  sparkRadius?: (typeof CLICK_SPARK_DEFAULTS)['sparkRadius'];
  sparkCount?: (typeof CLICK_SPARK_DEFAULTS)['sparkCount'];
  duration?: (typeof CLICK_SPARK_DEFAULTS)['duration'];
  easing?: (typeof CLICK_SPARK_DEFAULTS)['easing'];
  extraScale?: (typeof CLICK_SPARK_DEFAULTS)['extraScale'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[3];

export function ClickSpark({
  sparkColor = CLICK_SPARK_DEFAULTS.sparkColor,
  sparkSize = CLICK_SPARK_DEFAULTS.sparkSize,
  sparkRadius = CLICK_SPARK_DEFAULTS.sparkRadius,
  sparkCount = CLICK_SPARK_DEFAULTS.sparkCount,
  duration = CLICK_SPARK_DEFAULTS.duration,
  easing = CLICK_SPARK_DEFAULTS.easing,
  extraScale = CLICK_SPARK_DEFAULTS.extraScale,
  reducedMotion = CLICK_SPARK_DEFAULTS.reducedMotion,
}: ClickSparkProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [sparks, setSparks] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Click Spark"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas draws {sparkCount} line sparks at the click, easing{' '}
              <code>{easing}</code> out to radius <code>{sparkRadius}</code> px over{' '}
              <code>{duration}</code> ms. Colour is brand accent yellow; upstream was{' '}
              <code>#fff</code>.
            </>
          }
          controls="Pause stops new sparks and keeps the last frame. Replay remounts the canvas."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused and onSpark are local. The card is Challenge week from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setSparks(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink click-spark-stage"
      stageTestId="click-spark-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-sparks': String(sparks),
      }}
    >
      <UpstreamClickSpark
        key={run}
        sparkColor={sparkColor}
        sparkSize={sparkSize}
        sparkRadius={sparkRadius}
        sparkCount={sparkCount}
        duration={reduce ? 0 : duration}
        easing={easing}
        extraScale={extraScale}
        paused={paused || reduce}
        onSpark={setSparks}
      >
        <div className="click-spark-card">
          <img src={CARD.photo.src} alt={CARD.photo.alt} width={640} height={400} />
          <p>{CARD.kicker}</p>
          <p>{CARD.title}</p>
          <p>{CARD.copy}</p>
        </div>
      </UpstreamClickSpark>
    </ReactBitsFrame>
  );
}
