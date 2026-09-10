import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamBlobCursor from '../../vendor/animations/blob-cursor/BlobCursor';
import { BLOB_CURSOR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './blob-cursor.css';

export type BlobCursorProps = {
  blobType?: (typeof BLOB_CURSOR_DEFAULTS)['blobType'];
  fillColor?: (typeof BLOB_CURSOR_DEFAULTS)['fillColor'];
  trailCount?: (typeof BLOB_CURSOR_DEFAULTS)['trailCount'];
  sizes?: (typeof BLOB_CURSOR_DEFAULTS)['sizes'];
  innerSizes?: (typeof BLOB_CURSOR_DEFAULTS)['innerSizes'];
  innerColor?: (typeof BLOB_CURSOR_DEFAULTS)['innerColor'];
  opacities?: (typeof BLOB_CURSOR_DEFAULTS)['opacities'];
  shadowColor?: (typeof BLOB_CURSOR_DEFAULTS)['shadowColor'];
  shadowBlur?: (typeof BLOB_CURSOR_DEFAULTS)['shadowBlur'];
  shadowOffsetX?: (typeof BLOB_CURSOR_DEFAULTS)['shadowOffsetX'];
  shadowOffsetY?: (typeof BLOB_CURSOR_DEFAULTS)['shadowOffsetY'];
  filterStdDeviation?: (typeof BLOB_CURSOR_DEFAULTS)['filterStdDeviation'];
  filterColorMatrixValues?: (typeof BLOB_CURSOR_DEFAULTS)['filterColorMatrixValues'];
  useFilter?: (typeof BLOB_CURSOR_DEFAULTS)['useFilter'];
  fastDuration?: (typeof BLOB_CURSOR_DEFAULTS)['fastDuration'];
  slowDuration?: (typeof BLOB_CURSOR_DEFAULTS)['slowDuration'];
  fastEase?: (typeof BLOB_CURSOR_DEFAULTS)['fastEase'];
  slowEase?: (typeof BLOB_CURSOR_DEFAULTS)['slowEase'];
  zIndex?: (typeof BLOB_CURSOR_DEFAULTS)['zIndex'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[2];

export function BlobCursor({
  blobType = BLOB_CURSOR_DEFAULTS.blobType,
  fillColor = BLOB_CURSOR_DEFAULTS.fillColor,
  trailCount = BLOB_CURSOR_DEFAULTS.trailCount,
  sizes = BLOB_CURSOR_DEFAULTS.sizes,
  innerSizes = BLOB_CURSOR_DEFAULTS.innerSizes,
  innerColor = BLOB_CURSOR_DEFAULTS.innerColor,
  opacities = BLOB_CURSOR_DEFAULTS.opacities,
  shadowColor = BLOB_CURSOR_DEFAULTS.shadowColor,
  shadowBlur = BLOB_CURSOR_DEFAULTS.shadowBlur,
  shadowOffsetX = BLOB_CURSOR_DEFAULTS.shadowOffsetX,
  shadowOffsetY = BLOB_CURSOR_DEFAULTS.shadowOffsetY,
  filterStdDeviation = BLOB_CURSOR_DEFAULTS.filterStdDeviation,
  filterColorMatrixValues = BLOB_CURSOR_DEFAULTS.filterColorMatrixValues,
  useFilter = BLOB_CURSOR_DEFAULTS.useFilter,
  fastDuration = BLOB_CURSOR_DEFAULTS.fastDuration,
  slowDuration = BLOB_CURSOR_DEFAULTS.slowDuration,
  fastEase = BLOB_CURSOR_DEFAULTS.fastEase,
  slowEase = BLOB_CURSOR_DEFAULTS.slowEase,
  zIndex = BLOB_CURSOR_DEFAULTS.zIndex,
  reducedMotion = BLOB_CURSOR_DEFAULTS.reducedMotion,
}: BlobCursorProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  const motion = reduce
    ? { fastDuration: 0, slowDuration: 0, useFilter: false }
    : { fastDuration, slowDuration, useFilter };

  return (
    <ReactBitsFrame
      title="Blob Cursor"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              {trailCount} filled blobs follow the pointer with gsap. The lead uses{' '}
              <code>{fastDuration}</code> s and <code>{fastEase}</code>. The trail uses{' '}
              <code>{slowDuration}</code> s and <code>{slowEase}</code>. An SVG goo filter
              merges them when <code>useFilter</code> is on. Fill is brand accent blue;
              upstream was <code>#5227FF</code>.
            </>
          }
          controls="Pause skips new pointer tweens. Replay remounts the blobs."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="filterId is unique per mount so two stories do not share one SVG filter. The card is the Tools card from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="blob-cursor-stage"
      stageTestId="blob-cursor-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-blob-type': blobType,
      }}
    >
      <UpstreamBlobCursor
        key={run}
        blobType={blobType}
        fillColor={fillColor}
        trailCount={trailCount}
        sizes={sizes}
        innerSizes={innerSizes}
        innerColor={innerColor}
        opacities={opacities}
        shadowColor={shadowColor}
        shadowBlur={shadowBlur}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        filterId={`blob-${run}`}
        filterStdDeviation={filterStdDeviation}
        filterColorMatrixValues={filterColorMatrixValues}
        useFilter={motion.useFilter}
        fastDuration={motion.fastDuration}
        slowDuration={motion.slowDuration}
        fastEase={fastEase}
        slowEase={slowEase}
        zIndex={zIndex}
        paused={paused}
      />
      <div className="blob-cursor-copy">
        <p>{CARD.kicker}</p>
        <p>{CARD.title}</p>
        <p>{CARD.copy}</p>
      </div>
    </ReactBitsFrame>
  );
}
