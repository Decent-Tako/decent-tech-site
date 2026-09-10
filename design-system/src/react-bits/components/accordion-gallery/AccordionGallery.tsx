import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamAccordionGallery from '../../vendor/components/accordion-gallery/AccordionGallery';
import { ACCORDION_GALLERY_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './accordion-gallery.css';

export type AccordionGalleryProps = {
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: (typeof ACCORDION_GALLERY_DEFAULTS)['orientation'];
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: (typeof ACCORDION_GALLERY_DEFAULTS)['trigger'];
  showLabels?: boolean;
  grayscale?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = FEATURES.map((feature) => ({
  image: feature.photo.src,
  label: feature.title,
  alt: feature.photo.alt,
}));

export function AccordionGallery({
  defaultIndex = ACCORDION_GALLERY_DEFAULTS.defaultIndex,
  accentColor = ACCORDION_GALLERY_DEFAULTS.accentColor,
  overlayColor = ACCORDION_GALLERY_DEFAULTS.overlayColor,
  textColor = ACCORDION_GALLERY_DEFAULTS.textColor,
  height = ACCORDION_GALLERY_DEFAULTS.height,
  gap = ACCORDION_GALLERY_DEFAULTS.gap,
  radius = ACCORDION_GALLERY_DEFAULTS.radius,
  expandRatio = ACCORDION_GALLERY_DEFAULTS.expandRatio,
  orientation = ACCORDION_GALLERY_DEFAULTS.orientation,
  duration = ACCORDION_GALLERY_DEFAULTS.duration,
  ease = ACCORDION_GALLERY_DEFAULTS.ease,
  parallax = ACCORDION_GALLERY_DEFAULTS.parallax,
  tilt = ACCORDION_GALLERY_DEFAULTS.tilt,
  stagger = ACCORDION_GALLERY_DEFAULTS.stagger,
  trigger = ACCORDION_GALLERY_DEFAULTS.trigger,
  showLabels = ACCORDION_GALLERY_DEFAULTS.showLabels,
  grayscale = ACCORDION_GALLERY_DEFAULTS.grayscale,
  reducedMotion = ACCORDION_GALLERY_DEFAULTS.reducedMotion,
}: AccordionGalleryProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);

  return (
    <ReactBitsFrame
      title="Accordion Gallery"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A gsap timeline grows the active panel to{' '}
              <code>expandRatio {expandRatio}</code>, tilts the rest by{' '}
              <code>{tilt}deg</code>, shifts the photograph by{' '}
              <code>parallax {parallax}</code>, and fades the caption. Trigger{' '}
              <code>{trigger}</code> sets the active index.
            </>
          }
          controls="Pause holds the gsap global timeline. Replay remounts the gallery."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The five panels are the Week 0 to Street cards from src/pages/content.ts. items, className, and each item link are not controls. Colour defaults use brand tokens. Upstream accent #ffffff, overlay #060010, text #ffffff."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="accordion-gallery-stage"
      stageClassName={orientation === 'vertical' ? 'rb-frame__stage--tall' : undefined}
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-orientation': orientation,
        'data-trigger': trigger,
      }}
    >
      <UpstreamAccordionGallery
        key={run}
        items={ITEMS}
        defaultIndex={defaultIndex}
        accentColor={accentColor}
        overlayColor={overlayColor}
        textColor={textColor}
        height={height}
        gap={gap}
        radius={radius}
        expandRatio={expandRatio}
        orientation={orientation}
        duration={reduce ? 0 : duration}
        ease={ease}
        parallax={parallax}
        tilt={tilt}
        stagger={stagger}
        trigger={trigger}
        showLabels={showLabels}
        grayscale={grayscale}
      />
    </ReactBitsFrame>
  );
}
