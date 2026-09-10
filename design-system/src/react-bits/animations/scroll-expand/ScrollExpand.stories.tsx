import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { ScrollExpand } from './ScrollExpand';
import { SCROLL_EXPAND_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Scroll Expand',
  component: ScrollExpand,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Scroll Expand, commit 625f250, 2026-09-10. Mechanism: a sticky clip path grows from a small frame to full size as the scroller moves. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/scroll-expand . No extra runtime. Pause ignores further scroll. Replay remounts the scroller.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SCROLL_EXPAND_DEFAULTS },
  argTypes: {
    startWidth: {
      control: { type: 'range', min: 10, max: 90, step: 1 },
      description: 'Start width as a percent. Upstream default 42.',
    },
    startHeight: {
      control: { type: 'range', min: 10, max: 90, step: 1 },
      description: 'Start height as a percent. Upstream default 58.',
    },
    startRadius: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Start corner radius in pixels. Upstream default 24.',
    },
    endRadius: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'End corner radius in pixels. Upstream default 0.',
    },
    mediaZoom: {
      control: { type: 'range', min: 1, max: 2, step: 0.05 },
      description: 'Start scale of the photograph. Upstream default 1.35.',
    },
    scrollDistance: {
      control: { type: 'range', min: 0.4, max: 3, step: 0.05 },
      description: 'Viewports of scroll to expand. Upstream default 1.2.',
    },
    holdDistance: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Viewports held at full size. Upstream default 0.35.',
    },
    smoothing: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Follow lag in seconds. Upstream default 0.1.',
    },
    overlayScrim: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Scrim opacity at full size. Upstream default 0.45.',
    },
    enabled: {
      control: 'boolean',
      description: 'Follow scroll. Off shows the full frame. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the expanded frame.',
    },
  },
} satisfies Meta<typeof ScrollExpand>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Scroll Expand' })).toBeVisible();
}

async function playScroll(canvas: Canvas) {
  const stage = canvas.getByTestId('scroll-expand-stage');
  const scroller = canvas.getByTestId('scroll-expand-scroller');
  await expect(canvas.getByText('Tools')).toBeVisible();
  scroller.scrollTop = Math.max(80, scroller.scrollHeight * 0.45);
  scroller.dispatchEvent(new Event('scroll'));
  await waitFor(() => {
    expect(Number(stage.dataset.progress)).toBeGreaterThan(0.2);
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
  args: { ...SCROLL_EXPAND_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playScroll(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playScroll(canvas);
  },
};

export const TightStart: Story = {
  args: {
    ...SCROLL_EXPAND_DEFAULTS,
    startWidth: 22,
    startHeight: 28,
    startRadius: 8,
    mediaZoom: 1.6,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playScroll(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SCROLL_EXPAND_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scroll-expand-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await waitFor(() => {
      expect(Number(stage.dataset.progress)).toBeGreaterThan(0.9);
    }, SLOW);
    await expect(canvas.getByText('Tools')).toBeVisible();
    await playPause(canvas, stage);
  },
};
