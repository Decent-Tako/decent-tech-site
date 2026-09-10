import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamStickerPeel from '../../vendor/animations/sticker-peel/StickerPeel';
import { STICKER_PEEL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './sticker-peel.css';

export type StickerPeelProps = {
  rotate?: (typeof STICKER_PEEL_DEFAULTS)['rotate'];
  peelBackHoverPct?: (typeof STICKER_PEEL_DEFAULTS)['peelBackHoverPct'];
  peelBackActivePct?: (typeof STICKER_PEEL_DEFAULTS)['peelBackActivePct'];
  peelEasing?: (typeof STICKER_PEEL_DEFAULTS)['peelEasing'];
  peelHoverEasing?: (typeof STICKER_PEEL_DEFAULTS)['peelHoverEasing'];
  width?: (typeof STICKER_PEEL_DEFAULTS)['width'];
  shadowIntensity?: (typeof STICKER_PEEL_DEFAULTS)['shadowIntensity'];
  lightingIntensity?: (typeof STICKER_PEEL_DEFAULTS)['lightingIntensity'];
  initialPosition?: (typeof STICKER_PEEL_DEFAULTS)['initialPosition'];
  peelDirection?: (typeof STICKER_PEEL_DEFAULTS)['peelDirection'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[4];

export function StickerPeel({
  rotate = STICKER_PEEL_DEFAULTS.rotate,
  peelBackHoverPct = STICKER_PEEL_DEFAULTS.peelBackHoverPct,
  peelBackActivePct = STICKER_PEEL_DEFAULTS.peelBackActivePct,
  peelEasing = STICKER_PEEL_DEFAULTS.peelEasing,
  peelHoverEasing = STICKER_PEEL_DEFAULTS.peelHoverEasing,
  width = STICKER_PEEL_DEFAULTS.width,
  shadowIntensity = STICKER_PEEL_DEFAULTS.shadowIntensity,
  lightingIntensity = STICKER_PEEL_DEFAULTS.lightingIntensity,
  initialPosition = STICKER_PEEL_DEFAULTS.initialPosition,
  peelDirection = STICKER_PEEL_DEFAULTS.peelDirection,
  reducedMotion = STICKER_PEEL_DEFAULTS.reducedMotion,
}: StickerPeelProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [peeled, setPeeled] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Sticker Peel"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Hover peels the photograph by <code>{peelBackHoverPct}</code>% with
              a mirrored flap. gsap Draggable moves the sticker. Direction{' '}
              <code>{peelDirection}</code> deg.
            </>
          }
          controls="Pause freezes peel and drag. Replay remounts the sticker."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="imageSrc and imageAlt are the Street photograph from src/pages/content.ts, so they are not controls. className is not a control. paused, reduced, and onPeel are local. Filter ids are unique per mount."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPeeled(false);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="sticker-peel-stage"
      stageTestId="sticker-peel-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-peeled': peeled ? 'true' : 'false',
        'data-direction': String(peelDirection),
      }}
    >
      <UpstreamStickerPeel
        key={run}
        imageSrc={CARD.photo.src}
        imageAlt={CARD.photo.alt}
        rotate={rotate}
        peelBackHoverPct={peelBackHoverPct}
        peelBackActivePct={peelBackActivePct}
        peelEasing={peelEasing}
        peelHoverEasing={peelHoverEasing}
        width={width}
        shadowIntensity={shadowIntensity}
        lightingIntensity={lightingIntensity}
        initialPosition={initialPosition}
        peelDirection={peelDirection}
        paused={paused}
        reduced={reduce}
        onPeel={setPeeled}
      />
      <p className="sticker-peel-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
