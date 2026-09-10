import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamChromaGrid from '../../vendor/components/chroma-grid/ChromaGrid';
import { CHROMA_GRID_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './chroma-grid.css';

export type ChromaGridProps = {
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  reducedMotion?: ReducedMotionMode;
};

const BORDERS = ['#0035B1', '#DEF54F', '#212121', '#0035B1', '#DEF54F'] as const;
const GRADIENTS = [
  'linear-gradient(145deg, #0035B1, #212121)',
  'linear-gradient(210deg, #DEF54F, #212121)',
  'linear-gradient(165deg, #4A4A4A, #212121)',
  'linear-gradient(195deg, #0035B1, #212121)',
  'linear-gradient(225deg, #DEF54F, #212121)',
] as const;

const ITEMS = FEATURES.map((feature, index) => ({
  image: feature.photo.src,
  title: feature.title,
  subtitle: feature.copy,
  handle: feature.kicker,
  location: feature.index,
  borderColor: BORDERS[index],
  gradient: GRADIENTS[index],
}));

export function ChromaGrid({
  radius = CHROMA_GRID_DEFAULTS.radius,
  columns = CHROMA_GRID_DEFAULTS.columns,
  rows = CHROMA_GRID_DEFAULTS.rows,
  damping = CHROMA_GRID_DEFAULTS.damping,
  fadeOut = CHROMA_GRID_DEFAULTS.fadeOut,
  ease = CHROMA_GRID_DEFAULTS.ease,
  reducedMotion = CHROMA_GRID_DEFAULTS.reducedMotion,
}: ChromaGridProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Chroma Grid"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A grayscale mask follows the pointer with gsap ease <code>{ease}</code>{' '}
              and radius <code>{radius}</code> px. Colour shows in the spotlight.
            </>
          }
          controls="Pause skips pointer gsap. Replay remounts the grid."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The five tiles are Start, Learn, Tools, Challenge week, and Street from FEATURES. items, className, paused, instant, and onReveal are not controls. Cards have no url, so a click does not open a window. Border and gradient colours are brand tokens."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setRevealed(false);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="chroma-grid-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-revealed': revealed || reduce ? 'true' : 'false',
        'data-columns': String(columns),
      }}
    >
      <UpstreamChromaGrid
        key={run}
        items={ITEMS}
        radius={radius}
        columns={columns}
        rows={rows}
        damping={damping}
        fadeOut={fadeOut}
        ease={ease}
        paused={paused}
        instant={reduce}
        onReveal={setRevealed}
      />
    </ReactBitsFrame>
  );
}
