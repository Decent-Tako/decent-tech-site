import { useState } from 'react';

import { FEATURES, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamImageTrail from '../../vendor/animations/image-trail/ImageTrail';
import { IMAGE_TRAIL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './image-trail.css';

export type ImageTrailProps = {
  variant?: (typeof IMAGE_TRAIL_DEFAULTS)['variant'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[1];
const ITEMS = [PHOTOS.hero.src, PHOTOS.crowd.src, PHOTOS.community.src, PHOTOS.run.src, PHOTOS.night.src];

export function ImageTrail({
  variant = IMAGE_TRAIL_DEFAULTS.variant,
  reducedMotion = IMAGE_TRAIL_DEFAULTS.reducedMotion,
}: ImageTrailProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Image Trail"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Variant <code>{variant}</code> of eight gsap trail classes. As the
              pointer moves past an 80 px threshold, the next Academy photograph
              tweens in at the pointer and the last one fades.
            </>
          }
          controls="Pause skips new trail images and keeps the last frame. Replay remounts the trail."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items is the five Academy photographs from src/pages/content.ts, so it is not a control. paused is local. Pointer listeners sit on the host, not window."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="image-trail-stage"
      stageTestId="image-trail-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-variant': String(variant),
      }}
    >
      <div className="image-trail-host" data-reduced={reduce ? 'true' : 'false'}>
        <UpstreamImageTrail key={run} items={[...ITEMS]} variant={variant} paused={paused || reduce} />
      </div>
      <p className="image-trail-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
