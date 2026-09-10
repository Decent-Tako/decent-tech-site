import type { Meta, StoryObj } from '@storybook/react-vite';
import { MotionConfig } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { BorderTrail } from '../vendor/motion-primitives/border-trail';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type TrailArgs = {
  size: number;
  duration: number;
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/border-trail`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/border-trail.json`;

function TrailHost({
  args,
  fixedNote,
  className,
  children,
}: {
  args: TrailArgs;
  fixedNote: string;
  className: string;
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <PrimitiveFrame
      title="Border trail"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div
        className={className}
        data-testid="border-trail"
        data-running={String(!paused)}
        data-size={String(args.size)}
      >
        <MotionConfig isStatic={paused}>
          <BorderTrail
            className="mp-trail-chip"
            size={args.size}
            transition={{
              repeat: Infinity,
              duration: args.duration,
              ease: 'linear',
            }}
          />
        </MotionConfig>
        {children}
      </div>
    </PrimitiveFrame>
  );
}

function WeekZeroCard(args: TrailArgs) {
  return (
    <TrailHost
      args={args}
      className="mp-trail-card"
      fixedNote="Continuous. Pause stops the loop. Duration is Speed. className is Academy yellow. style and onAnimationComplete are not controls. The card is 28rem so the trail has a long edge to travel."
    >
      <p className="mp-trail-kicker">Week 0 · Set Up</p>
      <h3 className="mp-trail-title">Publish the fundraising page.</h3>
      <p className="mp-trail-copy">
        Set the goal to $3,000. Find your Buddy and Team. Nothing here unlocks
        until the page is live.
      </p>
    </TrailHost>
  );
}

function PublishingCard(args: TrailArgs) {
  return (
    <TrailHost
      args={args}
      className="mp-trail-card mp-trail-card--load"
      fixedNote="Upstream loading card. Size 40 and duration 1.5 so the chip reads as a wait state while the page publishes."
    >
      <p className="mp-trail-kicker">Publishing</p>
      <h3 className="mp-trail-title">The page is going live.</h3>
      <p className="mp-trail-copy">Aim for $3,000 before 19 October 2026.</p>
    </TrailHost>
  );
}

function LineNote(args: TrailArgs) {
  return (
    <TrailHost
      args={args}
      className="mp-trail-card mp-trail-card--note"
      fixedNote="Upstream textarea example. The trail runs on the note for Week 0 copy. Size stays 60."
    >
      <label>
        <span className="mp-trail-kicker">Keep the line short</span>
        <textarea
          className="mp-note"
          defaultValue="I chose the 10-day challenge. It is uncomfortable because I will do it in public. Mobilise is the work. Set $3,000 and publish the page."
        />
      </label>
    </TrailHost>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Border trail',
  component: WeekZeroCard,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    size: 60,
    duration: 5,
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 16, max: 120, step: 4 },
      description: 'Chip size in pixels. Upstream default 60.',
    },
    duration: {
      control: { type: 'range', min: 1, max: 10, step: 0.5 },
      description:
        'Writes transition.duration in seconds. Upstream default 5. This is Speed.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives border-trail, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/border-trail . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/border-trail.tsx . Mechanism: offsetPath rect(0 auto auto 0 round size) plus offsetDistance 0% to 100% with repeat Infinity. Extra runtime: none. Prior Academy use: evaluated only. Continuous. Pause and duration (Speed).',
      },
    },
  },
} satisfies Meta<typeof WeekZeroCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function fromArgs(args: TrailArgs): TrailArgs {
  return {
    size: typeof args.size === 'number' ? args.size : 60,
    duration: typeof args.duration === 'number' ? args.duration : 5,
  };
}

async function playPause(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const root = canvas.getByTestId('border-trail');
  await expect(root).toHaveAttribute('data-running', 'true');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(root).toHaveAttribute('data-running', 'false');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(root).toHaveAttribute('data-running', 'true');
}

export const PublishCard: Story = {
  render: (args) => <WeekZeroCard {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await playPause(canvas);
  },
};

export const Publishing: Story = {
  args: {
    size: 40,
    duration: 1.5,
  },
  render: (args) => <PublishingCard {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('border-trail')).toHaveAttribute(
      'data-size',
      '40',
    );
    await playPause(canvas);
  },
};

export const ShortLine: Story = {
  args: {
    size: 60,
    duration: 6,
  },
  render: (args) => <LineNote {...fromArgs(args)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('Keep the line short')).toBeVisible();
    await playPause(canvas);
  },
};
