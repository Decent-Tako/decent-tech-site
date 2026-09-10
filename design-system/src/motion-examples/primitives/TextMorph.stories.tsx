import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { TextMorph } from '../vendor/motion-primitives/text-morph';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type MorphArgs = {
  children: string;
  as: 'p' | 'span' | 'h2';
  stiffness: number;
  damping: number;
  mass: number;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/text-morph`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/text-morph.json`;
const STAGE_CYCLE = ['Start', 'Learn', 'Tools', 'Challenge'] as const;

const FIXED_NOTE =
  'className is the Academy type style. variants stay at the upstream opacity set. transition is the real prop; stiffness, damping, and mass fill that spring. Docs omit these two props. Size is 1.75rem on the button and 2.75rem on the cycle so shared letters stay readable.';

function springOf(args: MorphArgs) {
  return {
    type: 'spring' as const,
    stiffness: args.stiffness,
    damping: args.damping,
    mass: args.mass,
  };
}

function PublishHost(args: MorphArgs) {
  const [live, setLive] = useState(false);
  const [nonce, setNonce] = useState(0);
  const label = live ? 'Live' : args.children;

  return (
    <PrimitiveFrame
      title="Text morph"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={`${FIXED_NOTE} This is the upstream button example. Press the button to morph Publish into Live. Replay restores Publish.`}
      replay
      onReplay={() => {
        setLive(false);
        setNonce((current) => current + 1);
      }}
    >
      <div className="mp-text-stage">
        <p className="mp-text__lead">Week 0 page</p>
        <button
          type="button"
          className="mp-morph-button"
          data-testid="text-morph"
          data-run={String(nonce)}
          data-label={label}
          onClick={() => setLive((current) => !current)}
        >
          <TextMorph
            key={nonce}
            as={args.as}
            transition={springOf(args)}
          >
            {label}
          </TextMorph>
        </button>
      </div>
    </PrimitiveFrame>
  );
}

function CycleHost(args: MorphArgs) {
  const stages = STAGE_CYCLE;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % stages.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [paused, stages.length]);

  const label = stages[index] ?? 'Start';

  return (
    <PrimitiveFrame
      title="Text morph"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={`${FIXED_NOTE} The cycle is story-level. Pause stops the timer. Shared letters keep a layoutId. as is h2 because upstream default p plus aria-label fails axe aria-prohibited-attr.`}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div
        className="mp-text-stage"
        data-testid="text-morph"
        data-label={label}
        data-paused={paused ? 'true' : 'false'}
      >
        <p className="mp-text__lead">Academy stages</p>
        <TextMorph
          as={args.as}
          className="mp-text"
          transition={springOf(args)}
        >
          {label}
        </TextMorph>
      </div>
    </PrimitiveFrame>
  );
}

function AmountHost(args: MorphArgs) {
  const [goal, setGoal] = useState(true);
  const [nonce, setNonce] = useState(0);
  const label = goal ? args.children : 'Goal';

  return (
    <PrimitiveFrame
      title="Text morph"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={`${FIXED_NOTE} Press the figure to morph $3,000 into Goal. Replay restores $3,000.`}
      replay
      onReplay={() => {
        setGoal(true);
        setNonce((current) => current + 1);
      }}
    >
      <div className="mp-text-stage">
        <p className="mp-text__lead">Participant goal</p>
        <button
          type="button"
          className="mp-morph-button"
          data-testid="text-morph"
          data-run={String(nonce)}
          data-label={label}
          onClick={() => setGoal((current) => !current)}
        >
          <TextMorph
            key={nonce}
            as={args.as}
            transition={springOf(args)}
          >
            {label}
          </TextMorph>
        </button>
      </div>
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Text morph',
  component: PublishHost,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    children: 'Publish',
    as: 'span',
    stiffness: 280,
    damping: 18,
    mass: 0.3,
  },
  argTypes: {
    children: {
      control: 'text',
      description:
        'Current string. The Publish story toggles this between Publish and Live.',
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'h2'],
      description:
        'Upstream default p. Axe 4.13 forbids aria-label on p, so the cycle story uses h2 and the button stories use span.',
    },
    stiffness: {
      control: { type: 'range', min: 80, max: 480, step: 10 },
      description: 'transition.stiffness. Upstream default 280.',
    },
    damping: {
      control: { type: 'range', min: 8, max: 40, step: 1 },
      description: 'transition.damping. Upstream default 18.',
    },
    mass: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
      description: 'transition.mass. Upstream default 0.3.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives text-morph, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/text-morph . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/text-morph.tsx . Mechanism: useId plus per-character layoutId; AnimatePresence popLayout morphs shared letters. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof PublishHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PublishToggle: Story = {
  render: (args) => <PublishHost {...(args as MorphArgs)} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const root = canvas.getByTestId('text-morph');
    await expect(root).toHaveAttribute('data-label', 'Publish');
    await userEvent.click(root);
    await waitFor(() =>
      expect(root).toHaveAttribute('data-label', 'Live'),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() =>
      expect(root).toHaveAttribute('data-label', 'Publish'),
    );
  },
};

export const StageCycle: Story = {
  args: {
    children: 'Start',
    as: 'h2',
  },
  render: (args) => <CycleHost {...(args as MorphArgs)} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const root = canvas.getByTestId('text-morph');
    await waitFor(
      () => expect(root.getAttribute('data-label')).not.toBe('Start'),
      { timeout: 5000 },
    );
    const frozen = root.getAttribute('data-label');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(root).toHaveAttribute('data-paused', 'true');
    await new Promise((resolve) => window.setTimeout(resolve, 1800));
    await expect(root).toHaveAttribute('data-label', frozen ?? '');
  },
};

export const GoalAmount: Story = {
  args: {
    children: '$3,000',
  },
  render: (args) => <AmountHost {...(args as MorphArgs)} />,
  play: async ({ canvas }) => {
    const root = canvas.getByTestId('text-morph');
    await expect(root).toHaveAttribute('data-label', '$3,000');
    await userEvent.click(root);
    await waitFor(() => expect(root).toHaveAttribute('data-label', 'Goal'));
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() =>
      expect(root).toHaveAttribute('data-label', '$3,000'),
    );
  },
};
