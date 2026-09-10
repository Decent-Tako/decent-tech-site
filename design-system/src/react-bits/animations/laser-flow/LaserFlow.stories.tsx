import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { LaserFlow } from './LaserFlow';
import { LASER_FLOW_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Animations/Laser Flow',
  component: LaserFlow,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Laser Flow, commit 625f250, 2026-09-10. Mechanism: a three.js RawShaderMaterial beam with wisps and fog follows the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/laser-flow . Runtime three 0.180.0. Pause stops the frame loop. Replay remounts the sketch. Colour default is brand accent yellow #DEF54F (upstream #FF79C6). Background default is brand ink #212121 (upstream #000000).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LASER_FLOW_DEFAULTS },
  argTypes: {
    wispDensity: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Wisp count scale. Upstream default 1.',
    },
    mouseSmoothTime: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Pointer smoothing in seconds. Upstream default 0.',
    },
    mouseTiltStrength: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.005 },
      description: 'Beam tilt from the pointer. Upstream default 0.01.',
    },
    horizontalBeamOffset: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.01 },
      description: 'Horizontal beam offset. Upstream default 0.1.',
    },
    verticalBeamOffset: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.01 },
      description: 'Vertical beam offset. Upstream default 0.',
    },
    flowSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Flow along the beam. Upstream default 0.35.',
    },
    verticalSizing: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Vertical beam length. Upstream default 2.',
    },
    horizontalSizing: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Horizontal beam width. Upstream default 0.5.',
    },
    fogIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Fog mix. Upstream default 0.45.',
    },
    fogScale: {
      control: { type: 'range', min: 0.05, max: 1.5, step: 0.05 },
      description: 'Fog scale. Upstream default 0.3.',
    },
    wispSpeed: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Wisp travel. Upstream default 15.',
    },
    wispIntensity: {
      control: { type: 'range', min: 0, max: 12, step: 0.5 },
      description: 'Wisp brightness. Upstream default 5.',
    },
    flowStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Flow warp. Upstream default 0.25.',
    },
    decay: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Beam decay. Upstream default 1.1.',
    },
    falloffStart: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Falloff start. Upstream default 1.2.',
    },
    fogFallSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Fog fall. Upstream default 0.6.',
    },
    color: {
      control: 'color',
      description: 'Beam colour. Brand accent yellow #DEF54F. Upstream default #FF79C6.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Clear colour. Brand ink #212121. Upstream default #000000.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws one still frame and runs no loop.',
    },
  },
} satisfies Meta<typeof LaserFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Laser Flow' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('laser-flow-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.dataset.webgl);
  }, SLOW);
  return stage;
}

async function playSketch(stage: HTMLElement) {
  if (stage.dataset.webgl !== 'ready') {
    await expect(stage.querySelector('p[data-webgl="unavailable"]')).not.toBeNull();
    return;
  }
  const canvasEl = stage.querySelector('canvas');
  await expect(canvasEl).not.toBeNull();
  movePointer(stage, 180, 80);
  movePointer(stage, 240, 140);
  await assertCanvasPainted(canvasEl as HTMLCanvasElement, INK, { grid: 16, timeoutMs: 6000 });
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...LASER_FLOW_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playReady(canvas);
    await playSketch(stage);
  },
};

export const DenseWisps: Story = {
  args: { ...LASER_FLOW_DEFAULTS, wispDensity: 2.4, wispIntensity: 8, flowSpeed: 0.7 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LASER_FLOW_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (stage.dataset.webgl === 'ready') {
      const canvasEl = stage.querySelector('canvas');
      await expect(canvasEl).not.toBeNull();
      await assertCanvasPainted(canvasEl as HTMLCanvasElement, INK, { grid: 16, timeoutMs: 6000 });
    }
    await playPause(canvas, stage);
  },
};
