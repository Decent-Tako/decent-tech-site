import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDepthText from '../../vendor/text-animations/depth-text/DepthText';
import { DEPTH_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './depth-text.css';

export type DepthTextProps = {
  text?: string;
  layers?: number;
  depth?: number;
  faceColor?: string;
  depthColor?: string;
  tilt?: number;
  pointerTracking?: boolean;
  smoothing?: number;
  perspective?: number;
  autoOrbit?: boolean;
  orbitSpeed?: number;
  fontSize?: string;
  fontWeight?: number | string;
  shadow?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function DepthText({
  text = DEPTH_TEXT_DEFAULTS.text,
  layers = DEPTH_TEXT_DEFAULTS.layers,
  depth = DEPTH_TEXT_DEFAULTS.depth,
  faceColor = DEPTH_TEXT_DEFAULTS.faceColor,
  depthColor = DEPTH_TEXT_DEFAULTS.depthColor,
  tilt = DEPTH_TEXT_DEFAULTS.tilt,
  pointerTracking = DEPTH_TEXT_DEFAULTS.pointerTracking,
  smoothing = DEPTH_TEXT_DEFAULTS.smoothing,
  perspective = DEPTH_TEXT_DEFAULTS.perspective,
  autoOrbit = DEPTH_TEXT_DEFAULTS.autoOrbit,
  orbitSpeed = DEPTH_TEXT_DEFAULTS.orbitSpeed,
  fontSize = DEPTH_TEXT_DEFAULTS.fontSize,
  fontWeight = DEPTH_TEXT_DEFAULTS.fontWeight,
  shadow = DEPTH_TEXT_DEFAULTS.shadow,
  reducedMotion = DEPTH_TEXT_DEFAULTS.reducedMotion,
}: DepthTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Depth Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Stacked copies of <code>{text}</code> sit on the Z axis. An orbit
              and pointer tilt rotate the stack. <code>{layers}</code> layers,
              depth <code>{depth}</code> px.
            </>
          }
          controls="Pause holds the orbit. Replay remounts the stack."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. faceColor is paper; depthColor is accent blue. Upstream defaults are #f8fafc and #7c3aed. fontWeight 700 matches Brand Sans; upstream default is 900. Pointer listeners bind to the root, not window. className, style, paused, and onFrame are not controls."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageRef={stageRef}
      stageClassName="rb-frame__stage--ink"
      stageTestId="depth-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-tilt-x': '0',
        'data-tilt-y': '0',
        'data-copy': FEATURES[0].title,
      }}
    >
      <div className="depth-text__host">
        <UpstreamDepthText
          key={run}
          text={text}
          layers={layers}
          depth={depth}
          faceColor={faceColor}
          depthColor={depthColor}
          tilt={tilt}
          pointerTracking={pointerTracking}
          smoothing={smoothing}
          perspective={perspective}
          autoOrbit={reduce ? false : autoOrbit}
          orbitSpeed={orbitSpeed}
          fontSize={fontSize}
          fontWeight={fontWeight}
          shadow={shadow}
          paused={paused || reduce}
          onFrame={(info) => {
            const stage = stageRef.current;
            if (!stage) return;
            stage.setAttribute('data-tilt-x', info.x.toFixed(3));
            stage.setAttribute('data-tilt-y', info.y.toFixed(3));
          }}
        />
      </div>
    </ReactBitsFrame>
  );
}
