import { useMemo, useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import { hyperspeedPresets } from '../../vendor/backgrounds/hyperspeed/HyperSpeedPresets';
import UpstreamHyperspeed from '../../vendor/backgrounds/hyperspeed/Hyperspeed';
import { HYPERSPEED_DEFAULTS, REACT_BITS_SOURCE, type HyperspeedPreset } from './source';

import './hyperspeed.css';

export type HyperspeedProps = {
  preset?: HyperspeedPreset;
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

export function Hyperspeed({
  preset = HYPERSPEED_DEFAULTS.preset,
  lightMode = HYPERSPEED_DEFAULTS.lightMode,
  reducedMotion = HYPERSPEED_DEFAULTS.reducedMotion,
}: HyperspeedProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const effectOptions = useMemo(() => {
    const presetOptions = hyperspeedPresets[preset];
    return {
      ...presetOptions,
      colors: {
        ...presetOptions.colors,
        background: 0x212121,
      },
    };
  }, [preset]);

  return (
    <ReactBitsFrame
      title="Hyperspeed"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js road with instanced car lights and sticks. Bloom and
              SMAA sit on EffectComposer. Pointer down speeds the camera FOV.
            </>
          }
          controls="Pause holds the timer. Replay remounts the sketch. Reduced motion holds the road."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="effectOptions, paused, onReady, and onError are not controls. preset selects the upstream demo options. Nested colours stay with the preset except background, which is brand ink 0x212121 (upstream 0x000000). The caption is the Street card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="hyperspeed-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': reduce ? '0' : '1',
        'data-preset': preset,
      }}
    >
      <div className="hyperspeed-fill">
        <UpstreamHyperspeed
          key={run}
          effectOptions={
            effectOptions as unknown as Parameters<typeof UpstreamHyperspeed>[0]['effectOptions']
          }
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="hyperspeed__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
