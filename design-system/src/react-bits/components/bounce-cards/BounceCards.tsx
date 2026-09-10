import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamBounceCards from '../../vendor/components/bounce-cards/BounceCards';
import { BOUNCE_CARDS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './bounce-cards.css';

export type BounceCardsProps = {
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  enableHover?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const FAN = [PHOTOS.hero, PHOTOS.crowd, PHOTOS.community, PHOTOS.run, PHOTOS.night];

export function BounceCards({
  containerWidth = BOUNCE_CARDS_DEFAULTS.containerWidth,
  containerHeight = BOUNCE_CARDS_DEFAULTS.containerHeight,
  animationDelay = BOUNCE_CARDS_DEFAULTS.animationDelay,
  animationStagger = BOUNCE_CARDS_DEFAULTS.animationStagger,
  easeType = BOUNCE_CARDS_DEFAULTS.easeType,
  enableHover = BOUNCE_CARDS_DEFAULTS.enableHover,
  reducedMotion = BOUNCE_CARDS_DEFAULTS.reducedMotion,
}: BounceCardsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  return (
    <ReactBitsFrame
      title="Bounce Cards"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              <code>gsap.fromTo</code> scales each card from 0 with ease{' '}
              <code>{easeType}</code>, delay <code>{animationDelay}</code>s, and
              stagger <code>{animationStagger}</code>s. With hover on, siblings
              push aside.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the fan."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The five photographs are from public/photos through publicAsset(). images, imageAlts, className, transformStyles, and skipIntro are not controls. skipIntro is a local prop for reduced motion."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="bounce-cards-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-hover': enableHover ? 'true' : 'false',
      }}
    >
      <UpstreamBounceCards
        key={run}
        images={FAN.map((photo) => photo.src)}
        imageAlts={FAN.map((photo) => photo.alt)}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
        animationDelay={reduce ? 0 : animationDelay}
        animationStagger={reduce ? 0 : animationStagger}
        easeType={easeType}
        enableHover={enableHover}
        skipIntro={reduce}
      />
    </ReactBitsFrame>
  );
}
