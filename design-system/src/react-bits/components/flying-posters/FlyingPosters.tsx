import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFlyingPosters from '../../vendor/components/flying-posters/FlyingPosters';
import { FLYING_POSTERS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './flying-posters.css';

export type FlyingPostersProps = {
  planeWidth?: number;
  planeHeight?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
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

const ITEMS = [...FEATURES, ...FEATURES].map((feature) => feature.photo.src);

export function FlyingPosters({
  planeWidth = FLYING_POSTERS_DEFAULTS.planeWidth,
  planeHeight = FLYING_POSTERS_DEFAULTS.planeHeight,
  distortion = FLYING_POSTERS_DEFAULTS.distortion,
  scrollEase = FLYING_POSTERS_DEFAULTS.scrollEase,
  cameraFov = FLYING_POSTERS_DEFAULTS.cameraFov,
  cameraZ = FLYING_POSTERS_DEFAULTS.cameraZ,
  reducedMotion = FLYING_POSTERS_DEFAULTS.reducedMotion,
}: FlyingPostersProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionEase = reduce ? 1 : scrollEase;

  return (
    <ReactBitsFrame
      title="Flying Posters"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              ogl image planes rotate as you drag or scroll. Distortion{' '}
              <code>{distortion}</code> bends each poster. Ease{' '}
              <code>{motionEase}</code>.
            </>
          }
          controls="Pause holds the stack lerp. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items, className, paused, onReady, onError, and onScroll are not controls. Photographs are FEATURES through publicAsset(), repeated so the stack loops. preserveDrawingBuffer is on so play can sample the canvas."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setScroll(0);
        setPaused(false);
        setWebgl(probeWebgl());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="flying-posters-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-scroll': String(Math.round(scroll * 100) / 100),
        'data-distortion': String(distortion),
      }}
    >
      <UpstreamFlyingPosters
        key={run}
        items={ITEMS}
        planeWidth={planeWidth}
        planeHeight={planeHeight}
        distortion={distortion}
        scrollEase={motionEase}
        cameraFov={cameraFov}
        cameraZ={cameraZ}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onError={() => setWebgl('unavailable')}
        onScroll={setScroll}
      />
    </ReactBitsFrame>
  );
}
