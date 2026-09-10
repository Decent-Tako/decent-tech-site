import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Aurora } from './Aurora';
import { AURORA_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Aurora',
  component: Aurora,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Aurora, commit 625f250, 2026-09-10. Mechanism: ogl WebGL 2 simplex-noise colour ramp. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/aurora . Runtime ogl 1.0.11. Pause holds uTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...AURORA_DEFAULTS },
  argTypes: {
    colorStops: {
      control: 'object',
      description: 'Three-stop ramp. Brand accent-blue and accent-yellow. Upstream default #5227FF, #7cff67, #5227FF.',
    },
    amplitude: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Noise height. Upstream default 1.',
    },
    blend: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Band softness. Upstream default 0.5.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Time scale. Upstream default 1.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the band still.',
    },
  },
} satisfies Meta<typeof Aurora>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Aurora' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('aurora-stage');
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
  await expect(stage).toHaveTextContent('Tracker and plan');
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
  args: { ...AURORA_DEFAULTS },
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

export const LightMode: Story = {
  args: { ...AURORA_DEFAULTS, lightMode: true, amplitude: 1.6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...AURORA_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
