import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamInfiniteSpiral from '../../vendor/components/infinite-spiral/InfiniteSpiral';
import {
  INFINITE_SPIRAL_DEFAULTS,
  REACT_BITS_SOURCE,
  SPIRAL_DIRECTIONS,
  SPIRAL_FITS,
  SPIRAL_MODES,
} from './source';

import './infinite-spiral.css';

export type InfiniteSpiralProps = {
  speed?: number;
  direction?: (typeof SPIRAL_DIRECTIONS)[number];
  animationMode?: (typeof SPIRAL_MODES)[number];
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  verticalSpacing?: number;
  perspective?: number;
  cardsPerTurn?: number;
  rotation?: number;
  cardTilt?: number;
  cardRadius?: number;
  centerScale?: number;
  edgeFade?: number;
  edgeBlur?: number;
  pauseOnHover?: boolean;
  imageFit?: (typeof SPIRAL_FITS)[number];
  grayscale?: number;
  reducedMotion?: ReducedMotionMode;
};

const ITEMS = [...FEATURES, ...FEATURES].map((feature) => ({
  src: feature.photo.src,
  alt: feature.photo.alt,
  label: feature.title,
}));

export function InfiniteSpiral({
  speed = INFINITE_SPIRAL_DEFAULTS.speed,
  direction = INFINITE_SPIRAL_DEFAULTS.direction,
  animationMode = INFINITE_SPIRAL_DEFAULTS.animationMode,
  radius = INFINITE_SPIRAL_DEFAULTS.radius,
  cardWidth = INFINITE_SPIRAL_DEFAULTS.cardWidth,
  cardHeight = INFINITE_SPIRAL_DEFAULTS.cardHeight,
  verticalSpacing = INFINITE_SPIRAL_DEFAULTS.verticalSpacing,
  perspective = INFINITE_SPIRAL_DEFAULTS.perspective,
  cardsPerTurn = INFINITE_SPIRAL_DEFAULTS.cardsPerTurn,
  rotation = INFINITE_SPIRAL_DEFAULTS.rotation,
  cardTilt = INFINITE_SPIRAL_DEFAULTS.cardTilt,
  cardRadius = INFINITE_SPIRAL_DEFAULTS.cardRadius,
  centerScale = INFINITE_SPIRAL_DEFAULTS.centerScale,
  edgeFade = INFINITE_SPIRAL_DEFAULTS.edgeFade,
  edgeBlur = INFINITE_SPIRAL_DEFAULTS.edgeBlur,
  pauseOnHover = INFINITE_SPIRAL_DEFAULTS.pauseOnHover,
  imageFit = INFINITE_SPIRAL_DEFAULTS.imageFit,
  grayscale = INFINITE_SPIRAL_DEFAULTS.grayscale,
  reducedMotion = INFINITE_SPIRAL_DEFAULTS.reducedMotion,
}: InfiniteSpiralProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const reduce = useReduce(reducedMotion);
  const motionSpeed = reduce ? 0 : speed;

  return (
    <ReactBitsFrame
      title="Infinite Spiral"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              CSS 3D cards walk a helix. Auto speed <code>{motionSpeed}</code>,
              mode <code>{animationMode}</code>, direction <code>{direction}</code>.
            </>
          }
          controls="Pause holds the auto-scroll lerp. Replay remounts the helix."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="items and className are not controls. Photographs are FEATURES through publicAsset(), repeated so the helix loops. Cards have no href. Reduced motion sets speed to 0."
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
      stageClassName="rb-frame__stage--ink"
      stageTestId="infinite-spiral-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-progress': progress.toFixed(3),
        'data-mode': animationMode,
        'data-speed': String(motionSpeed),
      }}
    >
      <UpstreamInfiniteSpiral
        key={run}
        items={ITEMS}
        speed={motionSpeed}
        direction={direction}
        animationMode={animationMode}
        radius={radius}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        verticalSpacing={verticalSpacing}
        perspective={perspective}
        cardsPerTurn={cardsPerTurn}
        rotation={rotation}
        cardTilt={cardTilt}
        cardRadius={cardRadius}
        centerScale={centerScale}
        edgeFade={edgeFade}
        edgeBlur={edgeBlur}
        pauseOnHover={pauseOnHover}
        imageFit={imageFit}
        grayscale={grayscale}
        paused={paused || reduce}
        onProgress={setProgress}
      />
    </ReactBitsFrame>
  );
}
