import {
  motion,
  transform,
  useAnimate,
  useReducedMotion,
} from 'motion/react';
import { useEffect, useId, useState } from 'react';

import { CHARACTERS_REMAINING_DEFAULTS } from './defaults';
import { TextFrame } from './Frame';
import {
  shouldReduce,
  TEXT_EXAMPLES,
  type ReducedMotionMode,
} from './source';

export type CharactersRemainingProps = {
  maxLength?: number;
  lowAt?: number;
  restAt?: number;
  velocityAtZero?: number;
  velocityAtFive?: number;
  stiffness?: number;
  damping?: number;
  lowColor?: string;
  restColor?: string;
  label?: string;
  reducedMotion?: ReducedMotionMode;
  replayNonce?: number;
};

function CharactersRemainingRun({
  maxLength,
  lowAt,
  restAt,
  velocityAtZero,
  velocityAtFive,
  stiffness,
  damping,
  lowColor,
  restColor,
  label,
  skip,
}: {
  maxLength: number;
  lowAt: number;
  restAt: number;
  velocityAtZero: number;
  velocityAtFive: number;
  stiffness: number;
  damping: number;
  lowColor: string;
  restColor: string;
  label: string;
  skip: boolean;
}) {
  const [value, setValue] = useState('');
  const charactersRemaining = maxLength - value.length;
  const [counterRef, animate] = useAnimate();
  const inputId = useId();
  const mapRemainingToColor = transform([lowAt, restAt], [lowColor, restColor]);

  useEffect(() => {
    if (skip || charactersRemaining > restAt) return;

    const mapRemainingToSpringVelocity = transform(
      [0, 5],
      [velocityAtZero, velocityAtFive],
    );

    void animate(
      counterRef.current,
      { scale: 1 },
      {
        type: 'spring',
        velocity: mapRemainingToSpringVelocity(charactersRemaining),
        stiffness,
        damping,
      },
    );
  }, [
    animate,
    charactersRemaining,
    counterRef,
    damping,
    skip,
    stiffness,
    restAt,
    velocityAtFive,
    velocityAtZero,
  ]);

  return (
    <div className="remaining">
      <label className="text-example__caption" htmlFor={inputId}>
        {label}
      </label>
      <div className="remaining__field">
        <input
          id={inputId}
          className="remaining__input"
          value={value}
          maxLength={maxLength}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="remaining__count">
          <motion.span
            ref={counterRef}
            data-remaining={String(charactersRemaining)}
            style={{
              color: mapRemainingToColor(charactersRemaining),
              willChange: 'transform',
            }}
          >
            {charactersRemaining}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

export function CharactersRemaining({
  maxLength = CHARACTERS_REMAINING_DEFAULTS.maxLength,
  lowAt = CHARACTERS_REMAINING_DEFAULTS.lowAt,
  restAt = CHARACTERS_REMAINING_DEFAULTS.restAt,
  velocityAtZero = CHARACTERS_REMAINING_DEFAULTS.velocityAtZero,
  velocityAtFive = CHARACTERS_REMAINING_DEFAULTS.velocityAtFive,
  stiffness = CHARACTERS_REMAINING_DEFAULTS.stiffness,
  damping = CHARACTERS_REMAINING_DEFAULTS.damping,
  lowColor = CHARACTERS_REMAINING_DEFAULTS.lowColor,
  restColor = CHARACTERS_REMAINING_DEFAULTS.restColor,
  label = CHARACTERS_REMAINING_DEFAULTS.label,
  reducedMotion = CHARACTERS_REMAINING_DEFAULTS.reducedMotion,
  replayNonce = CHARACTERS_REMAINING_DEFAULTS.replayNonce,
}: CharactersRemainingProps) {
  const prefersReduce = useReducedMotion();
  const reduce = shouldReduce(reducedMotion, prefersReduce);
  const [runId, setRunId] = useState(0);
  const example = TEXT_EXAMPLES.charactersRemaining;

  return (
    <TextFrame
      title={example.title}
      mechanism={example.mechanism}
      docs={example.docs}
      extraDocs={example.extraDocs}
      example={example.example}
      live={example.live}
      fixedNote="Upstream maps remaining [2, 6] to #ff008c and #ccc. Academy uses blue #0035B1 at 2 remaining and ink #212121 at 6 or more, because yellow on paper fails contrast. Input width 300 px and font 32 px stay the upstream box so the count overlay sits on the field. will-change: transform is the upstream hint. Replay clears the field."
      onReplay={() => setRunId((current) => current + 1)}
      reducedMotion={reducedMotion}
      testId="text-characters-remaining"
      running={!reduce}
      runId={runId}
    >
      <CharactersRemainingRun
        key={`${runId}-${replayNonce}-${maxLength}-${lowAt}-${restAt}-${reduce}`}
        maxLength={maxLength}
        lowAt={lowAt}
        restAt={restAt}
        velocityAtZero={velocityAtZero}
        velocityAtFive={velocityAtFive}
        stiffness={stiffness}
        damping={damping}
        lowColor={lowColor}
        restColor={restColor}
        label={label}
        skip={reduce}
      />
    </TextFrame>
  );
}
