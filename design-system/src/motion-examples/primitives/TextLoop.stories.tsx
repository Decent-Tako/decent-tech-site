import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import type { Transition } from 'motion/react';
import { TextLoop } from '../vendor/motion-primitives/text-loop';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type LoopArgs = {
  children: string[];
  interval: number;
  trigger: boolean;
  mode: 'sync' | 'wait' | 'popLayout';
  transition: Transition;
  alternate: boolean;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/text-loop`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/text-loop.json`;

const FIXED_NOTE =
  'className is the Academy type style. variants stay at the upstream y/opacity set except Alternate direction, which flips y from onIndexChange. onIndexChange is a callback. Replay is not used; this loop is continuous. Pause sets trigger false. Size is 2.5rem so the stage swap is readable.';

const DEFAULT_STAGES = [
  'Start',
  'Learn',
  'Tools',
  'Challenge week',
] as const;

function LoopHost({
  children: items,
  interval,
  trigger,
  mode,
  transition,
  alternate,
}: LoopArgs) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const running = trigger && !paused;

  return (
    <PrimitiveFrame
      title="Text loop"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={FIXED_NOTE}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div
        className="mp-text-stage"
        data-testid="text-loop"
        data-index={String(index)}
        data-paused={paused ? 'true' : 'false'}
        data-mode={mode}
      >
        <p className="mp-text__lead">Academy stages</p>
        <TextLoop
          className="mp-text mp-text--loop"
          interval={interval}
          trigger={running}
          mode={mode}
          transition={transition}
          variants={
            alternate
              ? {
                  initial: {
                    y: index % 2 === 0 ? 24 : -24,
                    opacity: 0,
                  },
                  animate: { y: 0, opacity: 1 },
                  exit: {
                    y: index % 2 === 0 ? -24 : 24,
                    opacity: 0,
                  },
                }
              : undefined
          }
          onIndexChange={setIndex}
        >
          {items}
        </TextLoop>
      </div>
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Text loop',
  component: TextLoop,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    children: [...DEFAULT_STAGES],
    interval: 2,
    trigger: true,
    mode: 'popLayout',
    transition: { duration: 0.3 },
  },
  argTypes: {
    children: {
      control: 'object',
      description:
        'Academy stage names. Upstream type ReactNode[]. Default Start, Learn, Tools, Challenge week.',
    },
    interval: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.5 },
      description: 'Seconds between swaps. Upstream default 2. This is speed.',
    },
    trigger: {
      control: 'boolean',
      description: 'False clears the timer. Upstream default true.',
    },
    mode: {
      control: 'select',
      options: ['sync', 'wait', 'popLayout'],
      description: 'AnimatePresence mode. Upstream default popLayout.',
    },
    transition: {
      control: 'object',
      description: 'Upstream default { duration: 0.3 }.',
    },
    variants: { table: { disable: true } },
    onIndexChange: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives text-loop, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/text-loop . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/text-loop.tsx . Mechanism: setInterval(interval * 1000) advances currentIndex; AnimatePresence swaps a motion.div keyed by index. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof TextLoop>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playPauseLoop(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const root = canvas.getByTestId('text-loop');
  await waitFor(
    () => expect(Number(root.getAttribute('data-index'))).toBeGreaterThan(0),
    { timeout: 8000 },
  );
  const frozen = root.getAttribute('data-index');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(root).toHaveAttribute('data-paused', 'true');
  await new Promise((resolve) => window.setTimeout(resolve, 1200));
  await expect(root).toHaveAttribute('data-index', frozen ?? '');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
}

export const AcademyStages: Story = {
  render: (args) => (
    <LoopHost
      children={(args.children as string[]) ?? [...DEFAULT_STAGES]}
      interval={args.interval ?? 2}
      trigger={args.trigger ?? true}
      mode={(args.mode as LoopArgs['mode']) ?? 'popLayout'}
      transition={args.transition ?? { duration: 0.3 }}
      alternate={false}
    />
  ),
  play: async ({ canvas }) => {
    await playPauseLoop(canvas);
  },
};

export const AlternateDirection: Story = {
  args: {
    children: ['Find your Buddy', 'Publish your page', 'Send the first asks'],
    interval: 1.5,
    trigger: true,
    mode: 'popLayout',
  },
  render: (args) => (
    <LoopHost
      children={(args.children as string[]) ?? [...DEFAULT_STAGES]}
      interval={args.interval ?? 1.5}
      trigger={args.trigger ?? true}
      mode={(args.mode as LoopArgs['mode']) ?? 'popLayout'}
      transition={args.transition ?? { duration: 0.35 }}
      alternate
    />
  ),
  play: async ({ canvas }) => {
    await playPauseLoop(canvas);
  },
};

export const WaitMode: Story = {
  args: {
    children: ['$3,000 goal', '19–28 Oct 2026', '1–2 hours a week'],
    interval: 1.5,
    trigger: true,
    mode: 'wait',
  },
  render: (args) => (
    <LoopHost
      children={(args.children as string[]) ?? [...DEFAULT_STAGES]}
      interval={args.interval ?? 1.5}
      trigger={args.trigger ?? true}
      mode={(args.mode as LoopArgs['mode']) ?? 'wait'}
      transition={args.transition ?? { duration: 0.3 }}
      alternate={false}
    />
  ),
  play: async ({ canvas }) => {
    await playPauseLoop(canvas);
    await expect(canvas.getByTestId('text-loop')).toHaveAttribute(
      'data-mode',
      'wait',
    );
  },
};
