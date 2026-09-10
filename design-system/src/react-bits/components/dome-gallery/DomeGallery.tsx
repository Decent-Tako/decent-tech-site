import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamDomeGallery from '../../vendor/components/dome-gallery/DomeGallery';
import { DOME_GALLERY_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './dome-gallery.css';

export type DomeGalleryProps = {
  fit?: number;
  fitBasis?: (typeof DOME_GALLERY_DEFAULTS)['fitBasis'];
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const IMAGES = FEATURES.map((feature) => ({
  src: feature.photo.src,
  alt: feature.photo.alt,
}));

export function DomeGallery({
  fit = DOME_GALLERY_DEFAULTS.fit,
  fitBasis = DOME_GALLERY_DEFAULTS.fitBasis,
  minRadius = DOME_GALLERY_DEFAULTS.minRadius,
  maxRadius = DOME_GALLERY_DEFAULTS.maxRadius,
  padFactor = DOME_GALLERY_DEFAULTS.padFactor,
  overlayBlurColor = DOME_GALLERY_DEFAULTS.overlayBlurColor,
  maxVerticalRotationDeg = DOME_GALLERY_DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DOME_GALLERY_DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DOME_GALLERY_DEFAULTS.enlargeTransitionMs,
  segments = DOME_GALLERY_DEFAULTS.segments,
  dragDampening = DOME_GALLERY_DEFAULTS.dragDampening,
  openedImageWidth = DOME_GALLERY_DEFAULTS.openedImageWidth,
  openedImageHeight = DOME_GALLERY_DEFAULTS.openedImageHeight,
  imageBorderRadius = DOME_GALLERY_DEFAULTS.imageBorderRadius,
  openedImageBorderRadius = DOME_GALLERY_DEFAULTS.openedImageBorderRadius,
  grayscale = DOME_GALLERY_DEFAULTS.grayscale,
  reducedMotion = DOME_GALLERY_DEFAULTS.reducedMotion,
}: DomeGalleryProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [open, setOpen] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Dome Gallery"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              CSS 3D tiles on a hemisphere. Drag rotates the sphere. A click
              enlarges one tile. Overlay colour is <code>{overlayBlurColor}</code>.
            </>
          }
          controls="Pause ignores drag and stops inertia. Replay remounts the dome."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="The tiles are FEATURES photographs through publicAsset(). images, paused, onRotate, and onOpen are not controls. overlayBlurColor default is brand ink #212121 (upstream #120F17). maxRadius default 4000 stands in for Infinity so the control stays finite."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setOpen(false);
        setRotation({ x: 0, y: 0 });
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="dome-gallery-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-open': open ? 'true' : 'false',
        'data-rot-x': String(Math.round(rotation.x * 100) / 100),
        'data-rot-y': String(Math.round(rotation.y * 100) / 100),
        'data-gray': grayscale ? 'true' : 'false',
      }}
    >
      <UpstreamDomeGallery
        key={run}
        images={IMAGES}
        fit={fit}
        fitBasis={fitBasis}
        minRadius={minRadius}
        maxRadius={maxRadius}
        padFactor={padFactor}
        overlayBlurColor={overlayBlurColor}
        maxVerticalRotationDeg={maxVerticalRotationDeg}
        dragSensitivity={dragSensitivity}
        enlargeTransitionMs={reduce ? 0 : enlargeTransitionMs}
        segments={segments}
        dragDampening={dragDampening}
        openedImageWidth={openedImageWidth}
        openedImageHeight={openedImageHeight}
        imageBorderRadius={imageBorderRadius}
        openedImageBorderRadius={openedImageBorderRadius}
        grayscale={grayscale}
        paused={paused || reduce}
        onRotate={setRotation}
        onOpen={setOpen}
      />
    </ReactBitsFrame>
  );
}
