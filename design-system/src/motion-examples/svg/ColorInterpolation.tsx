import { useAnimate, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { COLOR_INTERPOLATION_DEFAULTS } from './defaults';
import { SvgFrame } from './Frame';
import {
  shouldReduce,
  SVG_EXAMPLES,
  type ReducedMotionMode,
} from './source';

export type ColorInterpolationProps = {
  duration?: number;
  speed?: number;
  fromColor?: string;
  toColor?: string;
  swatchSize?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

export function ColorInterpolation({
  duration = COLOR_INTERPOLATION_DEFAULTS.duration,
  speed = COLOR_INTERPOLATION_DEFAULTS.speed,
  fromColor = COLOR_INTERPOLATION_DEFAULTS.fromColor,
  toColor = COLOR_INTERPOLATION_DEFAULTS.toColor,
  swatchSize = COLOR_INTERPOLATION_DEFAULTS.swatchSize,
  caption = COLOR_INTERPOLATION_DEFAULTS.caption,
  paused: pausedProp = COLOR_INTERPOLATION_DEFAULTS.paused,
  reducedMotion = COLOR_INTERPOLATION_DEFAULTS.reducedMotion,
  replayNonce: replayNonceProp = COLOR_INTERPOLATION_DEFAULTS.replayNonce,
}: ColorInterpolationProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [paused, setPaused] = useState(pausedProp);
  const [pausedFromArgs, setPausedFromArgs] = useState(pausedProp);
  if (pausedProp !== pausedFromArgs) {
    setPausedFromArgs(pausedProp);
    setPaused(pausedProp);
  }
  const [runId, setRunId] = useState(replayNonceProp);
  const [nonceFromArgs, setNonceFromArgs] = useState(replayNonceProp);
  if (replayNonceProp !== nonceFromArgs) {
    setNonceFromArgs(replayNonceProp);
    setRunId(replayNonceProp);
  }

  const running = !paused && !reduce;
  const waapiRef = useRef<HTMLDivElement>(null);
  const [motionRef, animate] = useAnimate();
  const seconds = duration / Math.max(speed, 0.1);

  useEffect(() => {
    const waapiElement = waapiRef.current;
    const motionElement = motionRef.current;
    if (!waapiElement || !motionElement) return;

    if (reduce) {
      waapiElement.style.backgroundColor = toColor;
      motionElement.style.backgroundColor = toColor;
      return;
    }

    waapiElement.style.backgroundColor = fromColor;
    motionElement.style.backgroundColor = fromColor;

    const waapiAnimation = waapiElement.animate(
      [{ backgroundColor: fromColor }, { backgroundColor: toColor }],
      {
        duration: seconds * 1000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'linear',
      },
    );

    const motionAnimation = animate(
      motionElement,
      { backgroundColor: [fromColor, toColor] },
      {
        duration: seconds,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear',
      },
    );

    if (!running) {
      waapiAnimation.pause();
      motionAnimation.pause();
    }

    return () => {
      waapiAnimation.cancel();
      motionAnimation.cancel();
    };
  }, [animate, fromColor, motionRef, reduce, running, seconds, toColor, runId]);

  const swatchStyle: CSSProperties = {
    width: swatchSize,
    height: swatchSize,
    backgroundColor: fromColor,
  };

  const example = SVG_EXAMPLES.colorInterpolation;

  return (
    <SvgFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="Each swatch stays 100 by 100 pixels at the upstream default so the mid colour is visible. The loop is continuous, so Pause and Speed replace Replay. fromColor and toColor are Academy hover blue and press yellow."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => {
        setPaused((current) => {
          if (current) setRunId((id) => id + 1);
          return !current;
        });
      }}
      reducedMotion={reducedMotion}
      testId="svg-color-interpolation"
      running={running}
      runId={runId}
    >
      <div className="academy-svg__swatches">
        <div className="academy-svg__swatch-block">
          <div
            ref={waapiRef}
            className="academy-svg__swatch"
            style={swatchStyle}
            role="img"
            aria-label={`Browser interpolation from ${fromColor} to ${toColor}`}
          />
          <p className="academy-svg__swatch-label">Browser</p>
        </div>
        <div className="academy-svg__swatch-block">
          <div
            ref={motionRef}
            className="academy-svg__swatch"
            style={swatchStyle}
            role="img"
            aria-label={`Motion interpolation from ${fromColor} to ${toColor}`}
          />
          <p className="academy-svg__swatch-label">Motion</p>
        </div>
      </div>
      <p className="academy-svg__caption">{caption}</p>
    </SvgFrame>
  );
}
