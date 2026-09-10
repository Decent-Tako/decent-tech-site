import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { LiquidEther } from './LiquidEther';
import { LIQUID_ETHER_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Liquid Ether',
  component: LiquidEther,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Liquid Ether, commit 625f250, 2026-09-10. Mechanism: three.js ping-pong fluid sim with a colour palette. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/liquid-ether . Runtime three 0.180.0. Pause holds the sim after the first frame. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LIQUID_ETHER_DEFAULTS },
  argTypes: {
    mouseForce: {
      control: { type: 'range', min: 1, max: 60, step: 1 },
      description: 'Pointer force. Upstream default 20.',
    },
    cursorSize: {
      control: { type: 'range', min: 20, max: 300, step: 5 },
      description: 'Force radius. Upstream default 100.',
    },
    isViscous: {
      control: 'boolean',
      description: 'Viscous solver. Upstream default false.',
    },
    viscous: {
      control: { type: 'range', min: 1, max: 80, step: 1 },
      description: 'Viscosity. Upstream default 30.',
    },
    iterationsViscous: {
      control: { type: 'range', min: 4, max: 64, step: 1 },
      description: 'Viscous iterations. Upstream default 32.',
    },
    iterationsPoisson: {
      control: { type: 'range', min: 4, max: 64, step: 1 },
      description: 'Poisson iterations. Upstream default 32.',
    },
    dt: {
      control: { type: 'range', min: 0.004, max: 0.04, step: 0.001 },
      description: 'Sim step. Upstream default 0.014.',
    },
    BFECC: {
      control: 'boolean',
      description: 'BFECC advection. Upstream default true.',
    },
    resolution: {
      control: { type: 'range', min: 0.2, max: 1, step: 0.05 },
      description: 'FBO scale. Upstream default 0.5.',
    },
    isBounce: {
      control: 'boolean',
      description: 'Bounce at edges. Upstream default false.',
    },
    colors: {
      control: 'object',
      description: 'Palette. Brand #0035B1, #DEF54F, #FFFFFF. Upstream default #5227FF, #FF9FFC, #B497CF.',
    },
    autoDemo: {
      control: 'boolean',
      description: 'Idle pointer walk. Upstream default true.',
    },
    autoSpeed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Idle walk speed. Upstream default 0.5.',
    },
    autoIntensity: {
      control: { type: 'range', min: 0, max: 6, step: 0.1 },
      description: 'Idle force scale. Upstream default 2.2.',
    },
    takeoverDuration: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'User takeover blend. Upstream default 0.25.',
    },
    autoResumeDelay: {
      control: { type: 'range', min: 0, max: 4000, step: 100 },
      description: 'Idle wait in ms. Upstream default 1000.',
    },
    autoRampDuration: {
      control: { type: 'range', min: 0, max: 3, step: 0.05 },
      description: 'Idle ramp. Upstream default 0.6.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Unused in the sketch. Upstream default #FFFFFF.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the sim after the first frame.',
    },
  },
} satisfies Meta<typeof LiquidEther>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Liquid Ether' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('liquid-ether-stage');
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
  args: { ...LIQUID_ETHER_DEFAULTS },
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

export const Viscous: Story = {
  args: {
    ...LIQUID_ETHER_DEFAULTS,
    isViscous: true,
    mouseForce: 36,
    autoIntensity: 3,
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
  args: { ...LIQUID_ETHER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
