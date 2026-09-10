import { useState } from 'react';

import { DESTINATIONS, FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamAnimatedList from '../../vendor/components/animated-list/AnimatedList';
import { ANIMATED_LIST_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './animated-list.css';

export type AnimatedListProps = {
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = [
  ...FEATURES.map((feature) => `${feature.index} ${feature.title}`),
  ...DESTINATIONS.map((destination) => destination.title),
  ...HERO.facts.map((fact) => `${fact.label} ${fact.value}`),
];

export function AnimatedList({
  showGradients = ANIMATED_LIST_DEFAULTS.showGradients,
  enableArrowNavigation = ANIMATED_LIST_DEFAULTS.enableArrowNavigation,
  displayScrollbar = ANIMATED_LIST_DEFAULTS.displayScrollbar,
  initialSelectedIndex = ANIMATED_LIST_DEFAULTS.initialSelectedIndex,
  reducedMotion = ANIMATED_LIST_DEFAULTS.reducedMotion,
}: AnimatedListProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [selected, setSelected] = useState(initialSelectedIndex);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Animated List"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Each row is a <code>motion.div</code>. <code>useInView</code> scales
              it from 0.7 to 1 when half of the row is in the scroller. Hover or
              click sets the selected row.
            </>
          }
          controls="Pause records the paused state on the stage. The enter tween is a one-shot scale, so Pause does not freeze a loop. Replay remounts the list."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The rows are FEATURES, DESTINATIONS, and HERO facts from src/pages/content.ts. items, onItemSelect, className, and itemClassName are not controls."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setSelected(initialSelectedIndex);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="animated-list-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-selected': String(selected),
      }}
    >
      <UpstreamAnimatedList
        key={run}
        items={ITEMS}
        showGradients={showGradients}
        enableArrowNavigation={enableArrowNavigation}
        displayScrollbar={displayScrollbar}
        initialSelectedIndex={initialSelectedIndex}
        onItemSelect={(_item, index) => setSelected(index)}
      />
    </ReactBitsFrame>
  );
}
