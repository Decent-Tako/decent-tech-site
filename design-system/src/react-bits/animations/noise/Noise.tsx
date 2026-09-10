import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamNoise from '../../vendor/animations/noise/Noise';
import { NOISE_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './noise.css';

export type NoiseProps = {
  patternSize?: (typeof NOISE_DEFAULTS)['patternSize'];
  patternScaleX?: (typeof NOISE_DEFAULTS)['patternScaleX'];
  patternScaleY?: (typeof NOISE_DEFAULTS)['patternScaleY'];
  patternRefreshInterval?: (typeof NOISE_DEFAULTS)['patternRefreshInterval'];
  patternAlpha?: (typeof NOISE_DEFAULTS)['patternAlpha'];
  reducedMotion?: ReducedMotionMode;
};

function probe2d(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return ctx ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[2];

export function Noise({
  patternSize = NOISE_DEFAULTS.patternSize,
  patternScaleX = NOISE_DEFAULTS.patternScaleX,
  patternScaleY = NOISE_DEFAULTS.patternScaleY,
  patternRefreshInterval = NOISE_DEFAULTS.patternRefreshInterval,
  patternAlpha = NOISE_DEFAULTS.patternAlpha,
  reducedMotion = NOISE_DEFAULTS.reducedMotion,
}: NoiseProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probe2d);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Noise"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas fills a 1024 square with greyscale grain at alpha{' '}
              <code>{patternAlpha}</code> every <code>{patternRefreshInterval}</code>{' '}
              frames.
            </>
          }
          controls="Pause stops the refresh loop and keeps the last grain. Replay remounts the overlay."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onUnavailable are local. patternSize, patternScaleX, and patternScaleY are upstream props the draw path does not sample. The overlay fills the stage, not the viewport. The caption is the Tools card from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probe2d());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="noise-stage"
      stageTestId="noise-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <UpstreamNoise
        key={run}
        patternSize={patternSize}
        patternScaleX={patternScaleX}
        patternScaleY={patternScaleY}
        patternRefreshInterval={patternRefreshInterval}
        patternAlpha={patternAlpha}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onUnavailable={() => setWebgl('unavailable')}
      />
      <p className="noise-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
