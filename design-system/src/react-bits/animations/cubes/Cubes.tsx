import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCubes from '../../vendor/animations/cubes/Cubes';
import { CUBES_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './cubes.css';

export type CubesProps = {
  gridSize?: (typeof CUBES_DEFAULTS)['gridSize'];
  cubeSize?: (typeof CUBES_DEFAULTS)['cubeSize'];
  maxAngle?: (typeof CUBES_DEFAULTS)['maxAngle'];
  radius?: (typeof CUBES_DEFAULTS)['radius'];
  easing?: (typeof CUBES_DEFAULTS)['easing'];
  duration?: (typeof CUBES_DEFAULTS)['duration'];
  cellGap?: (typeof CUBES_DEFAULTS)['cellGap'];
  borderStyle?: (typeof CUBES_DEFAULTS)['borderStyle'];
  faceColor?: (typeof CUBES_DEFAULTS)['faceColor'];
  shadow?: (typeof CUBES_DEFAULTS)['shadow'];
  autoAnimate?: (typeof CUBES_DEFAULTS)['autoAnimate'];
  rippleOnClick?: (typeof CUBES_DEFAULTS)['rippleOnClick'];
  rippleColor?: (typeof CUBES_DEFAULTS)['rippleColor'];
  rippleSpeed?: (typeof CUBES_DEFAULTS)['rippleSpeed'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[4];

export function Cubes({
  gridSize = CUBES_DEFAULTS.gridSize,
  cubeSize = CUBES_DEFAULTS.cubeSize,
  maxAngle = CUBES_DEFAULTS.maxAngle,
  radius = CUBES_DEFAULTS.radius,
  easing = CUBES_DEFAULTS.easing,
  duration = CUBES_DEFAULTS.duration,
  cellGap = CUBES_DEFAULTS.cellGap,
  borderStyle = CUBES_DEFAULTS.borderStyle,
  faceColor = CUBES_DEFAULTS.faceColor,
  shadow = CUBES_DEFAULTS.shadow,
  autoAnimate = CUBES_DEFAULTS.autoAnimate,
  rippleOnClick = CUBES_DEFAULTS.rippleOnClick,
  rippleColor = CUBES_DEFAULTS.rippleColor,
  rippleSpeed = CUBES_DEFAULTS.rippleSpeed,
  reducedMotion = CUBES_DEFAULTS.reducedMotion,
}: CubesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [ripples, setRipples] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Cubes"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A {gridSize}×{gridSize} grid of CSS 3D cubes. Nearby cubes tween{' '}
              <code>rotateX</code>/<code>rotateY</code> toward the pointer up to{' '}
              <code>{maxAngle}</code> deg. Click ripples face colour to{' '}
              <code>{rippleColor}</code>. Face colour is brand ink; upstream was{' '}
              <code>#120F17</code>.
            </>
          }
          controls="Pause stops auto-tilt, pointer tilt, and ripples. Replay remounts the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused and onRipple are local. cubeSize 0 and cellGap 0 keep the upstream auto layout. The caption is the Street card from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setRipples(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink cubes-stage"
      stageTestId="cubes-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-ripples': String(ripples),
      }}
    >
      <UpstreamCubes
        key={run}
        gridSize={gridSize}
        cubeSize={cubeSize || undefined}
        maxAngle={reduce ? 0 : maxAngle}
        radius={radius}
        easing={easing}
        duration={duration}
        cellGap={cellGap || undefined}
        borderStyle={borderStyle}
        faceColor={faceColor}
        shadow={shadow}
        autoAnimate={reduce ? false : autoAnimate}
        rippleOnClick={reduce ? false : rippleOnClick}
        rippleColor={rippleColor}
        rippleSpeed={rippleSpeed}
        paused={paused || reduce}
        onRipple={setRipples}
      />
      <p className="cubes-caption">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
