import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDriftWall from '../../vendor/components/drift-wall/DriftWall';
import { DRIFT_WALL_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './drift-wall.css';

export type DriftWallProps = {
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = [0, 1, 2].flatMap((copy) =>
  FEATURES.map((feature) => ({
    image: feature.photo.src,
    title: copy === 0 ? feature.title : `${feature.title} ${copy + 1}`,
  })),
);

export function DriftWall({
  columns = DRIFT_WALL_DEFAULTS.columns,
  tileWidth = DRIFT_WALL_DEFAULTS.tileWidth,
  tileHeight = DRIFT_WALL_DEFAULTS.tileHeight,
  gap = DRIFT_WALL_DEFAULTS.gap,
  radius = DRIFT_WALL_DEFAULTS.radius,
  tilt = DRIFT_WALL_DEFAULTS.tilt,
  turn = DRIFT_WALL_DEFAULTS.turn,
  roll = DRIFT_WALL_DEFAULTS.roll,
  perspective = DRIFT_WALL_DEFAULTS.perspective,
  depth = DRIFT_WALL_DEFAULTS.depth,
  speed = DRIFT_WALL_DEFAULTS.speed,
  direction = DRIFT_WALL_DEFAULTS.direction,
  variance = DRIFT_WALL_DEFAULTS.variance,
  parallax = DRIFT_WALL_DEFAULTS.parallax,
  pauseOnHover = DRIFT_WALL_DEFAULTS.pauseOnHover,
  lift = DRIFT_WALL_DEFAULTS.lift,
  fade = DRIFT_WALL_DEFAULTS.fade,
  dim = DRIFT_WALL_DEFAULTS.dim,
  grayscale = DRIFT_WALL_DEFAULTS.grayscale,
  overlayColor = DRIFT_WALL_DEFAULTS.overlayColor,
  reducedMotion = DRIFT_WALL_DEFAULTS.reducedMotion,
}: DriftWallProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [active, setActive] = useState('');
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Drift Wall"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Columns of photographs drift at <code>{motionSpeed}</code> px/s
              with tilt <code>{tilt}</code> and turn <code>{turn}</code>. Hover
              lifts one tile.
            </>
          }
          controls="Pause holds the column offsets. Replay remounts the wall."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The fifteen tiles repeat FEATURES photographs through publicAsset(). items, className, style, paused, and onActive are not controls. overlayColor default is brand ink #212121 (upstream #060010). Tiles have no href, so a click does not open a window."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setActive('');
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="drift-wall-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-active': active,
        'data-speed': String(motionSpeed),
        'data-direction': direction,
      }}
    >
      <UpstreamDriftWall
        key={run}
        items={ITEMS}
        columns={columns}
        tileWidth={tileWidth}
        tileHeight={tileHeight}
        gap={gap}
        radius={radius}
        tilt={tilt}
        turn={turn}
        roll={roll}
        perspective={perspective}
        depth={depth}
        speed={motionSpeed}
        direction={direction}
        variance={variance}
        parallax={reduce ? 0 : parallax}
        pauseOnHover={pauseOnHover}
        lift={lift}
        fade={fade}
        dim={dim}
        grayscale={grayscale}
        overlayColor={overlayColor}
        paused={paused || reduce}
        onActive={(id) => setActive(id ?? '')}
      />
    </ReactBitsFrame>
  );
}
