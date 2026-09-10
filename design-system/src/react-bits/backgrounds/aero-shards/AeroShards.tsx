import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamAeroShards from '../../vendor/backgrounds/aero-shards/AeroShards';
import { AERO_SHARDS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './aero-shards.css';

export type AeroShardsProps = {
  backgroundColor?: string;
  shardColor?: string;
  accentColor?: string;
  placement?: (typeof AERO_SHARDS_DEFAULTS)['placement'];
  flow?: (typeof AERO_SHARDS_DEFAULTS)['flow'];
  rippleIntensity?: number;
  holdToGather?: boolean;
  material?: (typeof AERO_SHARDS_DEFAULTS)['material'];
  detail?: (typeof AERO_SHARDS_DEFAULTS)['detail'];
  effect?: (typeof AERO_SHARDS_DEFAULTS)['effect'];
  scale?: number;
  spread?: number;
  depth?: number;
  speed?: number;
  spin?: number;
  interaction?: (typeof AERO_SHARDS_DEFAULTS)['interaction'];
  density?: number;
  shardSize?: number;
  stretch?: number;
  turbulence?: number;
  glow?: number;
  edgeSoftness?: number;
  bloom?: number;
  grain?: number;
  chromaticAberration?: number;
  transitionDuration?: number;
  interactionRadius?: number;
  interactionStrength?: number;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgpu(): WebglState {
  try {
    return 'gpu' in navigator && navigator.gpu ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[1];

export function AeroShards({
  backgroundColor = AERO_SHARDS_DEFAULTS.backgroundColor,
  shardColor = AERO_SHARDS_DEFAULTS.shardColor,
  accentColor = AERO_SHARDS_DEFAULTS.accentColor,
  placement = AERO_SHARDS_DEFAULTS.placement,
  flow = AERO_SHARDS_DEFAULTS.flow,
  rippleIntensity = AERO_SHARDS_DEFAULTS.rippleIntensity,
  holdToGather = AERO_SHARDS_DEFAULTS.holdToGather,
  material = AERO_SHARDS_DEFAULTS.material,
  detail = AERO_SHARDS_DEFAULTS.detail,
  effect = AERO_SHARDS_DEFAULTS.effect,
  scale = AERO_SHARDS_DEFAULTS.scale,
  spread = AERO_SHARDS_DEFAULTS.spread,
  depth = AERO_SHARDS_DEFAULTS.depth,
  speed = AERO_SHARDS_DEFAULTS.speed,
  spin = AERO_SHARDS_DEFAULTS.spin,
  interaction = AERO_SHARDS_DEFAULTS.interaction,
  density = AERO_SHARDS_DEFAULTS.density,
  shardSize = AERO_SHARDS_DEFAULTS.shardSize,
  stretch = AERO_SHARDS_DEFAULTS.stretch,
  turbulence = AERO_SHARDS_DEFAULTS.turbulence,
  glow = AERO_SHARDS_DEFAULTS.glow,
  edgeSoftness = AERO_SHARDS_DEFAULTS.edgeSoftness,
  bloom = AERO_SHARDS_DEFAULTS.bloom,
  grain = AERO_SHARDS_DEFAULTS.grain,
  chromaticAberration = AERO_SHARDS_DEFAULTS.chromaticAberration,
  transitionDuration = AERO_SHARDS_DEFAULTS.transitionDuration,
  interactionRadius = AERO_SHARDS_DEFAULTS.interactionRadius,
  interactionStrength = AERO_SHARDS_DEFAULTS.interactionStrength,
  reducedMotion = AERO_SHARDS_DEFAULTS.reducedMotion,
}: AeroShardsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgpu);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Aero Shards"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A WebGPU shard field through <code>vgpu</code>. Placement, flow, and pointer
              repel or attract the foil. Needs a GPU device.
            </>
          }
          controls="Pause holds the shard clock. Replay remounts the sketch. Reduced motion sets speed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onError, and onReady are not controls. Colour defaults are brand tokens: background ink #212121 (upstream #120F17), shard paper #FFFFFF (upstream #896ABD), accent-blue #0035B1 (upstream #A855F7). The caption is the Learn card from src/pages/content.ts. Headless Chromium without WebGPU uses the fallback paragraph."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeWebgpu());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="aero-shards-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
      }}
    >
      <UpstreamAeroShards
        key={run}
        className="aero-shards-fill"
        backgroundColor={backgroundColor}
        shardColor={shardColor}
        accentColor={accentColor}
        placement={placement}
        flow={flow}
        rippleIntensity={rippleIntensity}
        holdToGather={holdToGather}
        material={material}
        detail={detail}
        effect={effect}
        scale={scale}
        spread={spread}
        depth={depth}
        speed={motionSpeed}
        spin={spin}
        interaction={interaction}
        density={density}
        shardSize={shardSize}
        stretch={stretch}
        turbulence={turbulence}
        glow={glow}
        edgeSoftness={edgeSoftness}
        bloom={bloom}
        grain={grain}
        chromaticAberration={chromaticAberration}
        transitionDuration={transitionDuration}
        interactionRadius={interactionRadius}
        interactionStrength={interactionStrength}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onError={() => setWebgl('unavailable')}
      />
      <p className="aero-shards__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[1].label} {HERO.facts[1].value}.
      </p>
    </ReactBitsFrame>
  );
}
