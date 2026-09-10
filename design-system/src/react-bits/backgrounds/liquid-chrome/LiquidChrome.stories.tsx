import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { LiquidChrome } from './LiquidChrome';
import { LIQUID_CHROME_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Liquid Chrome',
  component: LiquidChrome,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Liquid Chrome, commit 625f250, 2026-09-10. Mechanism: ogl nested cosine chrome field with pointer ripple. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/liquid-chrome . Runtime ogl 1.0.11. Pause holds uTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LIQUID_CHROME_DEFAULTS },
  argTypes: {
    baseColor: {
      control: 'object',
      description: 'RGB 0-1 tint. Brand ink #212121 as [0.129, 0.129, 0.129]. Upstream default [0.1, 0.1, 0.1].',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.2.',
    },
    amplitude: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Wave fold. Upstream default 0.5.',
    },
    frequencyX: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'X frequency. Upstream default 3.',
    },
    frequencyY: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Y frequency. Upstream default 2.',
    },
    interactive: {
      control: 'boolean',
      description: 'Pointer ripple. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the field still.',
    },
  },
} satisfies Meta<typeof LiquidChrome>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Liquid Chrome' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('liquid-chrome-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.getAttribute('data-webgl'));
  }, SLOW);
  return stage;
}

async function playPaint(stage: HTMLElement) {
  if (stage.getAttribute('data-webgl') !== 'ready') {
    await expect(stage.querySelector('[data-webgl="unavailable"]')).toBeVisible();
    return null;
  }
  const sketch = stage.querySelector('canvas');
  await expect(sketch).toBeTruthy();
  await expect(stage).toHaveTextContent('Week 0');
  await assertCanvasPainted(sketch as HTMLCanvasElement, INK);
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
  args: { ...LIQUID_CHROME_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 80, 80);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const BlueChrome: Story = {
  args: {
    ...LIQUID_CHROME_DEFAULTS,
    baseColor: [0, 0.208, 0.694],
    amplitude: 0.8,
    frequencyX: 4,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 140, 60);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LIQUID_CHROME_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
