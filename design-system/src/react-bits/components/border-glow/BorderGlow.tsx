import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamBorderGlow from '../../vendor/components/border-glow/BorderGlow';
import { BORDER_GLOW_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './border-glow.css';

export type BorderGlowProps = {
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function BorderGlow({
  edgeSensitivity = BORDER_GLOW_DEFAULTS.edgeSensitivity,
  glowColor = BORDER_GLOW_DEFAULTS.glowColor,
  backgroundColor = BORDER_GLOW_DEFAULTS.backgroundColor,
  borderRadius = BORDER_GLOW_DEFAULTS.borderRadius,
  glowRadius = BORDER_GLOW_DEFAULTS.glowRadius,
  glowIntensity = BORDER_GLOW_DEFAULTS.glowIntensity,
  coneSpread = BORDER_GLOW_DEFAULTS.coneSpread,
  animated = BORDER_GLOW_DEFAULTS.animated,
  colors = BORDER_GLOW_DEFAULTS.colors,
  fillOpacity = BORDER_GLOW_DEFAULTS.fillOpacity,
  reducedMotion = BORDER_GLOW_DEFAULTS.reducedMotion,
}: BorderGlowProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Border Glow"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Pointer position on the card sets <code>--cursor-angle</code> and{' '}
              <code>--edge-proximity</code>. CSS conic masks light a mesh-gradient
              border toward the pointer. With <code>animated</code> a sweep runs
              once on mount.
            </>
          }
          controls="Pause ignores pointer moves and skips the mount sweep. Replay remounts the card."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The card holds the Week 0 feature from src/pages/content.ts. children and className are not controls. Colour defaults use brand tokens. Upstream glowColor 40 80 80, background #120F17, colors #c084fc #f472b6 #38bdf8."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="border-glow-stage"
      stageClassName="rb-frame__stage--ink"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-animated': animated ? 'true' : 'false',
      }}
    >
      <UpstreamBorderGlow
        key={run}
        edgeSensitivity={edgeSensitivity}
        glowColor={glowColor}
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        glowRadius={glowRadius}
        glowIntensity={glowIntensity}
        coneSpread={coneSpread}
        animated={reduce ? false : animated}
        colors={colors}
        fillOpacity={fillOpacity}
        paused={paused}
      >
        <img
          className="border-glow__photo"
          src={CARD.photo.src}
          alt={CARD.photo.alt}
          width={640}
          height={400}
        />
        <p className="border-glow__kicker">{CARD.kicker}</p>
        <p className="border-glow__title">{CARD.title}</p>
        <p className="border-glow__copy">{CARD.copy}</p>
      </UpstreamBorderGlow>
    </ReactBitsFrame>
  );
}
