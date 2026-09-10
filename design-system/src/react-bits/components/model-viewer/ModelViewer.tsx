import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame, type WebglState } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamModelViewer from '../../vendor/components/model-viewer/ModelViewer';
import {
  MODEL_VIEWER_DEFAULTS,
  type ModelViewerPreset,
  REACT_BITS_SOURCE,
} from './source';

import './model-viewer.css';

export type ModelViewerProps = {
  width?: number;
  height?: number;
  modelXOffset?: number;
  modelYOffset?: number;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  minZoomDistance?: number;
  maxZoomDistance?: number;
  enableMouseParallax?: boolean;
  enableManualRotation?: boolean;
  enableHoverRotation?: boolean;
  enableManualZoom?: boolean;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?: ModelViewerPreset;
  autoFrame?: boolean;
  showScreenshotButton?: boolean;
  fadeIn?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  reducedMotion?: ReducedMotionMode;
};

const MODEL_URL = new URL('../../vendor/components/model-viewer/model.glb', import.meta.url).href;

function probeWebgl(): WebglState {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('webgl2');
    return gl ? 'pending' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function ModelViewer({
  width = MODEL_VIEWER_DEFAULTS.width,
  height = MODEL_VIEWER_DEFAULTS.height,
  modelXOffset = MODEL_VIEWER_DEFAULTS.modelXOffset,
  modelYOffset = MODEL_VIEWER_DEFAULTS.modelYOffset,
  defaultRotationX = MODEL_VIEWER_DEFAULTS.defaultRotationX,
  defaultRotationY = MODEL_VIEWER_DEFAULTS.defaultRotationY,
  defaultZoom = MODEL_VIEWER_DEFAULTS.defaultZoom,
  minZoomDistance = MODEL_VIEWER_DEFAULTS.minZoomDistance,
  maxZoomDistance = MODEL_VIEWER_DEFAULTS.maxZoomDistance,
  enableMouseParallax = MODEL_VIEWER_DEFAULTS.enableMouseParallax,
  enableManualRotation = MODEL_VIEWER_DEFAULTS.enableManualRotation,
  enableHoverRotation = MODEL_VIEWER_DEFAULTS.enableHoverRotation,
  enableManualZoom = MODEL_VIEWER_DEFAULTS.enableManualZoom,
  ambientIntensity = MODEL_VIEWER_DEFAULTS.ambientIntensity,
  keyLightIntensity = MODEL_VIEWER_DEFAULTS.keyLightIntensity,
  fillLightIntensity = MODEL_VIEWER_DEFAULTS.fillLightIntensity,
  rimLightIntensity = MODEL_VIEWER_DEFAULTS.rimLightIntensity,
  environmentPreset = MODEL_VIEWER_DEFAULTS.environmentPreset,
  autoFrame = MODEL_VIEWER_DEFAULTS.autoFrame,
  showScreenshotButton = MODEL_VIEWER_DEFAULTS.showScreenshotButton,
  fadeIn = MODEL_VIEWER_DEFAULTS.fadeIn,
  autoRotate = MODEL_VIEWER_DEFAULTS.autoRotate,
  autoRotateSpeed = MODEL_VIEWER_DEFAULTS.autoRotateSpeed,
  reducedMotion = MODEL_VIEWER_DEFAULTS.reducedMotion,
}: ModelViewerProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [webgl, setWebgl] = useState<WebglState>(probeWebgl);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Model Viewer"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              A GLB sits in a three.js scene. Environment <code>{environmentPreset}</code>
              , zoom <code>{defaultZoom}</code>. Drag rotates. Hover adds parallax.
            </>
          }
          controls="Pause holds the render loop. Replay remounts the sketch."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="url, placeholderSrc, and onModelLoaded are not controls. The GLB is a local tetrahedron with a brand-blue material. The placeholder photograph is FEATURES[0] through publicAsset(). showScreenshotButton defaults to false so the story does not download a file. Upstream default true. environmentPreset defaults to none so the story does not fetch a remote HDR. Upstream default forest. Pointer listeners bind to the canvas. preserveDrawingBuffer is on so play can sample the canvas."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
        setWebgl(probeWebgl());
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      webgl={webgl}
      stageClassName="rb-frame__stage--ink"
      stageTestId="model-viewer-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-preset': environmentPreset,
        'data-rotate': paused || reduce || !autoRotate ? 'false' : 'true',
      }}
    >
      {webgl === 'unavailable' ? null : (
        <UpstreamModelViewer
          key={run}
          url={MODEL_URL}
          width={width}
          height={height}
          modelXOffset={modelXOffset}
          modelYOffset={modelYOffset}
          defaultRotationX={defaultRotationX}
          defaultRotationY={defaultRotationY}
          defaultZoom={defaultZoom}
          minZoomDistance={minZoomDistance}
          maxZoomDistance={maxZoomDistance}
          enableMouseParallax={!paused && !reduce && enableMouseParallax}
          enableManualRotation={!paused && enableManualRotation}
          enableHoverRotation={!paused && !reduce && enableHoverRotation}
          enableManualZoom={!paused && enableManualZoom}
          ambientIntensity={ambientIntensity}
          keyLightIntensity={keyLightIntensity}
          fillLightIntensity={fillLightIntensity}
          rimLightIntensity={rimLightIntensity}
          environmentPreset={environmentPreset}
          autoFrame={autoFrame}
          placeholderSrc={FEATURES[0].photo.src}
          showScreenshotButton={showScreenshotButton}
          fadeIn={fadeIn}
          autoRotate={!paused && !reduce && autoRotate}
          autoRotateSpeed={autoRotateSpeed}
          paused={paused}
          onModelLoaded={() => setWebgl('ready')}
        />
      )}
    </ReactBitsFrame>
  );
}
