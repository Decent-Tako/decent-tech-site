import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMagnet from '../../vendor/animations/magnet/Magnet';
import { MAGNET_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './magnet.css';

export type MagnetProps = {
  padding?: (typeof MAGNET_DEFAULTS)['padding'];
  disabled?: (typeof MAGNET_DEFAULTS)['disabled'];
  magnetStrength?: (typeof MAGNET_DEFAULTS)['magnetStrength'];
  activeTransition?: (typeof MAGNET_DEFAULTS)['activeTransition'];
  inactiveTransition?: (typeof MAGNET_DEFAULTS)['inactiveTransition'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[4];

export function Magnet({
  padding = MAGNET_DEFAULTS.padding,
  disabled = MAGNET_DEFAULTS.disabled,
  magnetStrength = MAGNET_DEFAULTS.magnetStrength,
  activeTransition = MAGNET_DEFAULTS.activeTransition,
  inactiveTransition = MAGNET_DEFAULTS.inactiveTransition,
  reducedMotion = MAGNET_DEFAULTS.reducedMotion,
}: MagnetProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Magnet"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              The inner card translates toward the pointer when the pointer is
              inside the card plus <code>{padding}</code> px. Strength{' '}
              <code>{magnetStrength}</code> divides the offset. Active ease is{' '}
              <code>{activeTransition}</code>.
            </>
          }
          controls="Pause resets the offset and ignores the pointer. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="wrapperClassName and innerClassName are not controls. paused and onActive are local. Pointer listeners sit on the stage, not window. The card is Street from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setActive(false);
        setOffset({ x: 0, y: 0 });
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="magnet-stage"
      stageTestId="magnet-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': active ? 'true' : 'false',
        'data-x': String(Math.round(offset.x)),
        'data-y': String(Math.round(offset.y)),
      }}
    >
      <UpstreamMagnet
        key={run}
        padding={padding}
        disabled={disabled || reduce}
        magnetStrength={magnetStrength}
        activeTransition={activeTransition}
        inactiveTransition={inactiveTransition}
        paused={paused || reduce}
        onActive={(next, x, y) => {
          setActive(next);
          setOffset({ x, y });
        }}
      >
        <div className="magnet-card">
          <img src={CARD.photo.src} alt={CARD.photo.alt} width={640} height={400} />
          <p className="magnet-kicker">{CARD.kicker}</p>
          <p className="magnet-title">{CARD.title}</p>
          <p>{CARD.copy}</p>
        </div>
      </UpstreamMagnet>
    </ReactBitsFrame>
  );
}
