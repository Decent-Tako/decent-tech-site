import type { Meta, StoryObj } from '@storybook/react-vite';
import { MotionConfig } from 'motion/react';
import { useState, type ElementType } from 'react';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { TextShimmer } from '../vendor/motion-primitives/text-shimmer';
import { withMotionExamples } from '../withMotionExamples';
import { PrimitiveFrame } from './Frame';
import { MOTION_PRIMITIVES } from './source';

type ShimmerArgs = {
  children: string;
  duration?: number;
  spread?: number;
  as?: ElementType;
};

const INK_BLUE =
  '[--base-color:#212121] [--base-gradient-color:#0035B1] dark:[--base-color:#212121] dark:[--base-gradient-color:#0035B1]';
const INK_YELLOW =
  '[--base-color:#212121] [--base-gradient-color:#DEF54F] dark:[--base-color:#212121] dark:[--base-gradient-color:#DEF54F]';

function ShimmerHost({
  args,
  colorClass,
  fixedNote,
}: {
  args: ShimmerArgs;
  colorClass: string;
  fixedNote: string;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <PrimitiveFrame
      title="Text shimmer"
      docs={`${MOTION_PRIMITIVES.docs}/docs/text-shimmer`}
      registry={`${MOTION_PRIMITIVES.registry}/text-shimmer.json`}
      fixedNote={fixedNote}
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
    >
      <div data-testid="text-shimmer" data-running={String(!paused)}>
        <MotionConfig isStatic={paused}>
          <TextShimmer
            as={args.as}
            duration={args.duration}
            spread={args.spread}
            className={`mp-shimmer ${colorClass}`}
          >
            {args.children}
          </TextShimmer>
        </MotionConfig>
      </div>
    </PrimitiveFrame>
  );
}

function OpeningWeek(args: ShimmerArgs) {
  return (
    <ShimmerHost
      args={args}
      colorClass={INK_BLUE}
      fixedNote="Continuous. Pause stops the sweep. Duration is Speed. Linear ease and the 250 percent background length stay fixed; they are the shimmer. className sets Brand Sans and the ink/blue CSS variables."
    />
  );
}

function BrandColor(args: ShimmerArgs) {
  return (
    <ShimmerHost
      args={args}
      colorClass={INK_YELLOW}
      fixedNote="Upstream colour example. --base-color is ink. --base-gradient-color is yellow #DEF54F, the press colour. Those CSS variables are the colour API. They are not props."
    />
  );
}

function WideSpread(args: ShimmerArgs) {
  return (
    <ShimmerHost
      args={args}
      colorClass={INK_BLUE}
      fixedNote="spread 8 makes --spread equal to children.length * 8 pixels, so the bright band is wider. Duration stays 2."
    />
  );
}

const meta = {
  title: 'Motion examples/Motion Primitives/Text shimmer',
  component: TextShimmer,
  decorators: [withMotionExamples],
  tags: ['autodocs'],
  args: {
    children: 'Opening Week 0',
    duration: 2,
    spread: 2,
    as: 'p',
  },
  argTypes: {
    children: { control: 'text' },
    duration: {
      control: { type: 'range', min: 0.4, max: 4, step: 0.1 },
      description: 'One sweep in seconds. Upstream default 2. This is Speed.',
    },
    spread: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.5 },
      description:
        'Multiplier for --spread in pixels. Upstream default 2. Formula: children.length * spread.',
    },
    as: { control: 'select', options: ['p', 'span'] },
  },
  parameters: {
    a11y: { test: 'error' },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Package Motion Primitives text-shimmer, registry copy from 2026-03-19. Licence MIT. Docs https://motion-primitives.com/docs/text-shimmer . Source https://github.com/ibelick/motion-primitives/blob/main/components/core/text-shimmer.tsx . Mechanism: useMemo sets --spread to children.length * spread pixels. A motion element animates backgroundPosition from 100% center to 0% center with repeat Infinity, ease linear, and background-clip text. Extra runtime: none. Prior Academy use: evaluated only. Continuous. Pause and duration (Speed).',
      },
    },
  },
} satisfies Meta<typeof TextShimmer>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playPause(canvas: {
  getByTestId: (id: string) => HTMLElement;
  getByRole: (role: 'button', options: { name: string }) => HTMLElement;
  getByText: (text: string) => HTMLElement;
}) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByTestId('text-shimmer')).toHaveAttribute(
    'data-running',
    'true',
  );
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(canvas.getByTestId('text-shimmer')).toHaveAttribute(
    'data-running',
    'false',
  );
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(canvas.getByTestId('text-shimmer')).toHaveAttribute(
    'data-running',
    'true',
  );
}

export const OpeningWeek0: Story = {
  render: (args) => <OpeningWeek {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Opening Week 0')).toBeVisible();
    await playPause(canvas);
  },
};

export const FindYourUncomfortable: Story = {
  args: {
    children: 'Find Your Uncomfortable',
    duration: 1.2,
    spread: 2,
    as: 'p',
  },
  render: (args) => <BrandColor {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Find Your Uncomfortable')).toBeVisible();
    await playPause(canvas);
  },
};

export const PublishingThePage: Story = {
  args: {
    children: 'Publishing the fundraising page',
    duration: 2,
    spread: 8,
    as: 'p',
  },
  render: (args) => <WideSpread {...args} />,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Publishing the fundraising page'),
    ).toBeVisible();
    await playPause(canvas);
  },
};
