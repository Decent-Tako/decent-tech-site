import type { Meta, StoryObj } from '@storybook/react-vite';
import { MotionConfig } from 'motion/react';
import { useState } from 'react';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { TextShimmerWave } from '../vendor/motion-primitives/text-shimmer-wave';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type WaveArgs = {
  children: string;
  duration?: number;
  zDistance?: number;
  xDistance?: number;
  yDistance?: number;
  spread?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
};

const INK_BLUE =
  '[--base-color:#212121] [--base-gradient-color:#0035B1] dark:[--base-color:#212121] dark:[--base-gradient-color:#0035B1]';
const INK_YELLOW =
  '[--base-color:#212121] [--base-gradient-color:#DEF54F] dark:[--base-color:#212121] dark:[--base-gradient-color:#DEF54F]';

function WaveHost({
  args,
  colorClass,
  fixedNote,
}: {
  args: WaveArgs;
  colorClass: string;
  fixedNote: string;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <PrimitiveFrame
      title="Text shimmer wave"
      docs={`${MOTION_PRIMITIVES.docs}/docs/text-shimmer-wave`}
      registry={`${MOTION_PRIMITIVES.registry}/text-shimmer-wave.json`}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div data-testid="text-shimmer-wave" data-running={String(!paused)}>
        <MotionConfig isStatic={paused}>
          <TextShimmerWave
            duration={args.duration}
            zDistance={args.zDistance}
            xDistance={args.xDistance}
            yDistance={args.yDistance}
            spread={args.spread}
            scaleDistance={args.scaleDistance}
            rotateYDistance={args.rotateYDistance}
            className={`mp-wave ${colorClass}`}
          >
            {args.children}
          </TextShimmerWave>
        </MotionConfig>
      </div>
    </PrimitiveFrame>
  );
}

function GoalWave(args: WaveArgs) {
  return (
    <WaveHost
      args={args}
      colorClass={INK_BLUE}
      fixedNote="Continuous. Pause stops the per-letter wave. Duration is Speed. perspective 500px and preserve-3d stay fixed. They are the wave. as stays p."
    />
  );
}

function ColourWave(args: WaveArgs) {
  return (
    <WaveHost
      args={args}
      colorClass={INK_YELLOW}
      fixedNote="Upstream colour example, rebuilt as Academy copy. zDistance 1 and rotateYDistance 20 are that example. --base-gradient-color is yellow #DEF54F."
    />
  );
}

function StrongWave(args: WaveArgs) {
  return (
    <WaveHost
      args={args}
      colorClass={INK_BLUE}
      fixedNote="Larger z, x, and y distances. The letters travel further in 3D than the default wave."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Text shimmer wave',
  component: TextShimmerWave,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    children: 'Setting the $3,000 goal',
    duration: 1,
    zDistance: 10,
    xDistance: 2,
    yDistance: -2,
    spread: 1,
    scaleDistance: 1.1,
    rotateYDistance: 10,
  },
  argTypes: {
    children: { control: 'text' },
    duration: {
      control: { type: 'range', min: 0.4, max: 3, step: 0.1 },
      description: 'One letter cycle in seconds. Upstream default 1. This is Speed.',
    },
    zDistance: { control: { type: 'range', min: 0, max: 40, step: 1 } },
    xDistance: { control: { type: 'range', min: -10, max: 10, step: 1 } },
    yDistance: { control: { type: 'range', min: -10, max: 10, step: 1 } },
    spread: {
      control: { type: 'range', min: 0.5, max: 4, step: 0.1 },
      description: 'Delay and repeatDelay divisor. Upstream default 1.',
    },
    scaleDistance: {
      control: { type: 'range', min: 1, max: 1.6, step: 0.05 },
    },
    rotateYDistance: { control: { type: 'range', min: 0, max: 40, step: 1 } },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives text-shimmer-wave, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/text-shimmer-wave . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/text-shimmer-wave.tsx . Mechanism: each character is a motion.span. Keyframes run translateZ, translateX, translateY, scale, rotateY, and color. Delay is (i * duration / spread) / length. Extra runtime: none. Prior Academy use: evaluated only. Continuous. Pause and duration (Speed).',
      },
    },
  },
} satisfies Meta<typeof TextShimmerWave>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playPause(canvas: {
  getByTestId: (id: string) => HTMLElement;
  getByRole: (role: 'button', options: { name: string }) => HTMLElement;
}) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByTestId('text-shimmer-wave')).toHaveAttribute(
    'data-running',
    'true',
  );
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(canvas.getByTestId('text-shimmer-wave')).toHaveAttribute(
    'data-running',
    'false',
  );
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(canvas.getByTestId('text-shimmer-wave')).toHaveAttribute(
    'data-running',
    'true',
  );
}

export const SettingTheGoal: Story = {
  render: (args) => <GoalWave {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('text-shimmer-wave')).toHaveTextContent(
      'Setting the $3,000 goal',
    );
    await playPause(canvas);
  },
};

export const PublishingColour: Story = {
  args: {
    children: 'Publishing the page',
    duration: 1,
    zDistance: 1,
    xDistance: 2,
    yDistance: -2,
    spread: 1,
    scaleDistance: 1.1,
    rotateYDistance: 20,
  },
  render: (args) => <ColourWave {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('text-shimmer-wave')).toHaveTextContent(
      'Publishing the page',
    );
    await playPause(canvas);
  },
};

export const ChallengeWeekWave: Story = {
  args: {
    children: 'Challenge week 19–28 Oct',
    duration: 1,
    zDistance: 28,
    xDistance: 6,
    yDistance: -6,
    spread: 1,
    scaleDistance: 1.25,
    rotateYDistance: 24,
  },
  render: (args) => <StrongWave {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('text-shimmer-wave')).toHaveTextContent(
      'Challenge week 19–28 Oct',
    );
    await playPause(canvas);
  },
};
