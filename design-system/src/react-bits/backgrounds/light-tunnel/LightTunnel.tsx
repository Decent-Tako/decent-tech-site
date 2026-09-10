import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamLightTunnel, { type FlowDirection } from '../../vendor/backgrounds/light-tunnel/LightTunnel';
import { LIGHT_TUNNEL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './light-tunnel.css';

export type LightTunnelProps = {
  cableColor?: string;
  pulseColor?: string;
  tunnelColor?: string;
  tunnelOpacity?: number;
  speed?: number;
  flowDirection?: FlowDirection;
  pulseSpeed?: number;
  pulseLength?: number;
  pulseBlend?: number;
  pulseWidth?: number;
  cableCount?: number;
  thickness?: number;
  rimWidth?: number;
  waviness?: number;
  sway?: number;
  size?: number;
  centerX?: number;
  centerY?: number;
  glow?: number;
  fadeNear?: number;
  fadeFar?: number;
  brightness?: number;
  colorVariance?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  lightMode?: boolean;
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

const CARD = FEATURES[1];

export function LightTunnel({
  cableColor = LIGHT_TUNNEL_DEFAULTS.cableColor,
  pulseColor = LIGHT_TUNNEL_DEFAULTS.pulseColor,
  tunnelColor = LIGHT_TUNNEL_DEFAULTS.tunnelColor,
  tunnelOpacity = LIGHT_TUNNEL_DEFAULTS.tunnelOpacity,
  speed = LIGHT_TUNNEL_DEFAULTS.speed,
  flowDirection = LIGHT_TUNNEL_DEFAULTS.flowDirection,
  pulseSpeed = LIGHT_TUNNEL_DEFAULTS.pulseSpeed,
  pulseLength = LIGHT_TUNNEL_DEFAULTS.pulseLength,
  pulseBlend = LIGHT_TUNNEL_DEFAULTS.pulseBlend,
  pulseWidth = LIGHT_TUNNEL_DEFAULTS.pulseWidth,
  cableCount = LIGHT_TUNNEL_DEFAULTS.cableCount,
  thickness = LIGHT_TUNNEL_DEFAULTS.thickness,
  rimWidth = LIGHT_TUNNEL_DEFAULTS.rimWidth,
  waviness = LIGHT_TUNNEL_DEFAULTS.waviness,
  sway = LIGHT_TUNNEL_DEFAULTS.sway,
  size = LIGHT_TUNNEL_DEFAULTS.size,
  centerX = LIGHT_TUNNEL_DEFAULTS.centerX,
  centerY = LIGHT_TUNNEL_DEFAULTS.centerY,
  glow = LIGHT_TUNNEL_DEFAULTS.glow,
  fadeNear = LIGHT_TUNNEL_DEFAULTS.fadeNear,
  fadeFar = LIGHT_TUNNEL_DEFAULTS.fadeFar,
  brightness = LIGHT_TUNNEL_DEFAULTS.brightness,
  colorVariance = LIGHT_TUNNEL_DEFAULTS.colorVariance,
  grain = LIGHT_TUNNEL_DEFAULTS.grain,
  grainIntensity = LIGHT_TUNNEL_DEFAULTS.grainIntensity,
  opacity = LIGHT_TUNNEL_DEFAULTS.opacity,
  mouseInteraction = LIGHT_TUNNEL_DEFAULTS.mouseInteraction,
  mouseStrength = LIGHT_TUNNEL_DEFAULTS.mouseStrength,
  lightMode = LIGHT_TUNNEL_DEFAULTS.lightMode,
  reducedMotion = LIGHT_TUNNEL_DEFAULTS.reducedMotion,
}: LightTunnelProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Light Tunnel"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 full-screen triangle. Polar cables scroll{' '}
              <code>{flowDirection}</code> with pulse colour{' '}
              <code>{pulseColor}</code>. The pointer offsets the centre.
            </>
          }
          controls="Pause holds iTime. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onReady, and onError are not controls. Colour defaults are brand tokens: cableColor accent-blue #0035B1 (upstream #A855F7), pulseColor accent-yellow #DEF54F (upstream #A855F7), tunnelColor ink #212121 (upstream #5227FF). The caption is the Six weeks card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageClassName="rb-frame__stage--ink"
      stageTestId="light-tunnel-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <div className="light-tunnel-fill">
        <UpstreamLightTunnel
          key={run}
          cableColor={cableColor}
          pulseColor={pulseColor}
          tunnelColor={tunnelColor}
          tunnelOpacity={tunnelOpacity}
          speed={motionSpeed}
          flowDirection={flowDirection}
          pulseSpeed={pulseSpeed}
          pulseLength={pulseLength}
          pulseBlend={pulseBlend}
          pulseWidth={pulseWidth}
          cableCount={cableCount}
          thickness={thickness}
          rimWidth={rimWidth}
          waviness={waviness}
          sway={sway}
          size={size}
          centerX={centerX}
          centerY={centerY}
          glow={glow}
          fadeNear={fadeNear}
          fadeFar={fadeFar}
          brightness={brightness}
          colorVariance={colorVariance}
          grain={grain}
          grainIntensity={grainIntensity}
          opacity={opacity}
          mouseInteraction={mouseInteraction}
          mouseStrength={mouseStrength}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="light-tunnel__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
