import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Waves } from './Waves';
import { WAVES_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Waves',
  component: Waves,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Waves, commit 625f250, 2026-09-10. Mechanism: a 2d canvas of Perlin-noise lines that the pointer pulls. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/waves . No extra runtime. Pause holds the line clock after a short warm-up. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...WAVES_DEFAULTS },
  argTypes: {
    lineColor: {
      control: 'color',
      description: 'Stroke colour. Brand ink #212121. Upstream default black.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Fill colour. Brand paper #FFFFFF. Upstream default transparent.',
    },
    waveSpeedX: {
      control: { type: 'range', min: 0, max: 0.05, step: 0.001 },
      description: 'X noise speed. Upstream default 0.0125.',
    },
    waveSpeedY: {
      control: { type: 'range', min: 0, max: 0.03, step: 0.001 },
      description: 'Y noise speed. Upstream default 0.005.',
    },
    waveAmpX: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'X amplitude. Upstream default 32.',
    },
    waveAmpY: {
      control: { type: 'range', min: 0, max: 80, step: 1 },
      description: 'Y amplitude. Upstream default 16.',
    },
    xGap: {
      control: { type: 'range', min: 4, max: 40, step: 1 },
      description: 'Column gap. Upstream default 10.',
    },
    yGap: {
      control: { type: 'range', min: 8, max: 64, step: 1 },
      description: 'Row gap. Upstream default 32.',
    },
    friction: {
      control: { type: 'range', min: 0.8, max: 0.99, step: 0.005 },
      description: 'Cursor spring friction. Upstream default 0.925.',
    },
    tension: {
      control: { type: 'range', min: 0.001, max: 0.03, step: 0.001 },
      description: 'Cursor spring tension. Upstream default 0.005.',
    },
    maxCursorMove: {
      control: { type: 'range', min: 10, max: 200, step: 5 },
      description: 'Max cursor offset. Upstream default 100.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the lines after a short warm-up.',
    },
  },
} satisfies Meta<typeof Waves>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const PAPER = '#FFFFFF';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Waves' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('waves-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-ready', 'true');
  }, SLOW);
  return stage;
}

async function playPaint(stage: HTMLElement) {
  const sketch = stage.querySelector('canvas');
  await expect(sketch).toBeTruthy();
  await expect(stage).toHaveTextContent('Public work');
  await assertCanvasPainted(sketch as HTMLCanvasElement, PAPER);
  return sketch as HTMLCanvasElement;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...WAVES_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.waves') ?? stage;
    movePointer(hit, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const WideAmp: Story = {
  args: {
    ...WAVES_DEFAULTS,
    waveAmpX: 56,
    waveAmpY: 28,
    xGap: 16,
    lineColor: '#0035B1',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    const hit = stage.querySelector('.waves') ?? stage;
    movePointer(hit, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...WAVES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
