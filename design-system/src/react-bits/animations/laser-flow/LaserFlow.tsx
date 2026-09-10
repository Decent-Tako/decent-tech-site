import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLaserFlow from '../../vendor/animations/laser-flow/LaserFlow';
import { LASER_FLOW_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './laser-flow.css';

export type LaserFlowProps = {
  wispDensity?: (typeof LASER_FLOW_DEFAULTS)['wispDensity'];
  mouseSmoothTime?: (typeof LASER_FLOW_DEFAULTS)['mouseSmoothTime'];
  mouseTiltStrength?: (typeof LASER_FLOW_DEFAULTS)['mouseTiltStrength'];
  horizontalBeamOffset?: (typeof LASER_FLOW_DEFAULTS)['horizontalBeamOffset'];
  verticalBeamOffset?: (typeof LASER_FLOW_DEFAULTS)['verticalBeamOffset'];
  flowSpeed?: (typeof LASER_FLOW_DEFAULTS)['flowSpeed'];
  verticalSizing?: (typeof LASER_FLOW_DEFAULTS)['verticalSizing'];
  horizontalSizing?: (typeof LASER_FLOW_DEFAULTS)['horizontalSizing'];
  fogIntensity?: (typeof LASER_FLOW_DEFAULTS)['fogIntensity'];
  fogScale?: (typeof LASER_FLOW_DEFAULTS)['fogScale'];
  wispSpeed?: (typeof LASER_FLOW_DEFAULTS)['wispSpeed'];
  wispIntensity?: (typeof LASER_FLOW_DEFAULTS)['wispIntensity'];
  flowStrength?: (typeof LASER_FLOW_DEFAULTS)['flowStrength'];
  decay?: (typeof LASER_FLOW_DEFAULTS)['decay'];
  falloffStart?: (typeof LASER_FLOW_DEFAULTS)['falloffStart'];
  fogFallSpeed?: (typeof LASER_FLOW_DEFAULTS)['fogFallSpeed'];
  color?: (typeof LASER_FLOW_DEFAULTS)['color'];
  backgroundColor?: (typeof LASER_FLOW_DEFAULTS)['backgroundColor'];
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[3];

export function LaserFlow({
  wispDensity = LASER_FLOW_DEFAULTS.wispDensity,
  mouseSmoothTime = LASER_FLOW_DEFAULTS.mouseSmoothTime,
  mouseTiltStrength = LASER_FLOW_DEFAULTS.mouseTiltStrength,
  horizontalBeamOffset = LASER_FLOW_DEFAULTS.horizontalBeamOffset,
  verticalBeamOffset = LASER_FLOW_DEFAULTS.verticalBeamOffset,
  flowSpeed = LASER_FLOW_DEFAULTS.flowSpeed,
  verticalSizing = LASER_FLOW_DEFAULTS.verticalSizing,
  horizontalSizing = LASER_FLOW_DEFAULTS.horizontalSizing,
  fogIntensity = LASER_FLOW_DEFAULTS.fogIntensity,
  fogScale = LASER_FLOW_DEFAULTS.fogScale,
  wispSpeed = LASER_FLOW_DEFAULTS.wispSpeed,
  wispIntensity = LASER_FLOW_DEFAULTS.wispIntensity,
  flowStrength = LASER_FLOW_DEFAULTS.flowStrength,
  decay = LASER_FLOW_DEFAULTS.decay,
  falloffStart = LASER_FLOW_DEFAULTS.falloffStart,
  fogFallSpeed = LASER_FLOW_DEFAULTS.fogFallSpeed,
  color = LASER_FLOW_DEFAULTS.color,
  backgroundColor = LASER_FLOW_DEFAULTS.backgroundColor,
  reducedMotion = LASER_FLOW_DEFAULTS.reducedMotion,
}: LaserFlowProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Laser Flow"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js <code>RawShaderMaterial</code> draws a beam with wisps at
              density <code>{wispDensity}</code> and fog intensity{' '}
              <code>{fogIntensity}</code>. Pointer tilt is{' '}
              <code>{mouseTiltStrength}</code>. Colour is brand accent yellow;
              upstream was <code>#FF79C6</code>. Background is brand ink; upstream
              was <code>#000000</code>.
            </>
          }
          controls="Pause stops the frame loop and keeps the last frame. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="dpr follows the device, so it is not a control. paused, onReady, and onUnavailable are local. preserveDrawingBuffer is on so the play can read pixels. The caption is Challenge week from src/pages/content.ts."
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
      stageClassName="rb-frame__stage--ink laser-flow-stage"
      stageTestId="laser-flow-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <UpstreamLaserFlow
        key={run}
        wispDensity={wispDensity}
        mouseSmoothTime={mouseSmoothTime}
        mouseTiltStrength={mouseTiltStrength}
        horizontalBeamOffset={horizontalBeamOffset}
        verticalBeamOffset={verticalBeamOffset}
        flowSpeed={reduce ? 0 : flowSpeed}
        verticalSizing={verticalSizing}
        horizontalSizing={horizontalSizing}
        fogIntensity={fogIntensity}
        fogScale={fogScale}
        wispSpeed={reduce ? 0 : wispSpeed}
        wispIntensity={wispIntensity}
        flowStrength={flowStrength}
        decay={decay}
        falloffStart={falloffStart}
        fogFallSpeed={reduce ? 0 : fogFallSpeed}
        color={color}
        backgroundColor={backgroundColor}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onUnavailable={() => setWebgl('unavailable')}
      />
      <p className="laser-flow-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
