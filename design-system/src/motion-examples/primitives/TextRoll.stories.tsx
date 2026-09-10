import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { TextRoll } from '../vendor/motion-primitives/text-roll';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type RollArgs = {
  children: string;
  duration: number;
  enterStep: number;
  exitOffset: number;
  axis: 'x' | 'y';
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/text-roll`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/text-roll.json`;

const FIXED_NOTE =
  'className is the Academy type style. getEnterDelay and getExitDelay are functions, so the stories wrap them as enterStep and exitOffset. Upstream default enter i * 0.1 and exit i * 0.1 + 0.2. transition.ease stays easeIn. Size is 2.5rem so each 3D face is readable.';

function RollHost(args: RollArgs) {
  const [nonce, setNonce] = useState(0);
  const [complete, setComplete] = useState(false);
  const axis = args.axis;
  const variants =
    axis === 'y'
      ? {
          enter: {
            initial: { rotateY: 0 },
            animate: { rotateY: 90 },
          },
          exit: {
            initial: { rotateY: 90 },
            animate: { rotateY: 0 },
          },
        }
      : undefined;

  return (
    <PrimitiveFrame
      title="Text roll"
      docs={DOCS}
      registry={REGISTRY}
      fixedNote={FIXED_NOTE}
      replay
      onReplay={() => {
        setComplete(false);
        setNonce((current) => current + 1);
      }}
    >
      <div
        className="mp-text-stage"
        data-testid="text-roll"
        data-run={String(nonce)}
        data-complete={complete ? 'true' : 'false'}
        data-axis={axis}
      >
        <p className="mp-text__lead">Academy wordmark</p>
        <TextRoll
          key={nonce}
          className="mp-text mp-text--roll"
          duration={args.duration}
          getEnterDelay={(index) => index * args.enterStep}
          getExitDelay={(index) => index * args.enterStep + args.exitOffset}
          variants={variants}
          onAnimationComplete={() => setComplete(true)}
        >
          {args.children}
        </TextRoll>
      </div>
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Text roll',
  component: RollHost,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    children: 'UNCOMFORTABLE',
    duration: 0.5,
    enterStep: 0.1,
    exitOffset: 0.2,
    axis: 'x',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Source types this as string. Docs say ReactNode.',
    },
    duration: {
      control: { type: 'range', min: 0.15, max: 1.2, step: 0.05 },
      description: 'Seconds per face. Upstream default 0.5.',
    },
    enterStep: {
      control: { type: 'range', min: 0.02, max: 0.25, step: 0.01 },
      description: 'getEnterDelay = i * enterStep. Upstream default 0.1.',
    },
    exitOffset: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.05 },
      description:
        'getExitDelay = i * enterStep + exitOffset. Upstream default 0.2.',
    },
    axis: {
      control: 'select',
      options: ['x', 'y'],
      description:
        'x uses upstream rotateX variants. y passes rotateY through the variants prop.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives text-roll, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/text-roll . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/text-roll.tsx . Mechanism: two stacked motion.span faces per letter; outgoing rotateX 0 to 90, incoming 90 to 0, delays from getEnterDelay and getExitDelay. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof RollHost>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playRollReplay(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const root = canvas.getByTestId('text-roll');
  await waitFor(() => expect(root).toHaveAttribute('data-complete', 'true'), {
    timeout: 8000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => expect(root).toHaveAttribute('data-run', '1'));
  await waitFor(() => expect(root).toHaveAttribute('data-complete', 'true'), {
    timeout: 8000,
  });
}

export const Wordmark: Story = {
  render: (args) => <RollHost {...(args as RollArgs)} />,
  play: async ({ canvas }) => {
    await playRollReplay(canvas);
    await expect(canvas.getByTestId('text-roll')).toHaveAttribute(
      'data-axis',
      'x',
    );
  },
};

export const SlowStagger: Story = {
  args: {
    children: 'CHALLENGE',
    duration: 0.4,
    enterStep: 0.16,
    exitOffset: 0.3,
    axis: 'x',
  },
  render: (args) => <RollHost {...(args as RollArgs)} />,
  play: async ({ canvas }) => {
    await playRollReplay(canvas);
  },
};

export const RotateY: Story = {
  args: {
    children: '$3,000',
    duration: 0.45,
    enterStep: 0.08,
    exitOffset: 0.2,
    axis: 'y',
  },
  render: (args) => <RollHost {...(args as RollArgs)} />,
  play: async ({ canvas }) => {
    await playRollReplay(canvas);
    await expect(canvas.getByTestId('text-roll')).toHaveAttribute(
      'data-axis',
      'y',
    );
  },
};
