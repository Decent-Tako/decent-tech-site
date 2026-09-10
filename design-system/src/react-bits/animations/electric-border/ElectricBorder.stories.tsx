import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { ElectricBorder } from './ElectricBorder';
import { ELECTRIC_BORDER_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Electric Border',
  component: ElectricBorder,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Electric Border, commit 625f250, 2026-09-10. Mechanism: a 2D canvas displaces a rounded-rect stroke with octaved noise. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/electric-border . No extra runtime. Pause holds the last stroke. Replay remounts the canvas. Color default is brand accent blue #0035B1 (upstream #5227FF).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ELECTRIC_BORDER_DEFAULTS },
  argTypes: {
    color: {
      control: 'color',
      description: 'Stroke and glow colour. Brand accent blue #0035B1. Upstream default #5227FF.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Clock scale. Upstream default 1.',
    },
    chaos: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.02 },
      description: 'Noise amplitude. Upstream default 0.12.',
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Corner radius in pixels. Upstream default 24.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws one still stroke with no noise motion.',
    },
  },
} satisfies Meta<typeof ElectricBorder>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Electric Border' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('electric-border-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-ready', 'true');
  }, SLOW);
  await expect(canvas.getByTestId('electric-border-canvas')).toBeVisible();
  await expect(canvas.getByText('Six weeks')).toBeVisible();
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
  args: { ...ELECTRIC_BORDER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await waitFor(() => {
      expect(Number(stage.dataset.time)).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
  },
};

export const HighChaos: Story = {
  args: { ...ELECTRIC_BORDER_DEFAULTS, chaos: 0.36, speed: 2 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await waitFor(() => {
      expect(Number(stage.dataset.time)).toBeGreaterThan(0);
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ELECTRIC_BORDER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
