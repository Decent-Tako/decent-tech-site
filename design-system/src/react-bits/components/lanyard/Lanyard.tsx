import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLanyard from '../../vendor/components/lanyard/Lanyard';
import { LANYARD_DEFAULTS, LANYARD_FITS, REACT_BITS_SOURCE } from './source';

import './lanyard.css';

export type LanyardProps = {
  cameraZ?: number;
  gravityY?: number;
  fov?: number;
  transparent?: boolean;
  imageFit?: (typeof LANYARD_FITS)[number];
  lanyardWidth?: number;
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

export function Lanyard({
  cameraZ = LANYARD_DEFAULTS.cameraZ,
  gravityY = LANYARD_DEFAULTS.gravityY,
  fov = LANYARD_DEFAULTS.fov,
  transparent = LANYARD_DEFAULTS.transparent,
  imageFit = LANYARD_DEFAULTS.imageFit,
  lanyardWidth = LANYARD_DEFAULTS.lanyardWidth,
  reducedMotion = LANYARD_DEFAULTS.reducedMotion,
}: LanyardProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const hold = paused || reduce;

  return (
    <ReactBitsFrame
      title="Lanyard"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A Rapier rope hangs a GLTF badge. Gravity <code>{gravityY}</code>,
              field of view <code>{fov}</code>. Drag the card to swing it.
            </>
          }
          controls="Pause holds the physics step and the render loop. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="frontImage, backImage, lanyardImage, position, and gravity are not controls. Photographs are FEATURES through publicAsset(). The strap texture and card GLB are vendored next to the upstream file. position is cameraZ on [0, 0, z]. gravity is [0, gravityY, 0]. Reduced motion holds physics. preserveDrawingBuffer is on so play can sample the canvas. @react-three packages import through local JS re-exports so their types do not overwrite React JSX."
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
      stageTestId="lanyard-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-gravity': String(hold ? 0 : gravityY),
        'data-fov': String(fov),
      }}
    >
      {webgl === 'unavailable' ? null : (
        <UpstreamLanyard
          key={run}
          position={[0, 0, cameraZ]}
          gravity={[0, hold ? 0 : gravityY, 0]}
          fov={fov}
          transparent={transparent}
          frontImage={FEATURES[0].photo.src}
          backImage={FEATURES[1].photo.src}
          imageFit={imageFit}
          lanyardWidth={lanyardWidth}
          paused={hold}
          onReady={() => setWebgl('ready')}
        />
      )}
    </ReactBitsFrame>
  );
}
