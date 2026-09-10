import type { Meta, StoryObj } from '@storybook/react-vite';
import { MotionConfig } from 'motion/react';
import { useState } from 'react';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { SpinningText } from '../vendor/motion-primitives/spinning-text';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type SpinArgs = {
  children: string;
  duration?: number;
  reverse?: boolean;
  fontSize?: number;
  radius?: number;
};

const SPRING_VARIANTS = {
  container: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      rotate: 360,
      transition: {
        type: 'spring' as const,
        bounce: 0,
        duration: 6,
        repeat: Infinity,
        staggerChildren: 0.03,
      },
    },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(4px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
};

function SpinHost({
  args,
  fixedNote,
  easeInOut,
  springVariants,
}: {
  args: SpinArgs;
  fixedNote: string;
  easeInOut?: boolean;
  springVariants?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <PrimitiveFrame
      title="Spinning text"
      docs={`${MOTION_PRIMITIVES.docs}/docs/spinning-text`}
      registry={`${MOTION_PRIMITIVES.registry}/spinning-text.json`}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div
        className="mp-spin"
        data-testid="spinning-text"
        data-running={String(!paused)}
      >
        <MotionConfig isStatic={paused}>
          <SpinningText
            duration={args.duration}
            reverse={args.reverse}
            fontSize={args.fontSize}
            radius={args.radius}
            className="mp-spin__text"
            transition={
              easeInOut
                ? { ease: 'easeInOut', repeat: Infinity }
                : undefined
            }
            variants={springVariants ? SPRING_VARIANTS : undefined}
          >
            {args.children}
          </SpinningText>
        </MotionConfig>
      </div>
    </PrimitiveFrame>
  );
}

function Ring(args: SpinArgs) {
  return (
    <SpinHost
      args={args}
      fixedNote="Stage is 18rem so a radius of 5ch at 1.2rem stays inside the box. The CSS rotate then translateY formula stays fixed; it is the ring. Continuous. Pause and duration (Speed)."
    />
  );
}

function ReverseRing(args: SpinArgs) {
  return (
    <SpinHost
      args={args}
      easeInOut
      fixedNote="Upstream custom transition. easeInOut replaces linear. reverse is true, so the ring turns the other way. Duration 6 is that example."
    />
  );
}

function SpringRing(args: SpinArgs) {
  return (
    <SpinHost
      args={args}
      springVariants
      fixedNote="Upstream custom variants. Letters fade in from blur, then the ring springs. variants are this story, not a slider. duration on the control does not apply while these variants set their own 6s spring."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Spinning text',
  component: SpinningText,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    children: 'FIND YOUR UNCOMFORTABLE • ',
    duration: 10,
    reverse: false,
    fontSize: 1.2,
    radius: 5,
  },
  argTypes: {
    children: { control: 'text' },
    duration: {
      control: { type: 'range', min: 2, max: 20, step: 1 },
      description: 'One rotation in seconds. Upstream default 10. This is Speed.',
    },
    reverse: { control: 'boolean' },
    fontSize: {
      control: { type: 'range', min: 0.8, max: 1.8, step: 0.1 },
      description: 'Letter size in rem. Upstream basic example 1.2.',
    },
    radius: {
      control: { type: 'range', min: 3, max: 8, step: 0.5 },
      description: 'Ring radius in ch. Upstream default 5.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives spinning-text, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/spinning-text . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/spinning-text.tsx . Mechanism: each letter is placed with --index and --radius, then the container variants.visible.rotate is 360 or -360 with repeat Infinity. Extra runtime: none. Prior Academy use: evaluated only. Continuous. Pause and duration (Speed).',
      },
    },
  },
} satisfies Meta<typeof SpinningText>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playPause(canvas: {
  getByTestId: (id: string) => HTMLElement;
  getByRole: (role: 'button', options: { name: string }) => HTMLElement;
}) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const root = canvas.getByTestId('spinning-text');
  await expect(root).toHaveAttribute('data-running', 'true');
  await expect(root).toHaveTextContent('FIND YOUR UNCOMFORTABLE • ');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(root).toHaveAttribute('data-running', 'false');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(root).toHaveAttribute('data-running', 'true');
}

export const UncomfortableRing: Story = {
  render: (args) => <Ring {...args} />,
  play: async ({ canvas }) => {
    await playPause(canvas);
  },
};

export const GoalReverse: Story = {
  args: {
    children: '$3,000 GOAL • $3,000 GOAL • ',
    duration: 6,
    reverse: true,
    fontSize: 1,
    radius: 7,
  },
  render: (args) => <ReverseRing {...args} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const root = canvas.getByTestId('spinning-text');
    await expect(root).toHaveTextContent('$3,000 GOAL • $3,000 GOAL • ');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(root).toHaveAttribute('data-running', 'false');
  },
};

export const SpringLetters: Story = {
  args: {
    children: 'WEEK 0 SET UP • WEEK 0 SET UP • ',
    duration: 6,
    reverse: false,
    fontSize: 1,
    radius: 5.5,
  },
  render: (args) => <SpringRing {...args} />,
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const root = canvas.getByTestId('spinning-text');
    await expect(root).toHaveTextContent('WEEK 0 SET UP • WEEK 0 SET UP • ');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(root).toHaveAttribute('data-running', 'false');
  },
};
