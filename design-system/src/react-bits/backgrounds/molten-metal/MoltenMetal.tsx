import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMoltenMetal, {
  type MoltenMetalColorMode,
} from '../../vendor/backgrounds/molten-metal/MoltenMetal';
import { MOLTEN_METAL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './molten-metal.css';

export type MoltenMetalProps = {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  colorMode?: MoltenMetalColorMode;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  opacity?: number;
  backgroundColor?: string;
  lightMode?: boolean;
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

const CARD = FEATURES[0];

export function MoltenMetal({
  color1 = MOLTEN_METAL_DEFAULTS.color1,
  color2 = MOLTEN_METAL_DEFAULTS.color2,
  color3 = MOLTEN_METAL_DEFAULTS.color3,
  speed = MOLTEN_METAL_DEFAULTS.speed,
  scale = MOLTEN_METAL_DEFAULTS.scale,
  detail = MOLTEN_METAL_DEFAULTS.detail,
  glow = MOLTEN_METAL_DEFAULTS.glow,
  coreSize = MOLTEN_METAL_DEFAULTS.coreSize,
  swirl = MOLTEN_METAL_DEFAULTS.swirl,
  fold = MOLTEN_METAL_DEFAULTS.fold,
  blackPoint = MOLTEN_METAL_DEFAULTS.blackPoint,
  brightness = MOLTEN_METAL_DEFAULTS.brightness,
  colorMode = MOLTEN_METAL_DEFAULTS.colorMode,
  grain = MOLTEN_METAL_DEFAULTS.grain,
  grainIntensity = MOLTEN_METAL_DEFAULTS.grainIntensity,
  mouseInteraction = MOLTEN_METAL_DEFAULTS.mouseInteraction,
  mouseStrength = MOLTEN_METAL_DEFAULTS.mouseStrength,
  opacity = MOLTEN_METAL_DEFAULTS.opacity,
  backgroundColor = MOLTEN_METAL_DEFAULTS.backgroundColor,
  lightMode = MOLTEN_METAL_DEFAULTS.lightMode,
  reducedMotion = MOLTEN_METAL_DEFAULTS.reducedMotion,
}: MoltenMetalProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl2);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Molten Metal"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl WebGL 2 fragment shader. A fold matrix warps UV around a
              glow core. Three colour stops mix by intensity. Pointer drift
              shifts the field.
            </>
          }
          controls="Pause holds iTime after a short warm-up. Replay remounts the sketch. Reduced motion sets speed to 0 and holds time."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onReady, and onError are not controls. Colour defaults are brand tokens: #0035B1, #DEF54F, #FFFFFF (upstream #5227FF, #FF9FFC, #FFFFFF). The caption is the Start card from src/pages/content.ts. preserveDrawingBuffer is on so play can sample the canvas."
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
      stageTestId="molten-metal-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-speed': String(motionSpeed),
        'data-mode': colorMode,
      }}
    >
      <div className="molten-metal-fill">
        <UpstreamMoltenMetal
          key={run}
          color1={color1}
          color2={color2}
          color3={color3}
          speed={motionSpeed}
          scale={scale}
          detail={detail}
          glow={glow}
          coreSize={coreSize}
          swirl={swirl}
          fold={fold}
          blackPoint={blackPoint}
          brightness={brightness}
          colorMode={colorMode}
          grain={grain}
          grainIntensity={grainIntensity}
          mouseInteraction={mouseInteraction}
          mouseStrength={mouseStrength}
          opacity={opacity}
          backgroundColor={backgroundColor}
          lightMode={lightMode}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onError={() => setWebgl('unavailable')}
        />
      </div>
      <p className="molten-metal__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
