import { motion, useReducedMotion, type Transition } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { PHOTOS } from '../../pages/content';
import { MOTION_PATH_DEFAULTS } from './defaults';
import { SvgFrame } from './Frame';
import {
  shouldReduce,
  SVG_EXAMPLES,
  type ReducedMotionMode,
} from './source';

export type MotionPathProps = {
  duration?: number;
  speed?: number;
  boxSize?: number;
  startScale?: number;
  strokeWidth?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

const SPIRAL =
  'M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5';

export function MotionPath({
  duration = MOTION_PATH_DEFAULTS.duration,
  speed = MOTION_PATH_DEFAULTS.speed,
  boxSize = MOTION_PATH_DEFAULTS.boxSize,
  startScale = MOTION_PATH_DEFAULTS.startScale,
  strokeWidth = MOTION_PATH_DEFAULTS.strokeWidth,
  caption = MOTION_PATH_DEFAULTS.caption,
  paused: pausedProp = MOTION_PATH_DEFAULTS.paused,
  reducedMotion = MOTION_PATH_DEFAULTS.reducedMotion,
  replayNonce: replayNonceProp = MOTION_PATH_DEFAULTS.replayNonce,
}: MotionPathProps) {
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
  const seconds = duration / Math.max(speed, 0.1);
  const transition: Transition = {
    duration: running ? seconds : 0,
    repeat: running ? Infinity : 0,
    repeatType: 'reverse',
    ease: 'easeInOut',
  };

  const box: CSSProperties = {
    width: boxSize,
    height: boxSize,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    offsetPath: `path("${SPIRAL}")`,
  };

  const example = SVG_EXAMPLES.motionPath;

  return (
    <SvgFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-svg-animation"
      fixedNote="The SVG stays 451 by 437 so the cubic spiral matches offsetPath. The box is 50 by 50 at the upstream default. Path d and offsetPath stay the same string. The loop is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => {
        setPaused((current) => {
          if (current) setRunId((id) => id + 1);
          return !current;
        });
      }}
      reducedMotion={reducedMotion}
      testId="svg-motion-path"
      running={running}
      runId={runId}
    >
      <div className="academy-svg__path-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="451" height="437">
          <motion.path
            key={`path-${runId}`}
            d={SPIRAL}
            fill="transparent"
            strokeWidth={strokeWidth}
            stroke="#0035B1"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={transition}
          />
        </svg>
        <motion.div
          key={`box-${runId}`}
          className="academy-svg__token"
          style={box}
          initial={{
            offsetDistance: reduce ? '100%' : '0%',
            scale: reduce ? 1 : startScale,
          }}
          animate={{ offsetDistance: '100%', scale: 1 }}
          transition={transition}
        >
          <img
            src={PHOTOS.hero.src}
            alt={PHOTOS.hero.alt}
            data-photo=""
            width={boxSize}
            height={boxSize}
          />
        </motion.div>
      </div>
      <p className="academy-svg__caption">{caption}</p>
    </SvgFrame>
  );
}
