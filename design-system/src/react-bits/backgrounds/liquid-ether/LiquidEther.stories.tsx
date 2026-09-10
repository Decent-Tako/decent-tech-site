import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
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
          'Vendored React Bits Liquid Ether, commit 625f250, 2026-09-10. Mechanism: a three.js fluid solver across render targets, driven by the pointer or by an automatic demo pointer, coloured through a palette texture. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/liquid-ether . Runtime three 0.180.0. Pause stops the frame loop through the local paused prop. Replay remounts the upstream component.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LIQUID_ETHER_DEFAULTS },
  argTypes: {
    mouseForce: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Velocity the pointer adds. Upstream default 20.',
    },
    cursorSize: {
      control: { type: 'range', min: 10, max: 300, step: 10 },
      description: 'Radius of the pointer splat in pixels. Upstream default 100.',
    },
    isViscous: {
      control: 'boolean',
      description: 'Run the viscosity pass. Upstream default false.',
    },
    viscous: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Viscosity strength. Upstream default 30.',
    },
    iterationsViscous: {
      control: { type: 'range', min: 1, max: 64, step: 1 },
      description: 'Viscosity solver iterations. Upstream default 32.',
    },
    iterationsPoisson: {
      control: { type: 'range', min: 1, max: 64, step: 1 },
      description: 'Pressure solver iterations. Upstream default 32.',
    },
    dt: {
      control: { type: 'range', min: 0.001, max: 0.05, step: 0.001 },
      description: 'Simulation time step. Upstream default 0.014.',
    },
    BFECC: {
      control: 'boolean',
      description: 'Error-compensated advection. Upstream default true.',
    },
    resolution: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Simulation grid as a share of the box. Upstream default 0.5.',
    },
    isBounce: {
      control: 'boolean',
      description: 'Bounce at the walls. Upstream default false.',
    },
    colors: {
      control: 'object',
      description:
        'Palette stops, low to high speed. Brand accent blue, accent yellow, paper. Upstream default ["#5227FF", "#FF9FFC", "#B497CF"].',
    },
    autoDemo: {
      control: 'boolean',
      description: 'A driver moves the pointer by itself. Upstream default true.',
    },
    autoSpeed: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Demo pointer speed. Upstream default 0.5.',
    },
    autoIntensity: {
      control: { type: 'range', min: 0.5, max: 5, step: 0.1 },
      description: 'Demo pointer force multiplier. Upstream default 2.2.',
    },
    takeoverDuration: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Seconds to blend from the demo pointer to the real one. Upstream default 0.25.',
    },
    autoResumeDelay: {
      control: { type: 'range', min: 0, max: 5000, step: 100 },
      description: 'Idle milliseconds before the demo resumes. Upstream default 1000.',
    },
    autoRampDuration: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: 'Seconds the demo takes to reach full speed. Upstream default 0.6.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Clear colour behind the fluid. Brand ink. Upstream default #FFFFFF.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Multiply blend for light backgrounds. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused on one still frame.',
    },
  },
} satisfies Meta<typeof LiquidEther>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Liquid Ether' })).toBeVisible();
}

// Wait for the probe and the first frame, then branch on the WebGL state.
async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('liquid-ether-stage');
  await waitFor(() => {
    expect(stage).not.toHaveAttribute('data-webgl', 'pending');
  }, SLOW);
  if (stage.dataset.webgl === 'unavailable') {
    await expect(canvas.getByText(/WebGL is not available/)).toBeVisible();
    return { stage, ready: false };
  }
  await expect(stage).toHaveAttribute('data-webgl', 'ready');
  return { stage, ready: true };
}

async function playStir(stage: HTMLElement) {
  const surface = stage.querySelector('.liquid-ether-container');
  const sketch = stage.querySelector('canvas');
  if (!(surface instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Liquid Ether container or canvas is missing.');
  }
  const rect = surface.getBoundingClientRect();
  for (let step = 0; step < 6; step += 1) {
    fireEvent.mouseMove(surface, {
      clientX: rect.left + 80 + step * 40,
      clientY: rect.top + 100 + step * 20,
    });
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  await assertCanvasPainted(sketch, LIQUID_ETHER_DEFAULTS.backgroundColor);
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
}

export const Default: Story = {
  args: { ...LIQUID_ETHER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playStir(stage);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-paused', 'false');
    await playReady(canvas);
  },
};

export const ViscousNoDemo: Story = {
  args: { ...LIQUID_ETHER_DEFAULTS, isViscous: true, autoDemo: false, mouseForce: 40 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playStir(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LIQUID_ETHER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
