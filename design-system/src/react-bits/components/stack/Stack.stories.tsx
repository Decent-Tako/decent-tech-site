import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { dragPointer } from '../../frame/pointerSupport';
import { Stack } from './Stack';
import { STACK_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Stack, commit 625f250, 2026-09-10. Mechanism: drag or click sends the top card to the back with a motion spring. Licence MIT + Commons Clause. Page https://reactbits.dev/components/stack . Runtime motion 13.2.0. Pause stops autoplay. Replay remounts the stack.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...STACK_DEFAULTS },
  argTypes: {
    randomRotation: {
      control: 'boolean',
      description: 'Add a small random rotate. Upstream default false.',
    },
    sensitivity: {
      control: { type: 'range', min: 40, max: 400, step: 10 },
      description: 'Drag distance in pixels before send-to-back. Upstream default 200.',
    },
    sendToBackOnClick: {
      control: 'boolean',
      description: 'Click sends the card to the back. Upstream default false.',
    },
    autoplay: {
      control: 'boolean',
      description: 'Cycle the stack on a timer. Upstream default false.',
    },
    autoplayDelay: {
      control: { type: 'range', min: 500, max: 8000, step: 100 },
      description: 'Autoplay interval in milliseconds. Upstream default 3000.',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Stop autoplay while the pointer is over the stack. Upstream default false.',
    },
    mobileClickOnly: {
      control: 'boolean',
      description: 'On a narrow viewport, click instead of drag. Upstream default false.',
    },
    mobileBreakpoint: {
      control: { type: 'range', min: 320, max: 1200, step: 8 },
      description: 'Width in pixels that counts as mobile. Upstream default 768.',
    },
    stiffness: {
      control: { type: 'range', min: 40, max: 600, step: 10 },
      description: 'Spring stiffness. Upstream default 260.',
    },
    damping: {
      control: { type: 'range', min: 4, max: 80, step: 1 },
      description: 'Spring damping. Upstream default 20.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always turns drag and autoplay off. Click still sends a card back.',
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Stack' })).toBeVisible();
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...STACK_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('stack-stage');
    const images = canvas.getAllByRole('img');
    await expect(images.length).toBeGreaterThanOrEqual(4);
    const top = stage.querySelector('.card');
    if (!(top instanceof HTMLElement)) throw new Error('The Stack card is missing.');
    await dragPointer(top, 240);
    await waitFor(() => {
      expect(stage).not.toHaveAttribute('data-top', '4');
    }, SLOW);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
  },
};

export const ClickToBack: Story = {
  args: { ...STACK_DEFAULTS, sendToBackOnClick: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('stack-stage');
    await expect(stage).toHaveAttribute('data-click', 'true');
    const images = canvas.getAllByRole('img');
    await userEvent.click(images[images.length - 1]);
    await waitFor(() => {
      expect(stage).not.toHaveAttribute('data-top', '4');
    }, SLOW);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...STACK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('stack-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    const images = canvas.getAllByRole('img');
    await userEvent.click(images[images.length - 1]);
    await waitFor(() => {
      expect(stage).not.toHaveAttribute('data-top', '4');
    }, SLOW);
    await playPauseResume(canvas, stage);
  },
};
