import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamOptionWheel from '../../vendor/components/option-wheel/OptionWheel';
import {
  OPTION_WHEEL_DEFAULTS,
  type OptionWheelSide,
  REACT_BITS_SOURCE,
} from './source';

import './option-wheel.css';

export type OptionWheelProps = {
  defaultSelected?: number;
  textColor?: string;
  activeColor?: string;
  side?: OptionWheelSide;
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  soundUrl?: string;
  soundVolume?: number;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = FEATURES.map((feature) => feature.title);

export function OptionWheel({
  defaultSelected = OPTION_WHEEL_DEFAULTS.defaultSelected,
  textColor = OPTION_WHEEL_DEFAULTS.textColor,
  activeColor = OPTION_WHEEL_DEFAULTS.activeColor,
  side = OPTION_WHEEL_DEFAULTS.side,
  fontSize = OPTION_WHEEL_DEFAULTS.fontSize,
  spacing = OPTION_WHEEL_DEFAULTS.spacing,
  curve = OPTION_WHEEL_DEFAULTS.curve,
  tilt = OPTION_WHEEL_DEFAULTS.tilt,
  blur = OPTION_WHEEL_DEFAULTS.blur,
  fade = OPTION_WHEEL_DEFAULTS.fade,
  minOpacity = OPTION_WHEEL_DEFAULTS.minOpacity,
  smoothing = OPTION_WHEEL_DEFAULTS.smoothing,
  inset = OPTION_WHEEL_DEFAULTS.inset,
  loop = OPTION_WHEEL_DEFAULTS.loop,
  draggable = OPTION_WHEEL_DEFAULTS.draggable,
  soundUrl = OPTION_WHEEL_DEFAULTS.soundUrl,
  soundVolume = OPTION_WHEEL_DEFAULTS.soundVolume,
  reducedMotion = OPTION_WHEEL_DEFAULTS.reducedMotion,
}: OptionWheelProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(defaultSelected);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Option Wheel"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A rAF lerp lays labels on a curve. Tilt <code>{tilt}</code>, side{' '}
              <code>{side}</code>. Click or drag to change the selected item.
            </>
          }
          controls="Pause holds the rAF loop. Replay remounts the wheel on the default item."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items and onChange are not controls. Labels are FEATURES titles from src/pages/content.ts. textColor is quiet and activeColor is paper. soundUrl stays empty so the story does not fetch audio."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setActive(defaultSelected);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="option-wheel-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': String(active),
        'data-side': side,
      }}
    >
      <UpstreamOptionWheel
        key={run}
        items={ITEMS}
        defaultSelected={defaultSelected}
        textColor={textColor}
        activeColor={activeColor}
        side={side}
        fontSize={reduce ? Math.min(fontSize, 2) : fontSize}
        spacing={spacing}
        curve={curve}
        tilt={reduce ? 0 : tilt}
        blur={reduce ? 0 : blur}
        fade={fade}
        minOpacity={minOpacity}
        smoothing={reduce ? 1 : smoothing}
        inset={inset}
        loop={loop}
        draggable={!reduce && draggable}
        soundUrl={soundUrl}
        soundVolume={soundVolume}
        paused={paused}
        onChange={(index) => setActive(index)}
      />
    </ReactBitsFrame>
  );
}
