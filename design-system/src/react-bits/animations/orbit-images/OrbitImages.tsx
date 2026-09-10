import { useState } from 'react';

import { FEATURES, PHOTOS } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamOrbitImages from '../../vendor/animations/orbit-images/OrbitImages';
import { ORBIT_IMAGES_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './orbit-images.css';

export type OrbitImagesProps = {
  shape?: (typeof ORBIT_IMAGES_DEFAULTS)['shape'];
  baseWidth?: (typeof ORBIT_IMAGES_DEFAULTS)['baseWidth'];
  radiusX?: (typeof ORBIT_IMAGES_DEFAULTS)['radiusX'];
  radiusY?: (typeof ORBIT_IMAGES_DEFAULTS)['radiusY'];
  radius?: (typeof ORBIT_IMAGES_DEFAULTS)['radius'];
  starPoints?: (typeof ORBIT_IMAGES_DEFAULTS)['starPoints'];
  starInnerRatio?: (typeof ORBIT_IMAGES_DEFAULTS)['starInnerRatio'];
  rotation?: (typeof ORBIT_IMAGES_DEFAULTS)['rotation'];
  duration?: (typeof ORBIT_IMAGES_DEFAULTS)['duration'];
  itemSize?: (typeof ORBIT_IMAGES_DEFAULTS)['itemSize'];
  direction?: (typeof ORBIT_IMAGES_DEFAULTS)['direction'];
  fill?: (typeof ORBIT_IMAGES_DEFAULTS)['fill'];
  showPath?: (typeof ORBIT_IMAGES_DEFAULTS)['showPath'];
  pathColor?: (typeof ORBIT_IMAGES_DEFAULTS)['pathColor'];
  pathWidth?: (typeof ORBIT_IMAGES_DEFAULTS)['pathWidth'];
  easing?: (typeof ORBIT_IMAGES_DEFAULTS)['easing'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];
const ITEMS = [PHOTOS.hero.src, PHOTOS.crowd.src, PHOTOS.community.src, PHOTOS.run.src, PHOTOS.night.src];

export function OrbitImages({
  shape = ORBIT_IMAGES_DEFAULTS.shape,
  baseWidth = ORBIT_IMAGES_DEFAULTS.baseWidth,
  radiusX = ORBIT_IMAGES_DEFAULTS.radiusX,
  radiusY = ORBIT_IMAGES_DEFAULTS.radiusY,
  radius = ORBIT_IMAGES_DEFAULTS.radius,
  starPoints = ORBIT_IMAGES_DEFAULTS.starPoints,
  starInnerRatio = ORBIT_IMAGES_DEFAULTS.starInnerRatio,
  rotation = ORBIT_IMAGES_DEFAULTS.rotation,
  duration = ORBIT_IMAGES_DEFAULTS.duration,
  itemSize = ORBIT_IMAGES_DEFAULTS.itemSize,
  direction = ORBIT_IMAGES_DEFAULTS.direction,
  fill = ORBIT_IMAGES_DEFAULTS.fill,
  showPath = ORBIT_IMAGES_DEFAULTS.showPath,
  pathColor = ORBIT_IMAGES_DEFAULTS.pathColor,
  pathWidth = ORBIT_IMAGES_DEFAULTS.pathWidth,
  easing = ORBIT_IMAGES_DEFAULTS.easing,
  reducedMotion = ORBIT_IMAGES_DEFAULTS.reducedMotion,
}: OrbitImagesProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Orbit Images"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Five Academy photographs travel a <code>{shape}</code> offset-path
              over <code>{duration}</code> seconds. Motion drives a shared
              progress clock.
            </>
          }
          controls="Pause stops the progress clock. Replay remounts the orbit."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="images are the five Academy photographs from src/pages/content.ts. width, height, and responsive are not controls: the wrapper fills the stage. paused is the frame Pause control. customPath is unused unless shape is custom, which is not offered."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="orbit-images-stage"
      stageTestId="orbit-images-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-shape': shape,
      }}
    >
      <UpstreamOrbitImages
        key={run}
        images={[...ITEMS]}
        altPrefix={CARD.title}
        shape={shape}
        baseWidth={baseWidth}
        radiusX={radiusX}
        radiusY={radiusY}
        radius={radius}
        starPoints={starPoints}
        starInnerRatio={starInnerRatio}
        rotation={rotation}
        duration={reduce ? 0.01 : duration}
        itemSize={itemSize}
        direction={direction}
        fill={fill}
        width="100%"
        height={360}
        showPath={showPath}
        pathColor={pathColor}
        pathWidth={pathWidth}
        easing={easing}
        paused={paused || reduce}
        responsive={false}
        centerContent={<p className="orbit-images-center">{CARD.title}</p>}
      />
      <p className="orbit-images-copy">
        {CARD.kicker}. {CARD.copy}
      </p>
    </ReactBitsFrame>
  );
}
