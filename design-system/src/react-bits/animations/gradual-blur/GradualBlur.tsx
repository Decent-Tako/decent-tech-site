import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamGradualBlur from '../../vendor/animations/gradual-blur/GradualBlur';
import { GRADUAL_BLUR_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './gradual-blur.css';

export type GradualBlurProps = {
  position?: (typeof GRADUAL_BLUR_DEFAULTS)['position'];
  strength?: (typeof GRADUAL_BLUR_DEFAULTS)['strength'];
  height?: (typeof GRADUAL_BLUR_DEFAULTS)['height'];
  width?: (typeof GRADUAL_BLUR_DEFAULTS)['width'];
  divCount?: (typeof GRADUAL_BLUR_DEFAULTS)['divCount'];
  exponential?: (typeof GRADUAL_BLUR_DEFAULTS)['exponential'];
  zIndex?: (typeof GRADUAL_BLUR_DEFAULTS)['zIndex'];
  animated?: (typeof GRADUAL_BLUR_DEFAULTS)['animated'];
  duration?: (typeof GRADUAL_BLUR_DEFAULTS)['duration'];
  easing?: (typeof GRADUAL_BLUR_DEFAULTS)['easing'];
  opacity?: (typeof GRADUAL_BLUR_DEFAULTS)['opacity'];
  curve?: (typeof GRADUAL_BLUR_DEFAULTS)['curve'];
  responsive?: (typeof GRADUAL_BLUR_DEFAULTS)['responsive'];
  mobileHeight?: (typeof GRADUAL_BLUR_DEFAULTS)['mobileHeight'];
  tabletHeight?: (typeof GRADUAL_BLUR_DEFAULTS)['tabletHeight'];
  desktopHeight?: (typeof GRADUAL_BLUR_DEFAULTS)['desktopHeight'];
  mobileWidth?: (typeof GRADUAL_BLUR_DEFAULTS)['mobileWidth'];
  tabletWidth?: (typeof GRADUAL_BLUR_DEFAULTS)['tabletWidth'];
  desktopWidth?: (typeof GRADUAL_BLUR_DEFAULTS)['desktopWidth'];
  preset?: (typeof GRADUAL_BLUR_DEFAULTS)['preset'];
  hoverIntensity?: (typeof GRADUAL_BLUR_DEFAULTS)['hoverIntensity'];
  target?: (typeof GRADUAL_BLUR_DEFAULTS)['target'];
  reducedMotion?: ReducedMotionMode;
};

const CARD = FEATURES[0];

export function GradualBlur({
  position = GRADUAL_BLUR_DEFAULTS.position,
  strength = GRADUAL_BLUR_DEFAULTS.strength,
  height = GRADUAL_BLUR_DEFAULTS.height,
  width = GRADUAL_BLUR_DEFAULTS.width,
  divCount = GRADUAL_BLUR_DEFAULTS.divCount,
  exponential = GRADUAL_BLUR_DEFAULTS.exponential,
  zIndex = GRADUAL_BLUR_DEFAULTS.zIndex,
  animated = GRADUAL_BLUR_DEFAULTS.animated,
  duration = GRADUAL_BLUR_DEFAULTS.duration,
  easing = GRADUAL_BLUR_DEFAULTS.easing,
  opacity = GRADUAL_BLUR_DEFAULTS.opacity,
  curve = GRADUAL_BLUR_DEFAULTS.curve,
  responsive = GRADUAL_BLUR_DEFAULTS.responsive,
  mobileHeight = GRADUAL_BLUR_DEFAULTS.mobileHeight,
  tabletHeight = GRADUAL_BLUR_DEFAULTS.tabletHeight,
  desktopHeight = GRADUAL_BLUR_DEFAULTS.desktopHeight,
  mobileWidth = GRADUAL_BLUR_DEFAULTS.mobileWidth,
  tabletWidth = GRADUAL_BLUR_DEFAULTS.tabletWidth,
  desktopWidth = GRADUAL_BLUR_DEFAULTS.desktopWidth,
  preset = GRADUAL_BLUR_DEFAULTS.preset,
  hoverIntensity = GRADUAL_BLUR_DEFAULTS.hoverIntensity,
  target = GRADUAL_BLUR_DEFAULTS.target,
  reducedMotion = GRADUAL_BLUR_DEFAULTS.reducedMotion,
}: GradualBlurProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Gradual Blur"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              {divCount} stacked layers use <code>backdrop-filter</code> and a
              mask gradient at <code>{position}</code>. Strength{' '}
              <code>{strength}</code> scales the blur. Curve <code>{curve}</code>{' '}
              shapes the steps.
            </>
          }
          controls="Pause ignores hover intensity. Replay remounts the overlay."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="paused is local. onAnimationComplete, children, and unused gpuOptimized are not controls. target page is fixed to the viewport, so stories keep parent. The card is Week 0 from src/pages/content.ts."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setHover(false);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="gradual-blur-stage"
      stageTestId="gradual-blur-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-hover': hover ? 'true' : 'false',
        'data-position': position,
        'data-preset': preset || 'none',
      }}
    >
      <div
        className="gradual-blur-host"
        data-testid="gradual-blur-host"
        onPointerEnter={() => {
          if (!paused) setHover(true);
        }}
        onPointerLeave={() => setHover(false)}
      >
        <img src={CARD.photo.src} alt={CARD.photo.alt} width={640} height={400} />
        <div className="gradual-blur-copy">
          <p className="gradual-blur-kicker">{CARD.kicker}</p>
          <p className="gradual-blur-title">{CARD.title}</p>
          <p>{CARD.copy}</p>
        </div>
        <UpstreamGradualBlur
          key={run}
          position={position}
          strength={reduce ? 0 : strength}
          height={height}
          width={width || undefined}
          divCount={divCount}
          exponential={exponential}
          zIndex={zIndex}
          animated={reduce ? false : animated}
          duration={reduce ? '0s' : duration}
          easing={easing}
          opacity={opacity}
          curve={curve}
          responsive={responsive}
          mobileHeight={mobileHeight || undefined}
          tabletHeight={tabletHeight || undefined}
          desktopHeight={desktopHeight || undefined}
          mobileWidth={mobileWidth || undefined}
          tabletWidth={tabletWidth || undefined}
          desktopWidth={desktopWidth || undefined}
          preset={preset || undefined}
          hoverIntensity={reduce || paused ? 0 : hoverIntensity || undefined}
          target={target}
          paused={paused || reduce}
        />
      </div>
    </ReactBitsFrame>
  );
}
