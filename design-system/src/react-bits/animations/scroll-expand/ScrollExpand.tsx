import { useState } from 'react';

import { FEATURES, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamScrollExpand from '../../vendor/animations/scroll-expand/ScrollExpand';
import { SCROLL_EXPAND_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './scroll-expand.css';

export type ScrollExpandProps = {
  startWidth?: (typeof SCROLL_EXPAND_DEFAULTS)['startWidth'];
  startHeight?: (typeof SCROLL_EXPAND_DEFAULTS)['startHeight'];
  startRadius?: (typeof SCROLL_EXPAND_DEFAULTS)['startRadius'];
  endRadius?: (typeof SCROLL_EXPAND_DEFAULTS)['endRadius'];
  mediaZoom?: (typeof SCROLL_EXPAND_DEFAULTS)['mediaZoom'];
  scrollDistance?: (typeof SCROLL_EXPAND_DEFAULTS)['scrollDistance'];
  holdDistance?: (typeof SCROLL_EXPAND_DEFAULTS)['holdDistance'];
  smoothing?: (typeof SCROLL_EXPAND_DEFAULTS)['smoothing'];
  overlayScrim?: (typeof SCROLL_EXPAND_DEFAULTS)['overlayScrim'];
  enabled?: (typeof SCROLL_EXPAND_DEFAULTS)['enabled'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[2];

export function ScrollExpand({
  startWidth = SCROLL_EXPAND_DEFAULTS.startWidth,
  startHeight = SCROLL_EXPAND_DEFAULTS.startHeight,
  startRadius = SCROLL_EXPAND_DEFAULTS.startRadius,
  endRadius = SCROLL_EXPAND_DEFAULTS.endRadius,
  mediaZoom = SCROLL_EXPAND_DEFAULTS.mediaZoom,
  scrollDistance = SCROLL_EXPAND_DEFAULTS.scrollDistance,
  holdDistance = SCROLL_EXPAND_DEFAULTS.holdDistance,
  smoothing = SCROLL_EXPAND_DEFAULTS.smoothing,
  overlayScrim = SCROLL_EXPAND_DEFAULTS.overlayScrim,
  enabled = SCROLL_EXPAND_DEFAULTS.enabled,
  reducedMotion = SCROLL_EXPAND_DEFAULTS.reducedMotion,
}: ScrollExpandProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Scroll Expand"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A sticky clip path grows from <code>{startWidth}</code>% by{' '}
              <code>{startHeight}</code>% to full frame over{' '}
              <code>{scrollDistance}</code> viewports of scroll.
            </>
          }
          controls="Pause ignores further scroll. Replay remounts the scroller."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="src, alt, title, scrollHint, and children come from the Tools card in src/pages/content.ts. mediaType stays image. useWindowScroll stays false so the play can scroll the component. poster, className, and style are not controls. paused and onProgress are local."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setProgress(0);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="scroll-expand-stage"
      stageTestId="scroll-expand-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-progress': progress.toFixed(3),
      }}
    >
      <UpstreamScrollExpand
        key={run}
        src={CARD.photo.src}
        mediaType="image"
        alt={CARD.photo.alt}
        title={CARD.title}
        scrollHint={`${HERO.facts[1].label} ${HERO.facts[1].value}`}
        startWidth={startWidth}
        startHeight={startHeight}
        startRadius={startRadius}
        endRadius={endRadius}
        mediaZoom={mediaZoom}
        scrollDistance={scrollDistance}
        holdDistance={holdDistance}
        smoothing={reduce ? 0 : smoothing}
        overlayScrim={overlayScrim}
        useWindowScroll={false}
        enabled={reduce ? false : enabled}
        paused={paused}
        onProgress={setProgress}
      >
        <p className="scroll-expand-copy">
          {CARD.kicker}. {CARD.copy}
        </p>
      </UpstreamScrollExpand>
    </ReactBitsFrame>
  );
}
