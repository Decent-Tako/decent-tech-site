import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { Ballpit } from './Ballpit';
import { BALLPIT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Ballpit',
  component: Ballpit,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Ballpit, commit 625f250, 2026-09-10. Mechanism: instanced three.js spheres with gravity and a pointer control sphere. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/ballpit . Runtime gsap 3.15.0 and three 0.180.0. Pause holds physics. Replay remounts the pit.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...BALLPIT_DEFAULTS },
  argTypes: {
    followCursor: {
      control: 'boolean',
      description: 'Pointer pulls a control sphere. Upstream default true.',
    },
    count: {
      control: { type: 'range', min: 10, max: 200, step: 5 },
      description: 'Sphere count. Story default 80. Upstream XConfig 200.',
    },
    colors: {
      control: 'object',
      description: 'Sphere colours. Brand accent-blue, accent-yellow, paper. Upstream [0, 0, 0].',
    },
    ambientColor: {
      control: 'color',
      description: 'Ambient light. Brand paper #FFFFFF. Upstream 0xffffff.',
    },
    ambientIntensity: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Ambient strength. Upstream default 1.',
    },
    lightIntensity: {
      control: { type: 'range', min: 0, max: 400, step: 10 },
      description: 'Point light. Upstream default 200.',
    },
    minSize: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
      description: 'Smallest sphere. Upstream default 0.5.',
    },
    maxSize: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.05 },
      description: 'Largest sphere. Upstream default 1.',
    },
    size0: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.05 },
      description: 'Control sphere size. Upstream default 1.',
    },
    gravity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Downward accel. Upstream default 0.5.',
    },
    friction: {
      control: { type: 'range', min: 0.9, max: 1, step: 0.0005 },
      description: 'Velocity keep. Upstream default 0.9975.',
    },
    wallBounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Wall restitution. Upstream default 0.95.',
    },
    maxVelocity: {
      control: { type: 'range', min: 0.02, max: 1, step: 0.01 },
      description: 'Speed clamp. Upstream default 0.15.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds physics and gravity.',
    },
  },
} satisfies Meta<typeof Ballpit>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Ballpit' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('ballpit-stage');
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
  args: { ...BALLPIT_DEFAULTS },
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

export const LowGravity: Story = {
  args: { ...BALLPIT_DEFAULTS, gravity: 0.1, count: 40 },
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
  args: { ...BALLPIT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
