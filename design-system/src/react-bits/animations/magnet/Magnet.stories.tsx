import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { Magnet } from './Magnet';
import { MAGNET_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Magnet',
  component: Magnet,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Magnet, commit 625f250, 2026-09-10. Mechanism: the inner card translates toward the pointer while the pointer stays inside a padded hit area. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/magnet . No extra runtime. Pause resets the offset. Replay remounts the card.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MAGNET_DEFAULTS },
  argTypes: {
    padding: {
      control: { type: 'range', min: 0, max: 240, step: 10 },
      description: 'Extra hit radius in pixels. Upstream default 100.',
    },
    disabled: {
      control: 'boolean',
      description: 'Ignore the pointer. Upstream default false.',
    },
    magnetStrength: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Divisor of the pointer offset. Upstream default 2.',
    },
    activeTransition: {
      control: 'text',
      description: 'CSS transition while pulled. Upstream default transform 0.3s ease-out.',
    },
    inactiveTransition: {
      control: 'text',
      description: 'CSS transition while returning. Upstream default transform 0.5s ease-in-out.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always keeps the card at rest.',
    },
  },
} satisfies Meta<typeof Magnet>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Magnet' })).toBeVisible();
}

async function playPull(canvas: Canvas) {
  const stage = canvas.getByTestId('magnet-stage');
  const host = canvas.getByTestId('magnet-host');
  movePointer(host, 24, 16);
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-active', 'true');
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
  args: { ...MAGNET_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPull(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playPull(canvas);
  },
};

export const StrongPull: Story = {
  args: { ...MAGNET_DEFAULTS, magnetStrength: 1, padding: 160 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPull(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MAGNET_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('magnet-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    movePointer(stage, 80, 40);
    await expect(stage).toHaveAttribute('data-active', 'false');
    await playPause(canvas, stage);
  },
};
