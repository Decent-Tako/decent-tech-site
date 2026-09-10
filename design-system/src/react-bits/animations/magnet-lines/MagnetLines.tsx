import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamMagnetLines from '../../vendor/animations/magnet-lines/MagnetLines';
import { MAGNET_LINES_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './magnet-lines.css';

export type MagnetLinesProps = {
  rows?: (typeof MAGNET_LINES_DEFAULTS)['rows'];
  columns?: (typeof MAGNET_LINES_DEFAULTS)['columns'];
  containerSize?: (typeof MAGNET_LINES_DEFAULTS)['containerSize'];
  lineColor?: (typeof MAGNET_LINES_DEFAULTS)['lineColor'];
  lineWidth?: (typeof MAGNET_LINES_DEFAULTS)['lineWidth'];
  lineHeight?: (typeof MAGNET_LINES_DEFAULTS)['lineHeight'];
  baseAngle?: (typeof MAGNET_LINES_DEFAULTS)['baseAngle'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function MagnetLines({
  rows = MAGNET_LINES_DEFAULTS.rows,
  columns = MAGNET_LINES_DEFAULTS.columns,
  containerSize = MAGNET_LINES_DEFAULTS.containerSize,
  lineColor = MAGNET_LINES_DEFAULTS.lineColor,
  lineWidth = MAGNET_LINES_DEFAULTS.lineWidth,
  lineHeight = MAGNET_LINES_DEFAULTS.lineHeight,
  baseAngle = MAGNET_LINES_DEFAULTS.baseAngle,
  reducedMotion = MAGNET_LINES_DEFAULTS.reducedMotion,
}: MagnetLinesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [angle, setAngle] = useState(baseAngle);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Magnet Lines"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A {rows}×{columns} grid of spans rotate toward the pointer. Line
              colour is brand ink; upstream was <code>#efefef</code>. Base angle
              is <code>{baseAngle}</code> deg.
            </>
          }
          controls="Pause ignores new pointer moves and keeps the last angles. Replay remounts the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused and onAngle are local. Pointer listeners sit on the grid, not window. CSS caps the grid at 20rem so 80vmin does not overflow the stage. The caption is Week 0 from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setAngle(baseAngle);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="magnet-lines-stage"
      stageTestId="magnet-lines-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-rows': String(rows),
        'data-angle': String(Math.round(angle)),
      }}
    >
      <UpstreamMagnetLines
        key={run}
        rows={rows}
        columns={columns}
        containerSize={containerSize}
        lineColor={lineColor}
        lineWidth={lineWidth}
        lineHeight={lineHeight}
        baseAngle={baseAngle}
        paused={paused || reduce}
        onAngle={setAngle}
      />
      <p className="magnet-lines-copy">
        {CARD.kicker}. {CARD.title}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
