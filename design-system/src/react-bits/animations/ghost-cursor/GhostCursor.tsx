import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGhostCursor from '../../vendor/animations/ghost-cursor/GhostCursor';
import { GHOST_CURSOR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './ghost-cursor.css';

export type GhostCursorProps = {
  trailLength?: (typeof GHOST_CURSOR_DEFAULTS)['trailLength'];
  inertia?: (typeof GHOST_CURSOR_DEFAULTS)['inertia'];
  grainIntensity?: (typeof GHOST_CURSOR_DEFAULTS)['grainIntensity'];
  bloomStrength?: (typeof GHOST_CURSOR_DEFAULTS)['bloomStrength'];
  bloomRadius?: (typeof GHOST_CURSOR_DEFAULTS)['bloomRadius'];
  bloomThreshold?: (typeof GHOST_CURSOR_DEFAULTS)['bloomThreshold'];
  brightness?: (typeof GHOST_CURSOR_DEFAULTS)['brightness'];
  color?: (typeof GHOST_CURSOR_DEFAULTS)['color'];
  mixBlendMode?: (typeof GHOST_CURSOR_DEFAULTS)['mixBlendMode'];
  edgeIntensity?: (typeof GHOST_CURSOR_DEFAULTS)['edgeIntensity'];
  maxDevicePixelRatio?: (typeof GHOST_CURSOR_DEFAULTS)['maxDevicePixelRatio'];
  targetPixels?: (typeof GHOST_CURSOR_DEFAULTS)['targetPixels'];
  fadeDelayMs?: (typeof GHOST_CURSOR_DEFAULTS)['fadeDelayMs'];
  fadeDurationMs?: (typeof GHOST_CURSOR_DEFAULTS)['fadeDurationMs'];
  zIndex?: (typeof GHOST_CURSOR_DEFAULTS)['zIndex'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[3];

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function GhostCursor({
  trailLength = GHOST_CURSOR_DEFAULTS.trailLength,
  inertia = GHOST_CURSOR_DEFAULTS.inertia,
  grainIntensity = GHOST_CURSOR_DEFAULTS.grainIntensity,
  bloomStrength = GHOST_CURSOR_DEFAULTS.bloomStrength,
  bloomRadius = GHOST_CURSOR_DEFAULTS.bloomRadius,
  bloomThreshold = GHOST_CURSOR_DEFAULTS.bloomThreshold,
  brightness = GHOST_CURSOR_DEFAULTS.brightness,
  color = GHOST_CURSOR_DEFAULTS.color,
  mixBlendMode = GHOST_CURSOR_DEFAULTS.mixBlendMode,
  edgeIntensity = GHOST_CURSOR_DEFAULTS.edgeIntensity,
  maxDevicePixelRatio = GHOST_CURSOR_DEFAULTS.maxDevicePixelRatio,
  targetPixels = GHOST_CURSOR_DEFAULTS.targetPixels,
  fadeDelayMs = GHOST_CURSOR_DEFAULTS.fadeDelayMs,
  fadeDurationMs = GHOST_CURSOR_DEFAULTS.fadeDurationMs,
  zIndex = GHOST_CURSOR_DEFAULTS.zIndex,
  reducedMotion = GHOST_CURSOR_DEFAULTS.reducedMotion,
}: GhostCursorProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Ghost Cursor"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A Three.js full-screen shader draws a smoke blob at the pointer
              plus a trail of {trailLength} samples. Bloom and film grain sit on
              the composer. Color is brand accent blue; upstream was{' '}
              <code>#B497CF</code>.
            </>
          }
          controls="Pause holds the last frame. Replay remounts the renderer."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused and onReady are local. Pointer listeners bind to the stage, the parent of the overlay. fadeDelayMs and fadeDurationMs use the desktop defaults. The caption is Challenge week from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl((current) => (current === 'unavailable' ? current : 'pending'));
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink ghost-cursor-stage"
      stageTestId="ghost-cursor-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
      }}
    >
      <UpstreamGhostCursor
        key={run}
        trailLength={trailLength}
        inertia={inertia}
        grainIntensity={reduce ? 0 : grainIntensity}
        bloomStrength={reduce ? 0 : bloomStrength}
        bloomRadius={bloomRadius}
        bloomThreshold={bloomThreshold}
        brightness={brightness}
        color={color}
        mixBlendMode={mixBlendMode}
        edgeIntensity={edgeIntensity}
        maxDevicePixelRatio={maxDevicePixelRatio}
        targetPixels={targetPixels}
        fadeDelayMs={reduce ? 0 : fadeDelayMs}
        fadeDurationMs={reduce ? 0 : fadeDurationMs}
        zIndex={zIndex}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
      />
      <div className="ghost-cursor-copy">
        <p className="ghost-cursor-kicker">{CARD.kicker}</p>
        <p className="ghost-cursor-title">{CARD.title}</p>
        <p>{CARD.copy}</p>
      </div>
    </ReactBitsFrame>
  );
}
