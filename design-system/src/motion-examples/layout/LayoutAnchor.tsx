import { motion, useReducedMotion } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { LayoutFrame } from './Frame';
import {
  EXAMPLES,
  LAYOUT_ANCHOR_DEFAULTS,
  MOTION_RUNTIME,
  shouldReduce,
  type ReducedMotionMode,
} from './source';

export type LayoutAnchorProps = {
  anchorX?: number;
  anchorY?: number;
  duration?: number;
  delay?: number;
  collapsedSize?: number;
  expandedSize?: number;
  childCollapsed?: number;
  childExpanded?: number;
  heading?: string;
  goal?: string;
  copy?: string;
  photoSrc?: string;
  photoAlt?: string;
  reducedMotion?: ReducedMotionMode;
};

const CROSS_SIZE = 20;

export function LayoutAnchor({
  anchorX = LAYOUT_ANCHOR_DEFAULTS.anchorX,
  anchorY = LAYOUT_ANCHOR_DEFAULTS.anchorY,
  duration = LAYOUT_ANCHOR_DEFAULTS.duration,
  delay = LAYOUT_ANCHOR_DEFAULTS.delay,
  collapsedSize = LAYOUT_ANCHOR_DEFAULTS.collapsedSize,
  expandedSize = LAYOUT_ANCHOR_DEFAULTS.expandedSize,
  childCollapsed = LAYOUT_ANCHOR_DEFAULTS.childCollapsed,
  childExpanded = LAYOUT_ANCHOR_DEFAULTS.childExpanded,
  heading = LAYOUT_ANCHOR_DEFAULTS.heading,
  goal = LAYOUT_ANCHOR_DEFAULTS.goal,
  copy = LAYOUT_ANCHOR_DEFAULTS.copy,
  photoSrc = LAYOUT_ANCHOR_DEFAULTS.photoSrc,
  photoAlt = LAYOUT_ANCHOR_DEFAULTS.photoAlt,
  reducedMotion = LAYOUT_ANCHOR_DEFAULTS.reducedMotion,
}: LayoutAnchorProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const parentTransition = reduce
    ? { duration: 0 }
    : { duration, ease: 'easeInOut' as const };
  const childTransition = reduce
    ? { duration: 0 }
    : { duration, ease: 'easeInOut' as const, delay };

  return (
    <LayoutFrame
      title="Layout anchor"
      mechanism={
        <>
          Parent <code>layout</code> grows the card. Child{' '}
          <code>layoutAnchor</code> pins a 0–1 point on the goal chip to the
          parent-relative box. Default unset is top-left. Upstream{' '}
          <code>0.5, 0.5</code> pins the centre. <code>layoutDependency</code>{' '}
          is the expanded flag. Child delay waits for the parent to finish.
        </>
      }
      docs={MOTION_RUNTIME.docsLayout}
      example={EXAMPLES.layoutAnchor.page}
      live={EXAMPLES.layoutAnchor.live}
      fixedNote="Upstream parent is 150 to 300 pixels and the child is 70 to 100, a colour square with a crosshair. Those values stay the defaults. The goal chip uses them so $3,000 stays readable at 70 pixels. The control is a button, not the upstream div, so keyboard can expand it. Replay remounts collapsed."
      controlKind="replay"
      onReplay={() => {
        setExpanded(false);
        setRunId((value) => value + 1);
      }}
      reducedMotion={reducedMotion}
      testId="layout-anchor"
      running={!reduce}
      runId={runId}
    >
      <div className="layout-example__stage">
        <div key={runId} className="layout-anchor-wrap">
          <motion.button
            type="button"
            className="layout-anchor"
            layout
            layoutDependency={expanded}
            aria-expanded={expanded}
            data-expanded={expanded ? 'true' : 'false'}
            style={{
              width: expanded ? expandedSize : collapsedSize,
              height: expanded ? expandedSize : collapsedSize,
            }}
            transition={parentTransition}
            onClick={() => setExpanded((value) => !value)}
            aria-label={`${heading}. Goal ${goal}. ${expanded ? 'Collapse' : 'Expand'} the card.`}
          >
            <img
              data-photo=""
              className="layout-anchor__photo"
              src={photoSrc}
              alt={photoAlt}
            />
            <motion.div
              className="layout-anchor__child"
              layout
              layoutDependency={expanded}
              layoutAnchor={{ x: anchorX, y: anchorY }}
              style={{
                width: expanded ? childExpanded : childCollapsed,
                height: expanded ? childExpanded : childCollapsed,
              }}
              transition={childTransition}
            >
              {goal}
              <motion.div
                className="layout-anchor__cross"
                layout
                layoutDependency={expanded}
                aria-hidden="true"
                style={
                  {
                    width: CROSS_SIZE,
                    height: CROSS_SIZE,
                    marginLeft: -CROSS_SIZE / 2,
                    marginTop: -CROSS_SIZE / 2,
                    left: `${anchorX * 100}%`,
                    top: `${anchorY * 100}%`,
                  } as CSSProperties
                }
                transition={childTransition}
              >
                <span className="layout-anchor__cross-h" />
                <span className="layout-anchor__cross-v" />
              </motion.div>
            </motion.div>
          </motion.button>
          {expanded ? (
            <p className="layout-anchor__copy">{copy}</p>
          ) : (
            <p className="layout-anchor__copy">{heading}</p>
          )}
        </div>
      </div>
    </LayoutFrame>
  );
}
