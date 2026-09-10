import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Antigravity } from './Antigravity';
import { ANTIGRAVITY_DEFAULTS, PARTICLE_SHAPES } from './source';

const meta = {
  title: 'React Bits/Animations/Antigravity',
  component: Antigravity,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Antigravity, commit 625f250, 2026-09-10. Mechanism: a three.js InstancedMesh of capsules (or spheres, boxes, tetrahedra) lerps onto a ring around the pointer. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/antigravity . Runtime three 0.180.0. Pause stops the frame loop. Replay remounts the sketch. Colour default is brand accent yellow #DEF54F (upstream #FF9FFC).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ANTIGRAVITY_DEFAULTS },
  argTypes: {
    count: {
      control: { type: 'range', min: 20, max: 800, step: 10 },
      description: 'Instance count. Upstream default 300.',
    },
    magnetRadius: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'Distance that pulls a particle onto the ring. Upstream default 10.',
    },
    ringRadius: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'Ring radius around the pointer. Upstream default 10.',
    },
    waveSpeed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Wave along the ring. Upstream default 0.4.',
    },
    waveAmplitude: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Wave height. Upstream default 1.',
    },
    particleSize: {
      control: { type: 'range', min: 0.2, max: 6, step: 0.1 },
      description: 'Instance scale. Upstream default 2.',
    },
    lerpSpeed: {
      control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
      description: 'How fast instances follow the ring. Upstream default 0.1.',
    },
    color: {
      control: 'color',
      description: 'Particle colour. Brand accent yellow #DEF54F. Upstream default #FF9FFC.',
    },
    autoAnimate: {
      control: 'boolean',
      description: 'Orbit the virtual pointer after two seconds idle. Upstream default false.',
    },
    particleVariance: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Pulse scale variance. Upstream default 1.',
    },
    rotationSpeed: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Ring spin. Upstream default 0.',
    },
    depthFactor: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Z scale of rest positions. Upstream default 1.',
    },
    pulseSpeed: {
      control: { type: 'range', min: 0, max: 12, step: 0.5 },
      description: 'Scale pulse rate. Upstream default 3.',
    },
    particleShape: {
      control: 'select',
      options: [...PARTICLE_SHAPES],
      description: 'Instance geometry. Upstream default capsule.',
    },
    fieldStrength: {
      control: { type: 'range', min: 0.1, max: 40, step: 0.1 },
      description: 'How tight the ring sits. Upstream default 10.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always draws one still frame and runs no loop.',
    },
  },
} satisfies Meta<typeof Antigravity>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Antigravity' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('antigravity-stage');
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
  movePointer(stage, 180, 120);
  movePointer(stage, 260, 180);
  movePointer(stage, 200, 140);
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
  args: { ...ANTIGRAVITY_DEFAULTS },
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

export const SphereParticles: Story = {
  args: { ...ANTIGRAVITY_DEFAULTS, particleShape: 'sphere', autoAnimate: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-shape', 'sphere');
    await playSketch(stage);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ANTIGRAVITY_DEFAULTS, reducedMotion: 'always' },
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
