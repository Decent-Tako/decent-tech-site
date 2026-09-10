import { useState } from 'react';

import { FEATURES, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamTiltedCard from '../../vendor/components/tilted-card/TiltedCard';
import { REACT_BITS_SOURCE, TILTED_CARD_DEFAULTS } from './source';

import './tilted-card.css';

export type TiltedCardProps = {
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];
const PHOTO = PHOTOS.hero;

export function TiltedCard({
  containerHeight = TILTED_CARD_DEFAULTS.containerHeight,
  containerWidth = TILTED_CARD_DEFAULTS.containerWidth,
  imageHeight = TILTED_CARD_DEFAULTS.imageHeight,
  imageWidth = TILTED_CARD_DEFAULTS.imageWidth,
  scaleOnHover = TILTED_CARD_DEFAULTS.scaleOnHover,
  rotateAmplitude = TILTED_CARD_DEFAULTS.rotateAmplitude,
  showMobileWarning = TILTED_CARD_DEFAULTS.showMobileWarning,
  showTooltip = TILTED_CARD_DEFAULTS.showTooltip,
  displayOverlayContent = TILTED_CARD_DEFAULTS.displayOverlayContent,
  reducedMotion = TILTED_CARD_DEFAULTS.reducedMotion,
}: TiltedCardProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState(false);
  const reduce = useReduce(reducedMotion);
  const amplitude = reduce ? 0 : rotateAmplitude;
  const hoverScale = reduce ? 1 : scaleOnHover;

  return (
    <ReactBitsFrame
      title="Tilted Card"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Pointer offset on the figure drives <code>rotateX</code> and{' '}
              <code>rotateY</code> up to <code>{amplitude}</code> degrees. Hover
              scales to <code>{hoverScale}</code>. The caption follows the
              pointer.
            </>
          }
          controls="Pause ignores pointer motion and holds the card flat. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="imageSrc, altText, captionText, and overlayContent are not controls. The photograph is PHOTOS.hero. Overlay copy is FEATURES[0]. Reduced motion sets rotateAmplitude to 0 and scaleOnHover to 1."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setHover(false);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="tilted-card-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-hover': hover ? 'true' : 'false',
        'data-overlay': displayOverlayContent ? 'true' : 'false',
        'data-tilt': amplitude > 0 && !paused ? 'true' : 'false',
      }}
    >
      <UpstreamTiltedCard
        key={run}
        imageSrc={PHOTO.src}
        altText={PHOTO.alt}
        captionText={PHOTO.caption}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        imageHeight={imageHeight}
        imageWidth={imageWidth}
        scaleOnHover={hoverScale}
        rotateAmplitude={amplitude}
        showMobileWarning={showMobileWarning}
        showTooltip={showTooltip}
        displayOverlayContent={displayOverlayContent}
        overlayContent={
          <p className="tilted-card__overlay">
            {CARD.kicker}. {CARD.title}.
          </p>
        }
        paused={paused}
        onHoverChange={setHover}
      />
    </ReactBitsFrame>
  );
}
