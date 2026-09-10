import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGlowCursor from '../../vendor/animations/glow-cursor/GlowCursor';
import { GLOW_CURSOR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './glow-cursor.css';

export type GlowCursorProps = {
  color?: (typeof GLOW_CURSOR_DEFAULTS)['color'];
  secondaryColor?: (typeof GLOW_CURSOR_DEFAULTS)['secondaryColor'];
  trailLength?: (typeof GLOW_CURSOR_DEFAULTS)['trailLength'];
  trailWidth?: (typeof GLOW_CURSOR_DEFAULTS)['trailWidth'];
  trailTaper?: (typeof GLOW_CURSOR_DEFAULTS)['trailTaper'];
  followSpeed?: (typeof GLOW_CURSOR_DEFAULTS)['followSpeed'];
  glowIntensity?: (typeof GLOW_CURSOR_DEFAULTS)['glowIntensity'];
  glowSpread?: (typeof GLOW_CURSOR_DEFAULTS)['glowSpread'];
  hotspot?: (typeof GLOW_CURSOR_DEFAULTS)['hotspot'];
  brightness?: (typeof GLOW_CURSOR_DEFAULTS)['brightness'];
  opacity?: (typeof GLOW_CURSOR_DEFAULTS)['opacity'];
  pulseSpeed?: (typeof GLOW_CURSOR_DEFAULTS)['pulseSpeed'];
  noiseStrength?: (typeof GLOW_CURSOR_DEFAULTS)['noiseStrength'];
  idleFade?: (typeof GLOW_CURSOR_DEFAULTS)['idleFade'];
  idleTimeout?: (typeof GLOW_CURSOR_DEFAULTS)['idleTimeout'];
  fadeDuration?: (typeof GLOW_CURSOR_DEFAULTS)['fadeDuration'];
  blendMode?: (typeof GLOW_CURSOR_DEFAULTS)['blendMode'];
  maxDevicePixelRatio?: (typeof GLOW_CURSOR_DEFAULTS)['maxDevicePixelRatio'];
  enabled?: (typeof GLOW_CURSOR_DEFAULTS)['enabled'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[4];

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function GlowCursor({
  color = GLOW_CURSOR_DEFAULTS.color,
  secondaryColor = GLOW_CURSOR_DEFAULTS.secondaryColor,
  trailLength = GLOW_CURSOR_DEFAULTS.trailLength,
  trailWidth = GLOW_CURSOR_DEFAULTS.trailWidth,
  trailTaper = GLOW_CURSOR_DEFAULTS.trailTaper,
  followSpeed = GLOW_CURSOR_DEFAULTS.followSpeed,
  glowIntensity = GLOW_CURSOR_DEFAULTS.glowIntensity,
  glowSpread = GLOW_CURSOR_DEFAULTS.glowSpread,
  hotspot = GLOW_CURSOR_DEFAULTS.hotspot,
  brightness = GLOW_CURSOR_DEFAULTS.brightness,
  opacity = GLOW_CURSOR_DEFAULTS.opacity,
  pulseSpeed = GLOW_CURSOR_DEFAULTS.pulseSpeed,
  noiseStrength = GLOW_CURSOR_DEFAULTS.noiseStrength,
  idleFade = GLOW_CURSOR_DEFAULTS.idleFade,
  idleTimeout = GLOW_CURSOR_DEFAULTS.idleTimeout,
  fadeDuration = GLOW_CURSOR_DEFAULTS.fadeDuration,
  blendMode = GLOW_CURSOR_DEFAULTS.blendMode,
  maxDevicePixelRatio = GLOW_CURSOR_DEFAULTS.maxDevicePixelRatio,
  enabled = GLOW_CURSOR_DEFAULTS.enabled,
  reducedMotion = GLOW_CURSOR_DEFAULTS.reducedMotion,
}: GlowCursorProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Glow Cursor"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An OGL shader samples a chain of {trailLength} points that ease
              toward the pointer. The head uses followSpeed <code>{followSpeed}</code>.
              Color is brand accent blue; upstream was <code>#67E8F9</code>.
              Secondary color is accent yellow; upstream was <code>#A78BFA</code>.
            </>
          }
          controls="Pause holds the last trail. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused and onReady are local. Pointer listeners bind to the glow host. The caption is Street from src/pages/content.ts."
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
      stageClassName="rb-frame__stage--ink glow-cursor-stage"
      stageTestId="glow-cursor-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-enabled': reduce ? 'false' : enabled ? 'true' : 'false',
      }}
    >
      <UpstreamGlowCursor
        key={run}
        className="glow-cursor-host"
        color={color}
        secondaryColor={secondaryColor}
        trailLength={trailLength}
        trailWidth={trailWidth}
        trailTaper={trailTaper}
        followSpeed={followSpeed}
        glowIntensity={glowIntensity}
        glowSpread={glowSpread}
        hotspot={hotspot}
        brightness={brightness}
        opacity={opacity}
        pulseSpeed={reduce ? 0 : pulseSpeed}
        noiseStrength={reduce ? 0 : noiseStrength}
        idleFade={idleFade}
        idleTimeout={idleTimeout}
        fadeDuration={reduce ? 0 : fadeDuration}
        blendMode={blendMode}
        maxDevicePixelRatio={maxDevicePixelRatio}
        enabled={reduce ? false : enabled}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
      >
        <div className="glow-cursor-copy">
          <p className="glow-cursor-kicker">{CARD.kicker}</p>
          <p className="glow-cursor-title">{CARD.title}</p>
          <p>{CARD.copy}</p>
        </div>
      </UpstreamGlowCursor>
    </ReactBitsFrame>
  );
}
