import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import {
  TextEffect,
  type PerType,
  type PresetType,
} from '../vendor/motion-primitives/text-effect';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type EffectArgs = {
  children: string;
  per: PerType;
  preset: PresetType;
  delay: number;
  speedReveal: number;
  speedSegment: number;
  trigger: boolean;
  as: 'p' | 'h2' | 'span';
};

const DOCS = `${MOTION_PRIMITIVES.docs}/docs/text-effect`;
const REGISTRY = `${MOTION_PRIMITIVES.registry}/text-effect.json`;

const FIXED_NOTE =
  'className is the Academy type style. variants, containerTransition, and segmentTransition stay undefined so preset, speedReveal, and speedSegment set the motion. Callbacks are not controls. Replay remounts this one-shot. Size is 2.75rem so each word or character is readable.';

function EffectHost(args: EffectArgs) {
  const [nonce, setNonce] = useState(0);
  const [complete, setComplete] = useState(false);
  const textClass =
    args.per === 'line' ? 'mp-text mp-text--lines' : 'mp-text';

  return (
    <PrimitiveFrame
      title="Text effect"
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
        data-testid="text-effect"
        data-run={String(nonce)}
        data-complete={complete ? 'true' : 'false'}
        data-per={args.per}
        data-preset={args.preset}
      >
        <p className="mp-text__lead">Week 0 goal</p>
        <TextEffect
          key={nonce}
          as={args.as}
          className={textClass}
          per={args.per}
          preset={args.preset}
          delay={args.delay}
          speedReveal={args.speedReveal}
          speedSegment={args.speedSegment}
          trigger={args.trigger}
          onAnimationComplete={() => setComplete(true)}
        >
          {args.children}
        </TextEffect>
      </div>
    </PrimitiveFrame>
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Text effect',
  component: TextEffect,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    children: 'Set your goal to $3,000.',
    per: 'word',
    preset: 'fade',
    delay: 0,
    speedReveal: 1,
    speedSegment: 1,
    trigger: true,
    as: 'p',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Academy copy. Upstream required string.',
    },
    per: {
      control: 'select',
      options: ['word', 'char', 'line'],
      description: 'Upstream default word.',
    },
    preset: {
      control: 'select',
      options: ['blur', 'fade-in-blur', 'scale', 'fade', 'slide'],
      description:
        'Docs list blur-sm. Source and registry use blur. Default fade.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.1 },
      description: 'Seconds before stagger starts. Upstream default 0.',
    },
    speedReveal: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides stagger. Upstream default 1.',
    },
    speedSegment: {
      control: { type: 'range', min: 0.25, max: 3, step: 0.25 },
      description: 'Divides item duration 0.3s. Upstream default 1.',
    },
    trigger: {
      control: 'boolean',
      description: 'False unmounts the tree. Upstream default true.',
    },
    as: {
      control: 'select',
      options: ['p', 'h2', 'span'],
      description: 'Upstream default p.',
    },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives text-effect, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/text-effect . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/text-effect.tsx . Mechanism: AnimatePresence mounts motion[as]; staggerChildren is defaultStaggerTimes[per] / speedReveal; each segment duration is 0.3 / speedSegment. Prior Academy use: evaluated only.',
      },
    },
  },
} satisfies Meta<typeof TextEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playEffectReplay(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  const root = canvas.getByTestId('text-effect');
  await waitFor(() => expect(root).toHaveAttribute('data-complete', 'true'), {
    timeout: 8000,
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await waitFor(() => expect(root).toHaveAttribute('data-run', '1'));
  await waitFor(() => expect(root).toHaveAttribute('data-complete', 'true'), {
    timeout: 8000,
  });
}

export const GoalLede: Story = {
  render: (args) => <EffectHost {...(args as EffectArgs)} />,
  play: async ({ canvas }) => {
    await playEffectReplay(canvas);
    await expect(canvas.getByTestId('text-effect')).toHaveAttribute(
      'data-preset',
      'fade',
    );
  },
};

export const ChallengeChars: Story = {
  args: {
    children: 'CHALLENGE',
    per: 'char',
    preset: 'scale',
    delay: 0,
    speedReveal: 1,
    speedSegment: 1,
    trigger: true,
    as: 'p',
  },
  render: (args) => <EffectHost {...(args as EffectArgs)} />,
  play: async ({ canvas }) => {
    await playEffectReplay(canvas);
    await expect(canvas.getByTestId('text-effect')).toHaveAttribute(
      'data-per',
      'char',
    );
  },
};

export const WeekLines: Story = {
  args: {
    children:
      'Week 0: publish the page\nLearn: one week at a time\nChallenge: 19–28 October 2026',
    per: 'line',
    preset: 'slide',
    delay: 0,
    speedReveal: 1,
    speedSegment: 1,
    trigger: true,
    as: 'p',
  },
  render: (args) => <EffectHost {...(args as EffectArgs)} />,
  play: async ({ canvas }) => {
    await playEffectReplay(canvas);
    await expect(canvas.getByTestId('text-effect')).toHaveAttribute(
      'data-per',
      'line',
    );
  },
};
