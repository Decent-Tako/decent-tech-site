import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCircularGallery from '../../vendor/components/circular-gallery/CircularGallery';
import { CIRCULAR_GALLERY_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './circular-gallery.css';

export type CircularGalleryProps = {
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  reducedMotion?: ReducedMotionMode;
};

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

const ITEMS = FEATURES.map((feature) => ({
  image: feature.photo.src,
  text: feature.title,
}));

export function CircularGallery({
  bend = CIRCULAR_GALLERY_DEFAULTS.bend,
  textColor = CIRCULAR_GALLERY_DEFAULTS.textColor,
  borderRadius = CIRCULAR_GALLERY_DEFAULTS.borderRadius,
  font = CIRCULAR_GALLERY_DEFAULTS.font,
  scrollSpeed = CIRCULAR_GALLERY_DEFAULTS.scrollSpeed,
  scrollEase = CIRCULAR_GALLERY_DEFAULTS.scrollEase,
  reducedMotion = CIRCULAR_GALLERY_DEFAULTS.reducedMotion,
}: CircularGalleryProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : scrollSpeed;
  const motionBend = reduce ? 0 : bend;

  return (
    <ReactBitsFrame
      title="Circular Gallery"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An ogl orbit of image planes. Drag, wheel, or arrows shift{' '}
              <code>scroll.target</code>. Bend <code>{motionBend}</code> curves the
              row. Labels draw in Brand Sans.
            </>
          }
          controls="Pause holds the orbit lerp. Replay remounts the sketch. Reduced motion sets bend and scrollSpeed to 0."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items, fontUrl, paused, onReady, onError, and onScroll are not controls. Photographs are from FEATURES through publicAsset(). textColor default is brand paper #FFFFFF (upstream #ffffff). The default face is Brand Sans, not Figtree. preserveDrawingBuffer is on so play can sample the canvas."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setScroll(0);
        setPaused(false);
        setWebgl(probeWebgl());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="circular-gallery-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-scroll': String(Math.round(scroll * 100) / 100),
        'data-speed': String(motionSpeed),
        'data-bend': String(motionBend),
      }}
    >
      <UpstreamCircularGallery
        key={run}
        items={ITEMS}
        bend={motionBend}
        textColor={textColor}
        borderRadius={borderRadius}
        font={font}
        scrollSpeed={motionSpeed}
        scrollEase={reduce ? 1 : scrollEase}
        paused={paused || reduce}
        onReady={() => setWebgl('ready')}
        onError={() => setWebgl('unavailable')}
        onScroll={setScroll}
      />
    </ReactBitsFrame>
  );
}
