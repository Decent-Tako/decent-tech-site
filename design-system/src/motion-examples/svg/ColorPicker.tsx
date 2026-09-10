import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from 'motion/react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

import { COLOR_PICKER_DEFAULTS, UPSTREAM_PICKER_SIZE } from './defaults';
import { SvgFrame } from './Frame';
import {
  shouldReduce,
  SVG_EXAMPLES,
  type ReducedMotionMode,
} from './source';
import { usePointerPosition } from './usePointerPosition';

export type ColorPickerProps = {
  pushMagnitude?: number;
  damping?: number;
  stiffness?: number;
  size?: number;
  caption?: string;
  paused?: boolean;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function calculateAngle(index: number, totalInRing: number): number {
  return (index / totalInRing) * Math.PI * 2;
}

function calculateBasePosition(angle: number, radius: number) {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function calculateHue(angle: number): number {
  const hueDegrees = (angle * 180) / Math.PI - 90 - 180;
  return ((hueDegrees % 360) + 360) % 360;
}

function hueLabel(hue: number, ring: number): string {
  if (ring === 0) return 'Paper';
  return `Hue ${Math.round(hue)}`;
}

function ColorDot({
  ring,
  index,
  totalInRing,
  centerX,
  centerY,
  pointerX,
  pointerY,
  pushMagnitude,
  pushSpring,
  radius,
  selectedColor,
  setSelectedColor,
  active,
}: {
  ring: number;
  index: number;
  totalInRing: number;
  centerX: number;
  centerY: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  pushMagnitude: number;
  pushSpring: SpringOptions;
  radius: number;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  active: boolean;
}) {
  const baseRadius = ring * 20;
  const angle = calculateAngle(index, totalInRing);
  const { x: baseX, y: baseY } = calculateBasePosition(angle, baseRadius);

  let color = 'hsl(0, 0%, 100%)';
  let normalizedHue = 0;
  if (ring !== 0) {
    normalizedHue = calculateHue(angle);
    color =
      ring === 1
        ? `hsl(${normalizedHue}, 60%, 85%)`
        : `hsl(${normalizedHue}, 90%, 60%)`;
  }

  const pushDistance = useTransform(() => {
    if (!active || centerX === 0 || centerY === 0) return 0;

    const px = pointerX.get();
    const py = pointerY.get();

    const dx = px - centerX;
    const dy = py - centerY;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

    if (distanceFromCenter > radius) return 0;

    const dotX = centerX + baseX;
    const dotY = centerY + baseY;

    const cursorToDotX = dotX - px;
    const cursorToDotY = dotY - py;
    const cursorToDotDistance = Math.sqrt(
      cursorToDotX * cursorToDotX + cursorToDotY * cursorToDotY,
    );

    const minDistance = 80;
    if (cursorToDotDistance < minDistance) {
      const pushStrength = 1 - cursorToDotDistance / minDistance;
      return pushStrength * pushMagnitude;
    }

    return 0;
  });

  const pushAngle = useTransform(() => {
    if (!active || centerX === 0 || centerY === 0) return angle;

    const px = pointerX.get();
    const py = pointerY.get();

    const dotX = centerX + baseX;
    const dotY = centerY + baseY;

    const cursorToDotX = dotX - px;
    const cursorToDotY = dotY - py;

    return Math.atan2(cursorToDotY, cursorToDotX);
  });

  const pushX = useTransform(() => {
    const distance = pushDistance.get();
    const nextAngle = pushAngle.get();
    return Math.cos(nextAngle) * distance;
  });

  const pushY = useTransform(() => {
    const distance = pushDistance.get();
    const nextAngle = pushAngle.get();
    return Math.sin(nextAngle) * distance;
  });

  const springPushX = useSpring(pushX, pushSpring);
  const springPushY = useSpring(pushY, pushSpring);

  const x = useTransform(() => baseX + springPushX.get());
  const y = useTransform(() => baseY + springPushY.get());

  const dotVariants = {
    default: { scale: 1 },
    hover: {
      scale: 1.5,
      transition: { duration: 0.13 },
    },
  };

  const ringVariants = {
    default: { opacity: 0 },
    hover: {
      opacity: 0.4,
      transition: { duration: 0.13 },
    },
  };

  return (
    <motion.button
      type="button"
      className="academy-svg__color-dot"
      aria-label={hueLabel(normalizedHue, ring)}
      aria-pressed={selectedColor === color}
      style={{
        x,
        y,
        backgroundColor: color,
        willChange: 'transform, background-color',
      }}
      variants={dotVariants}
      initial="default"
      whileHover={active ? 'hover' : 'default'}
      whileTap={active ? { scale: 1.2 } : undefined}
      onTap={() => {
        if (!active) return;
        if (selectedColor === color) {
          setSelectedColor(null);
        } else {
          setSelectedColor(color);
        }
      }}
      transition={{
        scale: { type: 'spring', damping: 30, stiffness: 200 },
      }}
    >
      <motion.div
        className="academy-svg__color-dot-ring"
        variants={ringVariants}
        aria-hidden="true"
      />
    </motion.button>
  );
}

function GradientCircle({
  index,
  totalInRing,
  centerX,
  centerY,
  pointerX,
  pointerY,
  containerRadius,
  active,
}: {
  index: number;
  totalInRing: number;
  centerX: number;
  centerY: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  containerRadius: number;
  active: boolean;
}) {
  const angle = calculateAngle(index, totalInRing);
  const baseRadius = containerRadius - 40;
  const { x: baseX, y: baseY } = calculateBasePosition(angle, baseRadius);
  const normalizedHue = calculateHue(angle);

  const gradient = `radial-gradient(circle, hsla(${normalizedHue}, 90%, 60%, 1) 0%, hsla(${normalizedHue}, 90%, 60%, 0) 66%)`;

  const proximity = useTransform(() => {
    if (!active || centerX === 0 || centerY === 0) return 0;

    const px = pointerX.get();
    const py = pointerY.get();

    const gradientX = centerX + baseX;
    const gradientY = centerY + baseY;

    const dx = px - gradientX;
    const dy = py - gradientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 100;
    return Math.max(0, 1 - distance / maxDistance);
  });

  const opacity = useTransform(proximity, [0, 1], [0.15, 0.35]);
  const scale = useTransform(proximity, [0, 1], [1, 1.2]);

  const springOpacity = useSpring(opacity, {
    damping: 30,
    stiffness: 100,
  });
  const springScale = useSpring(scale, {
    damping: 30,
    stiffness: 100,
  });

  return (
    <motion.div
      className="academy-svg__gradient-circle"
      aria-hidden="true"
      style={{
        x: baseX,
        y: baseY,
        opacity: springOpacity,
        scale: springScale,
        background: gradient,
        willChange: 'transform, opacity',
      }}
    />
  );
}

const ORIGINAL_STOPS = [
  'hsl(0, 90%, 60%)',
  'hsl(30, 90%, 60%)',
  'hsl(60, 90%, 60%)',
  'hsl(90, 90%, 60%)',
  'hsl(120, 90%, 60%)',
  'hsl(150, 90%, 60%)',
  'hsl(180, 90%, 60%)',
  'hsl(210, 90%, 60%)',
  'hsl(240, 90%, 60%)',
  'hsl(270, 90%, 60%)',
  'hsl(300, 90%, 60%)',
  'hsl(330, 90%, 60%)',
  'hsl(360, 90%, 60%)',
] as const;

export function ColorPicker({
  pushMagnitude = COLOR_PICKER_DEFAULTS.pushMagnitude,
  damping = COLOR_PICKER_DEFAULTS.damping,
  stiffness = COLOR_PICKER_DEFAULTS.stiffness,
  size = COLOR_PICKER_DEFAULTS.size,
  caption = COLOR_PICKER_DEFAULTS.caption,
  paused: pausedProp = COLOR_PICKER_DEFAULTS.paused,
  reducedMotion = COLOR_PICKER_DEFAULTS.reducedMotion,
  replayNonce: replayNonceProp = COLOR_PICKER_DEFAULTS.replayNonce,
}: ColorPickerProps) {
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [{ centerX, centerY, radius }, setContainerDimensions] = useState({
    centerX: 0,
    centerY: 0,
    radius: 200,
  });

  const pointer = usePointerPosition();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const active = !paused && !reduce;
  const pushSpring = { damping, stiffness };

  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDimensions({
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        radius: rect.width / 2,
      });
    }
  }, [size, runId]);

  const rings = [{ count: 1 }, { count: 6 }, { count: 12 }];
  const dots: Array<{ ring: number; index: number; totalInRing: number }> = [];
  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count; i += 1) {
      dots.push({
        ring: ringIndex,
        index: i,
        totalInRing: ring.count,
      });
    }
  });

  const stop0 = useMotionValue<string>(ORIGINAL_STOPS[0]);
  const stop1 = useMotionValue<string>(ORIGINAL_STOPS[1]);
  const stop2 = useMotionValue<string>(ORIGINAL_STOPS[2]);
  const stop3 = useMotionValue<string>(ORIGINAL_STOPS[3]);
  const stop4 = useMotionValue<string>(ORIGINAL_STOPS[4]);
  const stop5 = useMotionValue<string>(ORIGINAL_STOPS[5]);
  const stop6 = useMotionValue<string>(ORIGINAL_STOPS[6]);
  const stop7 = useMotionValue<string>(ORIGINAL_STOPS[7]);
  const stop8 = useMotionValue<string>(ORIGINAL_STOPS[8]);
  const stop9 = useMotionValue<string>(ORIGINAL_STOPS[9]);
  const stop10 = useMotionValue<string>(ORIGINAL_STOPS[10]);
  const stop11 = useMotionValue<string>(ORIGINAL_STOPS[11]);
  const stop12 = useMotionValue<string>(ORIGINAL_STOPS[12]);
  const stopMotionValues: MotionValue<string>[] = [
    stop0, stop1, stop2, stop3, stop4, stop5, stop6, stop7, stop8, stop9,
    stop10, stop11, stop12,
  ];

  useEffect(() => {
    if (selectedColor !== null) {
      for (const stopValue of stopMotionValues) {
        void animate(stopValue, selectedColor, { duration: 0.2 });
      }
    } else {
      for (let i = 0; i < stopMotionValues.length; i += 1) {
        void animate(stopMotionValues[i], ORIGINAL_STOPS[i], {
          duration: 0.2,
        });
      }
    }
    // stopMotionValues is a stable tuple of Motion values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  const gradientBackground = useTransform(() => {
    let stops = '';
    for (let i = 0; i < stopMotionValues.length; i += 1) {
      stops += stopMotionValues[i].get();
      if (i < stopMotionValues.length - 1) {
        stops += ', ';
      }
    }
    return `conic-gradient(from 0deg, ${stops})`;
  });

  const gradientScale = useMotionValue(1);

  useEffect(() => {
    if (selectedColor !== null) {
      void animate(gradientScale, 1.1, {
        type: 'spring',
        visualDuration: 0.2,
        bounce: 0.8,
        velocity: 2,
      });
    } else {
      void animate(gradientScale, 1, {
        type: 'spring',
        visualDuration: 0.2,
        bounce: 0,
      });
    }
  }, [selectedColor, gradientScale]);

  const example = SVG_EXAMPLES.colorPicker;
  const scale = size / UPSTREAM_PICKER_SIZE;

  return (
    <SvgFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      example={example.example}
      live={example.live}
      extraDocs="https://motion.dev/docs/react-use-transform"
      extraRuntime="Extra runtime: Academy usePointerPosition. motion-plus 1.5.1 is MIT but exclusive to Motion+ members. Motion does not export usePointerPosition. The adapter is one shared motionValue pair on pointermove."
      fixedNote={`The upstream wrapper is 140 px. That is too small for 32 px dots on a Storybook canvas. Default size is 320 px, a CSS scale of the 140 px geometry, so the three rings stay legible. Ring step 20 px, dot 32 px, and minDistance 80 px stay fixed. useLayoutEffect measures the centre once per size, not on resize. Pointer tracking is continuous, so Pause freezes the push. Replay clears the selection.`}
      controlKind="pause"
      paused={paused || reduce}
      onPause={() => setPaused((current) => !current)}
      reducedMotion={reducedMotion}
      testId="svg-color-picker"
      running={active}
      runId={runId}
      stageClassName="academy-svg__stage--picker"
    >
      <div
        className="academy-svg__picker-stage"
        style={
          {
            '--picker-size': `${size}px`,
            '--picker-scale': String(scale),
          } as CSSProperties
        }
      >
        <div className="academy-svg__picker">
          <div className="academy-svg__picker-bg">
            <motion.div
              className="academy-svg__picker-gradient"
              style={{
                background: gradientBackground,
                scale: gradientScale,
              }}
            />
            <motion.div
              className="academy-svg__picker-solid"
              animate={{
                scale: selectedColor !== null ? 0.9 : 0.98,
              }}
              transition={{
                type: 'spring',
                visualDuration: 0.2,
                bounce: 0.2,
              }}
            />
          </div>
          <div ref={containerRef} className="academy-svg__picker-face">
            {Array.from({ length: 6 }).map((_, index) => (
              <GradientCircle
                key={`gradient-${index}`}
                index={index}
                totalInRing={6}
                centerX={centerX}
                centerY={centerY}
                pointerX={pointer.x}
                pointerY={pointer.y}
                containerRadius={radius}
                active={active}
              />
            ))}
            {dots
              .slice()
              .reverse()
              .map((dot) => (
                <ColorDot
                  key={`${dot.ring}-${dot.index}`}
                  ring={dot.ring}
                  index={dot.index}
                  totalInRing={dot.totalInRing}
                  centerX={centerX}
                  centerY={centerY}
                  pointerX={pointer.x}
                  pointerY={pointer.y}
                  radius={radius}
                  pushMagnitude={pushMagnitude}
                  pushSpring={pushSpring}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  active={active}
                />
              ))}
          </div>
        </div>
      </div>
      <p className="academy-svg__picked">
        {selectedColor
          ? `Week banner ${selectedColor}`
          : 'No week banner colour yet'}
      </p>
      <p className="academy-svg__caption">{caption}</p>
      <button
        type="button"
        className="academy-svg__action"
        onClick={() => {
          setSelectedColor(null);
          setRunId((current) => current + 1);
        }}
      >
        Replay
      </button>
    </SvgFrame>
  );
}
