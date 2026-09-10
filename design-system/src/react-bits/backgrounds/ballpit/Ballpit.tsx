import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamBallpit from '../../vendor/backgrounds/ballpit/Ballpit';
import { BALLPIT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './ballpit.css';

export type BallpitProps = {
  followCursor?: boolean;
  count?: number;
  colors?: string[];
  ambientColor?: string;
  ambientIntensity?: number;
  lightIntensity?: number;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  maxVelocity?: number;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const CARD = FEATURES[4];

export function Ballpit({
  followCursor = BALLPIT_DEFAULTS.followCursor,
  count = BALLPIT_DEFAULTS.count,
  colors = BALLPIT_DEFAULTS.colors,
  ambientColor = BALLPIT_DEFAULTS.ambientColor,
  ambientIntensity = BALLPIT_DEFAULTS.ambientIntensity,
  lightIntensity = BALLPIT_DEFAULTS.lightIntensity,
  minSize = BALLPIT_DEFAULTS.minSize,
  maxSize = BALLPIT_DEFAULTS.maxSize,
  size0 = BALLPIT_DEFAULTS.size0,
  gravity = BALLPIT_DEFAULTS.gravity,
  friction = BALLPIT_DEFAULTS.friction,
  wallBounce = BALLPIT_DEFAULTS.wallBounce,
  maxVelocity = BALLPIT_DEFAULTS.maxVelocity,
  reducedMotion = BALLPIT_DEFAULTS.reducedMotion,
}: BallpitProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Ballpit"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Instanced three.js spheres with a custom physical material. Gravity,
              walls, and the pointer pull a control sphere through the pit.
            </>
          }
          controls="Pause holds the physics step. Replay remounts the pit. Reduced motion holds physics."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="className, paused, onReady, onError, maxX, maxY, maxZ, controlSphere0, and materialParams are not controls. Colour defaults are brand tokens accent-blue, accent-yellow, and paper (upstream [0, 0, 0]). Count default is 80 so the story stays light; upstream XConfig uses 200. The caption is the Street card from src/pages/content.ts."
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
      stageTestId="ballpit-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-count': String(count),
      }}
    >
      <UpstreamBallpit
        key={run}
        className="ballpit-fill"
        followCursor={followCursor}
        count={count}
        colors={colors}
        ambientColor={ambientColor}
        ambientIntensity={ambientIntensity}
        lightIntensity={lightIntensity}
        minSize={minSize}
        maxSize={maxSize}
        size0={size0}
        gravity={reduce ? 0 : gravity}
        friction={friction}
        wallBounce={wallBounce}
        maxVelocity={maxVelocity}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onError={() => setWebgl('unavailable')}
      />
      <p className="ballpit__caption">
        {CARD.kicker} {CARD.title}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
