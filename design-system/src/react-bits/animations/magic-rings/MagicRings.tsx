import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMagicRings from '../../vendor/animations/magic-rings/MagicRings';
import { MAGIC_RINGS_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './magic-rings.css';

export type MagicRingsProps = {
  color?: (typeof MAGIC_RINGS_DEFAULTS)['color'];
  colorTwo?: (typeof MAGIC_RINGS_DEFAULTS)['colorTwo'];
  speed?: (typeof MAGIC_RINGS_DEFAULTS)['speed'];
  ringCount?: (typeof MAGIC_RINGS_DEFAULTS)['ringCount'];
  attenuation?: (typeof MAGIC_RINGS_DEFAULTS)['attenuation'];
  lineThickness?: (typeof MAGIC_RINGS_DEFAULTS)['lineThickness'];
  baseRadius?: (typeof MAGIC_RINGS_DEFAULTS)['baseRadius'];
  radiusStep?: (typeof MAGIC_RINGS_DEFAULTS)['radiusStep'];
  scaleRate?: (typeof MAGIC_RINGS_DEFAULTS)['scaleRate'];
  opacity?: (typeof MAGIC_RINGS_DEFAULTS)['opacity'];
  blur?: (typeof MAGIC_RINGS_DEFAULTS)['blur'];
  noiseAmount?: (typeof MAGIC_RINGS_DEFAULTS)['noiseAmount'];
  rotation?: (typeof MAGIC_RINGS_DEFAULTS)['rotation'];
  ringGap?: (typeof MAGIC_RINGS_DEFAULTS)['ringGap'];
  fadeIn?: (typeof MAGIC_RINGS_DEFAULTS)['fadeIn'];
  fadeOut?: (typeof MAGIC_RINGS_DEFAULTS)['fadeOut'];
  followMouse?: (typeof MAGIC_RINGS_DEFAULTS)['followMouse'];
  mouseInfluence?: (typeof MAGIC_RINGS_DEFAULTS)['mouseInfluence'];
  hoverScale?: (typeof MAGIC_RINGS_DEFAULTS)['hoverScale'];
  parallax?: (typeof MAGIC_RINGS_DEFAULTS)['parallax'];
  clickBurst?: (typeof MAGIC_RINGS_DEFAULTS)['clickBurst'];
  alphaMode?: (typeof MAGIC_RINGS_DEFAULTS)['alphaMode'];
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[2];

export function MagicRings({
  color = MAGIC_RINGS_DEFAULTS.color,
  colorTwo = MAGIC_RINGS_DEFAULTS.colorTwo,
  speed = MAGIC_RINGS_DEFAULTS.speed,
  ringCount = MAGIC_RINGS_DEFAULTS.ringCount,
  attenuation = MAGIC_RINGS_DEFAULTS.attenuation,
  lineThickness = MAGIC_RINGS_DEFAULTS.lineThickness,
  baseRadius = MAGIC_RINGS_DEFAULTS.baseRadius,
  radiusStep = MAGIC_RINGS_DEFAULTS.radiusStep,
  scaleRate = MAGIC_RINGS_DEFAULTS.scaleRate,
  opacity = MAGIC_RINGS_DEFAULTS.opacity,
  blur = MAGIC_RINGS_DEFAULTS.blur,
  noiseAmount = MAGIC_RINGS_DEFAULTS.noiseAmount,
  rotation = MAGIC_RINGS_DEFAULTS.rotation,
  ringGap = MAGIC_RINGS_DEFAULTS.ringGap,
  fadeIn = MAGIC_RINGS_DEFAULTS.fadeIn,
  fadeOut = MAGIC_RINGS_DEFAULTS.fadeOut,
  followMouse = MAGIC_RINGS_DEFAULTS.followMouse,
  mouseInfluence = MAGIC_RINGS_DEFAULTS.mouseInfluence,
  hoverScale = MAGIC_RINGS_DEFAULTS.hoverScale,
  parallax = MAGIC_RINGS_DEFAULTS.parallax,
  clickBurst = MAGIC_RINGS_DEFAULTS.clickBurst,
  alphaMode = MAGIC_RINGS_DEFAULTS.alphaMode,
  reducedMotion = MAGIC_RINGS_DEFAULTS.reducedMotion,
}: MagicRingsProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Magic Rings"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js shader draws {ringCount} expanding rings from radius{' '}
              <code>{baseRadius}</code>. Colour is brand accent yellow; upstream
              was <code>#fc42ff</code>. The second colour is brand accent blue;
              upstream was <code>#42fcff</code>.
            </>
          }
          controls="Pause stops the frame loop and keeps the last frame. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onUnavailable are local. preserveDrawingBuffer is on so the play can read pixels. Pointer listeners sit on the mount. The caption is the Tools card from src/pages/content.ts."
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
      stageClassName="rb-frame__stage--ink magic-rings-stage"
      stageTestId="magic-rings-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-follow': followMouse ? 'true' : 'false',
        'data-alpha': alphaMode,
      }}
    >
      <UpstreamMagicRings
        key={run}
        color={color}
        colorTwo={colorTwo}
        speed={reduce ? 0 : speed}
        ringCount={ringCount}
        attenuation={attenuation}
        lineThickness={lineThickness}
        baseRadius={baseRadius}
        radiusStep={radiusStep}
        scaleRate={scaleRate}
        opacity={opacity}
        blur={blur}
        noiseAmount={noiseAmount}
        rotation={rotation}
        ringGap={ringGap}
        fadeIn={fadeIn}
        fadeOut={fadeOut}
        followMouse={followMouse}
        mouseInfluence={mouseInfluence}
        hoverScale={hoverScale}
        parallax={parallax}
        clickBurst={reduce ? false : clickBurst}
        alphaMode={alphaMode}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onUnavailable={() => setWebgl('unavailable')}
      />
      <p className="magic-rings-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
