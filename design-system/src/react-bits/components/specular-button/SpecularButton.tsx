import { useState } from 'react';

import { DESTINATIONS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamSpecularButton from '../../vendor/components/specular-button/SpecularButton';
import {
  REACT_BITS_SOURCE,
  SPECULAR_BUTTON_DEFAULTS,
  SPECULAR_BUTTON_SIZES,
  SPECULAR_BUTTON_TYPES,
} from './source';

import './specular-button.css';

export type SpecularButtonProps = {
  size?: (typeof SPECULAR_BUTTON_SIZES)[number];
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  type?: (typeof SPECULAR_BUTTON_TYPES)[number];
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  if (!gl) return 'unavailable';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return 'pending';
}

const LABEL = DESTINATIONS[0].cta;

export function SpecularButton({
  size = SPECULAR_BUTTON_DEFAULTS.size,
  radius = SPECULAR_BUTTON_DEFAULTS.radius,
  tint = SPECULAR_BUTTON_DEFAULTS.tint,
  tintOpacity = SPECULAR_BUTTON_DEFAULTS.tintOpacity,
  blur = SPECULAR_BUTTON_DEFAULTS.blur,
  textColor = SPECULAR_BUTTON_DEFAULTS.textColor,
  lineColor = SPECULAR_BUTTON_DEFAULTS.lineColor,
  baseColor = SPECULAR_BUTTON_DEFAULTS.baseColor,
  intensity = SPECULAR_BUTTON_DEFAULTS.intensity,
  shineSize = SPECULAR_BUTTON_DEFAULTS.shineSize,
  shineFade = SPECULAR_BUTTON_DEFAULTS.shineFade,
  thickness = SPECULAR_BUTTON_DEFAULTS.thickness,
  speed = SPECULAR_BUTTON_DEFAULTS.speed,
  followMouse = SPECULAR_BUTTON_DEFAULTS.followMouse,
  proximity = SPECULAR_BUTTON_DEFAULTS.proximity,
  autoAnimate = SPECULAR_BUTTON_DEFAULTS.autoAnimate,
  disabled = SPECULAR_BUTTON_DEFAULTS.disabled,
  type = SPECULAR_BUTTON_DEFAULTS.type,
  reducedMotion = SPECULAR_BUTTON_DEFAULTS.reducedMotion,
}: SpecularButtonProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Specular Button"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 shader draws a specular rim. The light follows the
              pointer within <code>{proximity}</code> px, or sweeps when{' '}
              <code>autoAnimate</code> is on, at speed <code>{speed}</code>.
            </>
          }
          controls="Pause skips the render after the first frame. Replay remounts the button."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="children, onClick, and className are not controls. The label is DESTINATIONS[0].cta. Colour props use paper, charcoal, and white. Upstream tint #ffffff, text #f5f5f5, line #ffffff, base #525252. Pointer motion binds to the stage. preserveDrawingBuffer is a local change so the play function can sample pixels."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setClicked(false);
        setWebgl((state) => (state === 'unavailable' ? state : 'pending'));
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="specular-button-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-clicked': clicked ? 'true' : 'false',
        'data-auto': autoAnimate ? 'true' : 'false',
        'data-size': size,
      }}
    >
      <UpstreamSpecularButton
        key={run}
        size={size}
        radius={radius}
        tint={tint}
        tintOpacity={tintOpacity}
        blur={blur}
        textColor={textColor}
        lineColor={lineColor}
        baseColor={baseColor}
        intensity={intensity}
        shineSize={shineSize}
        shineFade={shineFade}
        thickness={thickness}
        speed={reduce ? 0 : speed}
        followMouse={followMouse && !reduce}
        proximity={proximity}
        autoAnimate={autoAnimate && !reduce}
        disabled={disabled}
        type={type}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onClick={() => setClicked(true)}
      >
        {LABEL}
      </UpstreamSpecularButton>
    </ReactBitsFrame>
  );
}
