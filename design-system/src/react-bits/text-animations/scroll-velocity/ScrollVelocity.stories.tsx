import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { ScrollVelocity } from './ScrollVelocity';
import { SCROLL_VELOCITY_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Scroll Velocity',
  component: ScrollVelocity,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Scroll Velocity, commit 625f250, 2026-09-10. Mechanism: two looping rows move with useAnimationFrame and speed up with scroll velocity. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/scroll-velocity . Runtime motion 13.2.0. Pause holds the frame loop. Replay remounts the rows.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SCROLL_VELOCITY_DEFAULTS },
  argTypes: {
    texts: {
      control: 'object',
      description: 'Rows of copy. Academy default is Start and Learn. Upstream default [].',
    },
    velocity: {
      control: { type: 'range', min: 20, max: 400, step: 10 },
      description: 'Base speed in pixels per second. Upstream default 100.',
    },
    damping: {
      control: { type: 'range', min: 10, max: 120, step: 5 },
      description: 'Spring damping of the velocity map. Upstream default 50.',
    },
    stiffness: {
      control: { type: 'range', min: 50, max: 800, step: 10 },
      description: 'Spring stiffness of the velocity map. Upstream default 400.',
    },
    numCopies: {
      control: { type: 'range', min: 2, max: 12, step: 1 },
      description: 'Repeated spans in each row. Upstream default 6.',
    },
    velocityMapping: {
      control: 'object',
      description: 'Scroll velocity input and output ranges. Upstream default [0, 1000] to [0, 5].',
    },
    parallaxClassName: {
      control: 'text',
      description: 'Class on each row clip. Upstream default parallax.',
    },
    scrollerClassName: {
      control: 'text',
      description: 'Class on each moving row. Upstream default scroller.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the rows still.',
    },
  },
} satisfies Meta<typeof ScrollVelocity>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Scroll Velocity' })).toBeVisible();
}

async function playMove(canvas: Canvas) {
  const stage = canvas.getByTestId('scroll-velocity-stage');
  await expect(canvas.getByTestId('scroll-velocity-copy')).toBeVisible();
  await expect(canvas.getAllByText(FEATURES[0].title).length).toBeGreaterThan(0);
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-offset') ?? '0')).toBeGreaterThan(10);
  }, SLOW);
  return stage;
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...SCROLL_VELOCITY_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playMove(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playMove(canvas);
  },
};

export const FastRows: Story = {
  args: {
    ...SCROLL_VELOCITY_DEFAULTS,
    velocity: 220,
    numCopies: 8,
    texts: [FEATURES[2].title, FEATURES[3].title],
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scroll-velocity-stage');
    await expect(canvas.getAllByText(FEATURES[2].title).length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-offset') ?? '0')).toBeGreaterThan(10);
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SCROLL_VELOCITY_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scroll-velocity-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getAllByText(FEATURES[0].title).length).toBeGreaterThan(0);
    await playPause(canvas, stage);
  },
};
