import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useState, type CSSProperties } from 'react';

import { PATH_DRAWING_DEFAULTS } from './defaults';
import { SvgFrame } from './Frame';
import {
  shouldReduce,
  SVG_EXAMPLES,
  type ReducedMotionMode,
} from './source';

export type PathDrawingProps = {
  duration?: number;
  delayStep?: number;
  bounce?: number;
  strokeWidth?: number;
  size?: number;
  caption?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

const INK = '#212121';
const BLUE = '#0035B1';
const CHARCOAL = '#4A4A4A';

export function PathDrawing({
  duration = PATH_DRAWING_DEFAULTS.duration,
  delayStep = PATH_DRAWING_DEFAULTS.delayStep,
  bounce = PATH_DRAWING_DEFAULTS.bounce,
  strokeWidth = PATH_DRAWING_DEFAULTS.strokeWidth,
  size = PATH_DRAWING_DEFAULTS.size,
  caption = PATH_DRAWING_DEFAULTS.caption,
  reducedMotion = PATH_DRAWING_DEFAULTS.reducedMotion,
  replayNonce: replayNonceProp = PATH_DRAWING_DEFAULTS.replayNonce,
}: PathDrawingProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(replayNonceProp);
  const [nonceFromArgs, setNonceFromArgs] = useState(replayNonceProp);
  if (replayNonceProp !== nonceFromArgs) {
    setNonceFromArgs(replayNonceProp);
    setRunId(replayNonceProp);
  }

  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = reduce ? 0 : i * delayStep;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: {
            delay,
            type: 'spring',
            duration: reduce ? 0 : duration,
            bounce,
          },
          opacity: { delay, duration: reduce ? 0 : 0.01 },
        },
      };
    },
  };

  const shape: CSSProperties = {
    strokeWidth,
    strokeLinecap: 'round',
    fill: 'transparent',
  };

  const example = SVG_EXAMPLES.pathDrawing;

  return (
    <SvgFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-animation"
      fixedNote="The SVG stays 600 by 600 at the upstream default so the 10 px strokes and the 80 px circles stay legible. max-width 80vw is the upstream bound. fill transparent and strokeLinecap round are not visual parameters. This draw is one-shot, so Replay remounts the SVG."
      controlKind="replay"
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="svg-path-drawing"
      running={!reduce}
      runId={runId}
    >
      <motion.svg
        key={runId}
        className="academy-svg__draw"
        width={size}
        height={size}
        viewBox="0 0 600 600"
        initial={reduce ? 'visible' : 'hidden'}
        animate="visible"
        role="img"
        aria-label={caption}
      >
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          stroke={BLUE}
          variants={draw}
          custom={1}
          style={shape}
        />
        <motion.line
          x1="220"
          y1="30"
          x2="360"
          y2="170"
          stroke={INK}
          variants={draw}
          custom={2}
          style={shape}
        />
        <motion.line
          x1="220"
          y1="170"
          x2="360"
          y2="30"
          stroke={INK}
          variants={draw}
          custom={2.5}
          style={shape}
        />
        <motion.rect
          width="140"
          height="140"
          x="410"
          y="30"
          rx="20"
          stroke={CHARCOAL}
          variants={draw}
          custom={3}
          style={shape}
        />
        <motion.circle
          cx="100"
          cy="300"
          r="80"
          stroke={CHARCOAL}
          variants={draw}
          custom={2}
          style={shape}
        />
        <motion.line
          x1="220"
          y1="230"
          x2="360"
          y2="370"
          stroke={BLUE}
          custom={3}
          variants={draw}
          style={shape}
        />
        <motion.line
          x1="220"
          y1="370"
          x2="360"
          y2="230"
          stroke={BLUE}
          custom={3.5}
          variants={draw}
          style={shape}
        />
        <motion.rect
          width="140"
          height="140"
          x="410"
          y="230"
          rx="20"
          stroke={INK}
          custom={4}
          variants={draw}
          style={shape}
        />
        <motion.circle
          cx="100"
          cy="500"
          r="80"
          stroke={INK}
          variants={draw}
          custom={3}
          style={shape}
        />
        <motion.line
          x1="220"
          y1="430"
          x2="360"
          y2="570"
          stroke={CHARCOAL}
          variants={draw}
          custom={4}
          style={shape}
        />
        <motion.line
          x1="220"
          y1="570"
          x2="360"
          y2="430"
          stroke={CHARCOAL}
          variants={draw}
          custom={4.5}
          style={shape}
        />
        <motion.rect
          width="140"
          height="140"
          x="410"
          y="430"
          rx="20"
          stroke={BLUE}
          variants={draw}
          custom={5}
          style={shape}
        />
      </motion.svg>
      <p className="academy-svg__legend">
        Circle is the cohort. Cross is Challenge week. Rounded card is a week.
        Rows are Week 0, Learn, and 19–28 October 2026.
      </p>
      <p className="academy-svg__caption">{caption}</p>
    </SvgFrame>
  );
}
