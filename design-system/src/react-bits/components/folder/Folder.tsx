import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamFolder from '../../vendor/components/folder/Folder';
import { FOLDER_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './folder.css';

export type FolderProps = {
  color?: string;
  size?: number;
  reducedMotion?: ReducedMotionMode;
};

const PAPERS = FEATURES.slice(0, 3).map((feature) => (
  <span className="folder__label" key={feature.id}>
    {feature.title}
  </span>
));

export function Folder({
  color = FOLDER_DEFAULTS.color,
  size = FOLDER_DEFAULTS.size,
  reducedMotion = FOLDER_DEFAULTS.reducedMotion,
}: FolderProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Folder"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A click toggles the <code>open</code> class. CSS transforms fan
              three papers out of the folder. Size <code>{size}</code> scales
              the whole mark. Colour <code>{color}</code> tints the cover.
            </>
          }
          controls="Pause freezes the CSS transitions. Replay remounts the folder closed."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items and className are not controls. The three papers are FEATURES titles from src/pages/content.ts. Colour default is brand accent blue. Upstream default #5227FF."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="folder-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-size': String(size),
        'data-color': color,
      }}
    >
      <div
        className={[
          'folder-stage',
          paused ? 'folder-stage--paused' : '',
          reduce ? 'folder-stage--reduced' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <UpstreamFolder key={run} color={color} size={size} items={PAPERS} />
      </div>
    </ReactBitsFrame>
  );
}
