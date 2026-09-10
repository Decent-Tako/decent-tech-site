import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { ScrollStack } from './ScrollStack';
import { SCROLL_STACK_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Scroll Stack',
  component: ScrollStack,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Scroll Stack, commit 625f250, 2026-09-10. Mechanism: Lenis smooths an inner scroller and pins, scales, and stacks cards. Licence MIT + Commons Clause. Page https://reactbits.dev/components/scroll-stack . Runtime lenis 1.3.26. Pause stops Lenis. Replay remounts the scroller.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SCROLL_STACK_DEFAULTS },
  argTypes: {
    itemDistance: {
      control: { type: 'range', min: 0, max: 240, step: 10 },
      description: 'Gap below each card in pixels. Upstream default 100.',
    },
    itemScale: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.01 },
      description: 'Scale step per card. Upstream default 0.03.',
    },
    itemStackDistance: {
      control: { type: 'range', min: 0, max: 80, step: 2 },
      description: 'Pinned stack offset in pixels. Upstream default 30.',
    },
    stackPosition: {
      control: 'text',
      description: 'Pin start as a share of the scroller. Upstream default 20%.',
    },
    scaleEndPosition: {
      control: 'text',
      description: 'Scale end as a share of the scroller. Upstream default 10%.',
    },
    baseScale: {
      control: { type: 'range', min: 0.5, max: 1, step: 0.01 },
      description: 'Scale of the first card when pinned. Upstream default 0.85.',
    },
    scaleDuration: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Unused upstream duration. Upstream default 0.5.',
    },
    rotationAmount: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Rotation in degrees per card. Upstream default 0.',
    },
    blurAmount: {
      control: { type: 'range', min: 0, max: 12, step: 0.5 },
      description: 'Blur on cards behind the top. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always keeps scale at 1 and turns rotation and blur off.',
    },
  },
} satisfies Meta<typeof ScrollStack>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Scroll Stack' })).toBeVisible();
}

async function playScroll(canvas: Canvas) {
  const stage = canvas.getByTestId('scroll-stack-stage');
  const scroller = stage.querySelector('.scroll-stack-scroller');
  if (!(scroller instanceof HTMLElement)) throw new Error('The Scroll Stack scroller is missing.');
  await expect(canvas.getByText('Week 0')).toBeVisible();
  scroller.scrollTop = scroller.scrollHeight;
  scroller.dispatchEvent(new Event('scroll'));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-complete', 'true');
  }, SLOW);
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...SCROLL_STACK_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playScroll(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-complete', 'false');
  },
};

export const RotateBlur: Story = {
  args: { ...SCROLL_STACK_DEFAULTS, rotationAmount: 8, blurAmount: 4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playScroll(canvas);
    await expect(stage).toHaveAttribute('data-rotate', '8');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SCROLL_STACK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scroll-stack-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(canvas.getByText('Week 0')).toBeVisible();
    await playPauseResume(canvas, stage);
  },
};
