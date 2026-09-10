import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { LineWaves } from './LineWaves';
import { LINE_WAVES_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Line Waves',
  component: LineWaves,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Line Waves, commit 625f250, 2026-09-10. Mechanism: ogl warped ridge lines with a three-colour cycle. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/line-waves . Runtime ogl 1.0.11. Pause holds uTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LINE_WAVES_DEFAULTS },
  argTypes: {
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Time scale. Upstream default 0.3.',
    },
    innerLineCount: {
      control: { type: 'range', min: 4, max: 64, step: 1 },
      description: 'Inner line count. Upstream default 32.',
    },
    outerLineCount: {
      control: { type: 'range', min: 4, max: 64, step: 1 },
      description: 'Outer line count. Upstream default 36.',
    },
    warpIntensity: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Warp amount. Upstream default 1.',
    },
    rotation: {
      control: { type: 'range', min: -180, max: 180, step: 1 },
      description: 'Field rotation in degrees. Upstream default -45.',
    },
    edgeFadeWidth: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Vertical fade. Upstream default 0.',
    },
    colorCycleSpeed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Colour cycle. Upstream default 1.',
    },
    brightness: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Brightness. Upstream default 0.2.',
    },
    color1: {
      control: 'color',
      description: 'Channel 1. Brand paper #FFFFFF. Upstream default #ffffff.',
    },
    color2: {
      control: 'color',
      description: 'Channel 2. Brand accent-blue #0035B1. Upstream default #ffffff.',
    },
    color3: {
      control: 'color',
      description: 'Channel 3. Brand accent-yellow #DEF54F. Upstream default #ffffff.',
    },
    enableMouseInteraction: {
      control: 'boolean',
      description: 'Pointer warp. Upstream default true.',
    },
    mouseInfluence: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Pointer warp amount. Upstream default 2.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the field still.',
    },
  },
} satisfies Meta<typeof LineWaves>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Line Waves' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('line-waves-stage');
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
  await expect(stage).toHaveTextContent('Public work');
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
  args: { ...LINE_WAVES_DEFAULTS },
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

export const UprightDense: Story = {
  args: {
    ...LINE_WAVES_DEFAULTS,
    rotation: 0,
    innerLineCount: 48,
    brightness: 0.35,
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
  args: { ...LINE_WAVES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
