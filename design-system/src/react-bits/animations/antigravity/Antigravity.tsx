import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamAntigravity from '../../vendor/animations/antigravity/Antigravity';
import { ANTIGRAVITY_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './antigravity.css';

export type AntigravityProps = {
  count?: (typeof ANTIGRAVITY_DEFAULTS)['count'];
  magnetRadius?: (typeof ANTIGRAVITY_DEFAULTS)['magnetRadius'];
  ringRadius?: (typeof ANTIGRAVITY_DEFAULTS)['ringRadius'];
  waveSpeed?: (typeof ANTIGRAVITY_DEFAULTS)['waveSpeed'];
  waveAmplitude?: (typeof ANTIGRAVITY_DEFAULTS)['waveAmplitude'];
  particleSize?: (typeof ANTIGRAVITY_DEFAULTS)['particleSize'];
  lerpSpeed?: (typeof ANTIGRAVITY_DEFAULTS)['lerpSpeed'];
  color?: (typeof ANTIGRAVITY_DEFAULTS)['color'];
  autoAnimate?: (typeof ANTIGRAVITY_DEFAULTS)['autoAnimate'];
  particleVariance?: (typeof ANTIGRAVITY_DEFAULTS)['particleVariance'];
  rotationSpeed?: (typeof ANTIGRAVITY_DEFAULTS)['rotationSpeed'];
  depthFactor?: (typeof ANTIGRAVITY_DEFAULTS)['depthFactor'];
  pulseSpeed?: (typeof ANTIGRAVITY_DEFAULTS)['pulseSpeed'];
  particleShape?: (typeof ANTIGRAVITY_DEFAULTS)['particleShape'];
  fieldStrength?: (typeof ANTIGRAVITY_DEFAULTS)['fieldStrength'];
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

export function Antigravity({
  count = ANTIGRAVITY_DEFAULTS.count,
  magnetRadius = ANTIGRAVITY_DEFAULTS.magnetRadius,
  ringRadius = ANTIGRAVITY_DEFAULTS.ringRadius,
  waveSpeed = ANTIGRAVITY_DEFAULTS.waveSpeed,
  waveAmplitude = ANTIGRAVITY_DEFAULTS.waveAmplitude,
  particleSize = ANTIGRAVITY_DEFAULTS.particleSize,
  lerpSpeed = ANTIGRAVITY_DEFAULTS.lerpSpeed,
  color = ANTIGRAVITY_DEFAULTS.color,
  autoAnimate = ANTIGRAVITY_DEFAULTS.autoAnimate,
  particleVariance = ANTIGRAVITY_DEFAULTS.particleVariance,
  rotationSpeed = ANTIGRAVITY_DEFAULTS.rotationSpeed,
  depthFactor = ANTIGRAVITY_DEFAULTS.depthFactor,
  pulseSpeed = ANTIGRAVITY_DEFAULTS.pulseSpeed,
  particleShape = ANTIGRAVITY_DEFAULTS.particleShape,
  fieldStrength = ANTIGRAVITY_DEFAULTS.fieldStrength,
  reducedMotion = ANTIGRAVITY_DEFAULTS.reducedMotion,
}: AntigravityProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Antigravity"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A three.js <code>InstancedMesh</code> of {count} {particleShape} particles
              sits in a perspective view. Instances inside magnet radius{' '}
              <code>{magnetRadius}</code> lerp onto a ring of radius <code>{ringRadius}</code>{' '}
              around the pointer, with wave <code>{waveSpeed}</code> and pulse{' '}
              <code>{pulseSpeed}</code>. Colour is brand accent yellow; upstream was{' '}
              <code>#FF9FFC</code>.
            </>
          }
          controls="Pause stops the frame loop and keeps the last frame. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused, onReady, and onUnavailable are local. The sketch uses a three.js renderer instead of @react-three/fiber so JSX types do not collide with HTML tags. preserveDrawingBuffer is on so the play can read pixels. The caption is the Learn card from src/pages/content.ts."
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
      stageClassName="rb-frame__stage--ink antigravity-stage"
      stageTestId="antigravity-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-shape': particleShape,
      }}
    >
      <div className="antigravity-host">
        <UpstreamAntigravity
          key={run}
          count={count}
          magnetRadius={magnetRadius}
          ringRadius={ringRadius}
          waveSpeed={waveSpeed}
          waveAmplitude={waveAmplitude}
          particleSize={particleSize}
          lerpSpeed={lerpSpeed}
          color={color}
          autoAnimate={reduce ? false : autoAnimate}
          particleVariance={particleVariance}
          rotationSpeed={reduce ? 0 : rotationSpeed}
          depthFactor={depthFactor}
          pulseSpeed={pulseSpeed}
          particleShape={particleShape}
          fieldStrength={fieldStrength}
          paused={paused || reduce}
          onReady={() => setWebgl('ready')}
          onUnavailable={() => setWebgl('unavailable')}
        />
        <p className="antigravity-copy">
          {CARD.kicker}. {CARD.title}. {CARD.copy}
        </p>
      </div>
    </ReactBitsFrame>
  );
}
