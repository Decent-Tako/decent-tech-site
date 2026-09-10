import { useRef, useState } from 'react';

import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamParticleText from '../../vendor/text-animations/particle-text/ParticleText';
import { PARTICLE_TEXT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './particle-text.css';

export type ParticleTextProps = {
  text?: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  trigger?: (typeof PARTICLE_TEXT_DEFAULTS)['trigger'];
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  glow?: boolean;
  reducedMotion?: ReducedMotionMode;
};

function probeCanvas(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    return canvas.getContext('2d') ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function ParticleText({
  text = PARTICLE_TEXT_DEFAULTS.text,
  particleSize = PARTICLE_TEXT_DEFAULTS.particleSize,
  density = PARTICLE_TEXT_DEFAULTS.density,
  color = PARTICLE_TEXT_DEFAULTS.color,
  highlightColor = PARTICLE_TEXT_DEFAULTS.highlightColor,
  scatter = PARTICLE_TEXT_DEFAULTS.scatter,
  gatherDuration = PARTICLE_TEXT_DEFAULTS.gatherDuration,
  stagger = PARTICLE_TEXT_DEFAULTS.stagger,
  pointerRepel = PARTICLE_TEXT_DEFAULTS.pointerRepel,
  repelRadius = PARTICLE_TEXT_DEFAULTS.repelRadius,
  idleDrift = PARTICLE_TEXT_DEFAULTS.idleDrift,
  trigger = PARTICLE_TEXT_DEFAULTS.trigger,
  fontSize = PARTICLE_TEXT_DEFAULTS.fontSize,
  fontWeight = PARTICLE_TEXT_DEFAULTS.fontWeight,
  fontFamily = PARTICLE_TEXT_DEFAULTS.fontFamily,
  glow = PARTICLE_TEXT_DEFAULTS.glow,
  reducedMotion = PARTICLE_TEXT_DEFAULTS.reducedMotion,
}: ParticleTextProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(() => probeCanvas());
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Particle Text"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A 2D canvas samples the glyphs and draws each opaque pixel as a
              particle. The swarm gathers over <code>{gatherDuration}</code> ms.
              Trigger <code>{trigger}</code>. Pointer repel is{' '}
              <code>{pointerRepel}</code> px.
            </>
          }
          controls="Pause holds the draw loop. Replay remounts the canvas."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The copy is the Week 0 title from src/pages/content.ts. className, style, paused, reduced, and onReady are not controls. color is ink; upstream default #ffffff. highlightColor is accent blue; upstream default #8b5cf6. fontFamily is Brand Sans; upstream inherit. fontWeight is 700; upstream 800. The 2D canvas fallback uses the frame WebGL unavailable path."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeCanvas());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageRef={stageRef}
      stageTestId="particle-text-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-ready': webgl === 'ready' ? 'true' : 'false',
        'data-copy': text,
        'data-trigger': trigger,
      }}
    >
      {webgl === 'unavailable' ? null : (
        <UpstreamParticleText
          key={run}
          text={text}
          particleSize={particleSize}
          density={density}
          color={color}
          highlightColor={highlightColor}
          scatter={reduce ? 0 : scatter}
          gatherDuration={reduce ? 1 : gatherDuration}
          stagger={reduce ? 0 : stagger}
          pointerRepel={reduce ? 0 : pointerRepel}
          repelRadius={repelRadius}
          idleDrift={reduce ? 0 : idleDrift}
          trigger={trigger}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontFamily={fontFamily}
          glow={reduce ? false : glow}
          paused={paused}
          reduced={reduce}
          onReady={() => setWebgl('ready')}
        />
      )}
    </ReactBitsFrame>
  );
}
