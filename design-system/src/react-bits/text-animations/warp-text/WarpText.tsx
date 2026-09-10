import { useRef, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamWarpText from '../../vendor/text-animations/warp-text/WarpText';
import { WARP_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './warp-text.css';

export type WarpTextProps = {
  text?: string;
  color?: string;
  warpStrength?: number;
  warpScale?: number;
  speed?: number;
  pointerInfluence?: number;
  pointerStrength?: number;
  refraction?: number;
  ripple?: boolean;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontFamily?: string;
  letterSpacing?: string | number;
  lineHeight?: string | number;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl2(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function WarpText({
  text = WARP_TEXT_DEFAULTS.text,
  color = WARP_TEXT_DEFAULTS.color,
  warpStrength = WARP_TEXT_DEFAULTS.warpStrength,
  warpScale = WARP_TEXT_DEFAULTS.warpScale,
  speed = WARP_TEXT_DEFAULTS.speed,
  pointerInfluence = WARP_TEXT_DEFAULTS.pointerInfluence,
  pointerStrength = WARP_TEXT_DEFAULTS.pointerStrength,
  refraction = WARP_TEXT_DEFAULTS.refraction,
  ripple = WARP_TEXT_DEFAULTS.ripple,
  fontSize = WARP_TEXT_DEFAULTS.fontSize,
  fontWeight = WARP_TEXT_DEFAULTS.fontWeight,
  fontFamily = WARP_TEXT_DEFAULTS.fontFamily,
  letterSpacing = WARP_TEXT_DEFAULTS.letterSpacing,
  lineHeight = WARP_TEXT_DEFAULTS.lineHeight,
  reducedMotion = WARP_TEXT_DEFAULTS.reducedMotion,
}: WarpTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Warp Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              ogl draws a WebGL 2 warp of a text canvas. Strength{' '}
              <code>{warpStrength}</code>, scale <code>{warpScale}</code>, speed{' '}
              <code>{speed}</code>. Pointer lens is <code>{pointerInfluence}</code>.
              Ripple is <code>{String(ripple)}</code>.
            </>
          }
          controls="Pause holds the frame loop. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. className, style, paused, reduced, onReady, onError, and onPointer are not controls. color is paper #FFFFFF; upstream default #f8f5ff. fontFamily is Brand Sans; upstream default inherit. fontWeight is 700; upstream default 800. preserveDrawingBuffer is on so play can sample the canvas."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeWebgl2());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageRef={stageRef}
      stageTestId="warp-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-pointer-x': '0.5',
        'data-pointer-y': '0.5',
        'data-copy': FEATURES[0].title,
      }}
    >
      {webgl === 'unavailable' ? null : (
        <UpstreamWarpText
          key={run}
          text={text}
          color={color}
          warpStrength={warpStrength}
          warpScale={warpScale}
          speed={reduce ? 0 : speed}
          pointerInfluence={pointerInfluence}
          pointerStrength={pointerStrength}
          refraction={refraction}
          ripple={ripple}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontFamily={fontFamily}
          letterSpacing={letterSpacing}
          lineHeight={lineHeight}
          paused={paused}
          reduced={reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
          onPointer={(x, y) => {
            const stage = stageRef.current;
            if (!stage) return;
            stage.setAttribute('data-pointer-x', x.toFixed(3));
            stage.setAttribute('data-pointer-y', y.toFixed(3));
          }}
        />
      )}
    </ReactBitsFrame>
  );
}
