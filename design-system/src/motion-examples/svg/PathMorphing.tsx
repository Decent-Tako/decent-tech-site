import { interpolate } from 'flubber';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import { PATH_MORPHING_DEFAULTS } from './defaults';
import { SvgFrame } from './Frame';
import {
  FLUBBER_LICENCE,
  FLUBBER_PACKAGE,
  FLUBBER_REPO,
  FLUBBER_VERSION,
  shouldReduce,
  SVG_EXAMPLES,
  type ReducedMotionMode,
} from './source';

export type PathMorphingProps = {
  duration?: number;
  speed?: number;
  maxSegmentLength?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

const star =
  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
const heart =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
const hand =
  'M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83s1.26-1.23 1.3-1.25c.22-.19.49-.29.79-.29.22 0 .42.06.6.16.04.01 4.31 2.46 4.31 2.46V4c0-.83.67-1.5 1.5-1.5S11 3.17 11 4v7h1V1.5c0-.83.67-1.5 1.5-1.5S15 .67 15 1.5V11h1V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V11h1V5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z';
const plane =
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z';
const lightning = 'M7 2v11h3v9l7-12h-4l4-8z';
const note =
  'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z';

const paths = [lightning, hand, plane, heart, note, star, lightning];
const colors = [
  '#0035B1',
  '#212121',
  '#0035B1',
  '#212121',
  '#0035B1',
  '#212121',
  '#0035B1',
];
const labels = [
  'Challenge week',
  'Buddy',
  'Outreach',
  'Community',
  'Fireside',
  '$3,000 goal',
  'Challenge week',
];

const getIndex = (_: string, index: number) => index;

function useFlubber(
  progress: MotionValue<number>,
  morphPaths: string[],
  maxSegmentLength: number,
) {
  // useTransform builds its mixers on every render. flubber's interpolate is
  // an O(n squared) rotation search per pair, so the six interpolators are
  // built once here and looked up by pair.
  const mixers = useMemo(() => {
    const map = new Map<string, (t: number) => string>();
    for (let i = 0; i < morphPaths.length - 1; i += 1) {
      const a = morphPaths[i];
      const b = morphPaths[i + 1];
      map.set(`${a}|${b}`, interpolate(a, b, { maxSegmentLength }));
    }
    return map;
  }, [morphPaths, maxSegmentLength]);
  return useTransform(progress, morphPaths.map(getIndex), morphPaths, {
    mixer: (a: string, b: string) =>
      mixers.get(`${a}|${b}`) ?? interpolate(a, b, { maxSegmentLength }),
  });
}

export function PathMorphing({
  duration = PATH_MORPHING_DEFAULTS.duration,
  speed = PATH_MORPHING_DEFAULTS.speed,
  maxSegmentLength = PATH_MORPHING_DEFAULTS.maxSegmentLength,
  caption = PATH_MORPHING_DEFAULTS.caption,
  paused: pausedProp = PATH_MORPHING_DEFAULTS.paused,
  reducedMotion = PATH_MORPHING_DEFAULTS.reducedMotion,
  replayNonce: replayNonceProp = PATH_MORPHING_DEFAULTS.replayNonce,
}: PathMorphingProps) {
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

  const [pathIndex, setPathIndex] = useState(0);
  const progress = useMotionValue(pathIndex);
  const fill = useTransform(progress, paths.map(getIndex), colors);
  const path = useFlubber(progress, paths, maxSegmentLength);
  const running = !paused && !reduce;

  useEffect(() => {
    if (!running) return;
    const animation = animate(progress, pathIndex, {
      duration: duration / Math.max(speed, 0.1),
      ease: 'easeInOut',
      onComplete: () => {
        if (pathIndex === paths.length - 1) {
          progress.set(0);
          setPathIndex(1);
        } else {
          setPathIndex(pathIndex + 1);
        }
      },
    });
    return () => animation.stop();
  }, [duration, pathIndex, progress, running, speed]);

  useEffect(() => {
    if (!reduce) return;
    progress.set(pathIndex);
  }, [pathIndex, progress, reduce]);

  const example = SVG_EXAMPLES.pathMorphing;
  const shapeName = labels[pathIndex] ?? labels[0];

  return (
    <SvgFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraRuntime={`Extra runtime: ${FLUBBER_PACKAGE} ${FLUBBER_VERSION}, licence ${FLUBBER_LICENCE}. ${FLUBBER_REPO}. Motion morphs similar d strings. It cannot mix unlike shapes.`}
      fixedNote="The SVG stays 400 by 400 with translate(10 10) scale(17 17) so the Material-style 24 px paths fill the stage. Path strings stay the flubber demo set. The cycle is continuous, so Pause and Speed replace Replay."
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="svg-path-morphing"
      running={running}
      runId={runId}
    >
      <svg
        className="academy-svg__morph"
        width="400"
        height="400"
        viewBox="0 0 400 400"
        role="img"
        aria-label={`${caption}: ${shapeName}`}
        data-shape={shapeName}
      >
        <g transform="translate(10 10) scale(17 17)">
          <motion.path fill={fill} d={path} />
        </g>
      </svg>
      <p className="academy-svg__shape-label">{shapeName}</p>
      <p className="academy-svg__caption">{caption}</p>
    </SvgFrame>
  );
}
