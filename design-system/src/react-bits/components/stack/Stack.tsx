import { useMemo, useState } from 'react';

import { PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamStack from '../../vendor/components/stack/Stack';
import { REACT_BITS_SOURCE, STACK_DEFAULTS } from './source';

import './stack.css';

export type StackProps = {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
  stiffness?: number;
  damping?: number;
  reducedMotion?: ReducedMotionMode;
};

const FAN = [PHOTOS.hero, PHOTOS.crowd, PHOTOS.community, PHOTOS.run];

export function Stack({
  randomRotation = STACK_DEFAULTS.randomRotation,
  sensitivity = STACK_DEFAULTS.sensitivity,
  sendToBackOnClick = STACK_DEFAULTS.sendToBackOnClick,
  autoplay = STACK_DEFAULTS.autoplay,
  autoplayDelay = STACK_DEFAULTS.autoplayDelay,
  pauseOnHover = STACK_DEFAULTS.pauseOnHover,
  mobileClickOnly = STACK_DEFAULTS.mobileClickOnly,
  mobileBreakpoint = STACK_DEFAULTS.mobileBreakpoint,
  stiffness = STACK_DEFAULTS.stiffness,
  damping = STACK_DEFAULTS.damping,
  reducedMotion = STACK_DEFAULTS.reducedMotion,
}: StackProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [top, setTop] = useState(FAN.length);
  const reduce = useReduce(reducedMotion);

  const cards = useMemo(
    () =>
      FAN.map((photo) => (
        <img key={photo.src} src={photo.src} alt={photo.alt} className="card-image" />
      )),
    [],
  );

  return (
    <ReactBitsFrame
      title="Stack"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Drag a card past <code>{sensitivity}</code> px, or click when
              send-to-back is on, to send it behind the stack. Spring stiffness{' '}
              <code>{stiffness}</code> and damping <code>{damping}</code> settle
              the fan.
            </>
          }
          controls="Pause stops autoplay. Replay remounts the stack."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="cards and animationConfig are not controls. Photographs are from public/photos through publicAsset(). stiffness and damping are the animationConfig fields. Reduced motion turns drag off."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setTop(FAN.length);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="stack-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-top': String(top),
        'data-click': sendToBackOnClick ? 'true' : 'false',
        'data-autoplay': autoplay && !paused && !reduce ? 'true' : 'false',
      }}
    >
      <div className="stack-stage">
        <UpstreamStack
          key={run}
          randomRotation={randomRotation}
          sensitivity={sensitivity}
          sendToBackOnClick={sendToBackOnClick || reduce}
          cards={cards}
          animationConfig={{ stiffness, damping }}
          autoplay={autoplay && !reduce}
          autoplayDelay={autoplayDelay}
          pauseOnHover={pauseOnHover}
          mobileClickOnly={mobileClickOnly}
          mobileBreakpoint={mobileBreakpoint}
          paused={paused || reduce}
          disableDrag={reduce || sendToBackOnClick}
          onTopChange={setTop}
        />
      </div>
    </ReactBitsFrame>
  );
}
