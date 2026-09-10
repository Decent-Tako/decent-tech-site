import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Balatro } from './Balatro';
import { BALATRO_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Balatro',
  component: Balatro,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Balatro, commit 625f250, 2026-09-10. Mechanism: ogl spin shader with a pixel filter and pointer twist. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/balatro . Runtime ogl 1.0.11. Pause holds iTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...BALATRO_DEFAULTS },
  argTypes: {
    spinRotation: {
      control: { type: 'range', min: -6, max: 6, step: 0.1 },
      description: 'Base spin. Upstream default -2.',
    },
    spinSpeed: {
      control: { type: 'range', min: 0, max: 20, step: 0.5 },
      description: 'Time scale of the swirl. Upstream default 7.',
    },
    offset: {
      control: 'object',
      description: 'UV offset [x, y]. Upstream default [0, 0].',
    },
    color1: {
      control: 'color',
      description: 'Paint A. Brand accent-yellow #DEF54F. Upstream default #DE443B.',
    },
    color2: {
      control: 'color',
      description: 'Paint B. Brand accent-blue #0035B1. Upstream default #006BB4.',
    },
    color3: {
      control: 'color',
      description: 'Paint C. Brand ink #212121. Upstream default #162325.',
    },
    contrast: {
      control: { type: 'range', min: 0.5, max: 8, step: 0.1 },
      description: 'Paint contrast. Upstream default 3.5.',
    },
    lighting: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Highlight gain. Upstream default 0.4.',
    },
    spinAmount: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Radial spin mix. Upstream default 0.25.',
    },
    pixelFilter: {
      control: { type: 'range', min: 100, max: 2000, step: 5 },
      description: 'Pixel size. Upstream default 745.',
    },
    spinEase: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Spin ease. Upstream default 1.',
    },
    isRotate: {
      control: 'boolean',
      description: 'Time rotates the field. Upstream default false.',
    },
    mouseInteraction: {
      control: 'boolean',
      description: 'Pointer twists the field. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the swirl still.',
    },
  },
} satisfies Meta<typeof Balatro>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Balatro' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('balatro-stage');
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
  await expect(stage).toHaveTextContent('19–28 October 2026');
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
  args: { ...BALATRO_DEFAULTS },
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

export const Rotating: Story = {
  args: { ...BALATRO_DEFAULTS, isRotate: true, spinSpeed: 4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    movePointer(stage, 120, 90);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...BALATRO_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
