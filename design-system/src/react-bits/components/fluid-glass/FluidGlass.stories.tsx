import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { FluidGlass } from './FluidGlass';
import { FLUID_GLASS_DEFAULTS, FLUID_GLASS_MODES } from './source';

const meta = {
  title: 'React Bits/Components/Fluid Glass',
  component: FluidGlass,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Fluid Glass, commit 625f250, 2026-09-10. Mechanism: a transmissive Three.js mesh refracts Academy photographs. Licence MIT + Commons Clause. Page https://reactbits.dev/components/fluid-glass . Runtime three 0.180.0, @react-three/fiber 9.7.0, @react-three/drei 10.7.8, maath 0.10.8. Pause holds the pointer damp. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FLUID_GLASS_DEFAULTS },
  argTypes: {
    mode: {
      control: 'select',
      options: [...FLUID_GLASS_MODES],
      description: 'Glass shape. Upstream default lens.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Clear colour behind the glass. Brand ink. Upstream default #120F17.',
    },
    textColor: {
      control: 'color',
      description: 'Headline colour. Brand paper. Upstream default #ffffff.',
    },
    ior: {
      control: { type: 'range', min: 1, max: 2.4, step: 0.01 },
      description: 'Index of refraction on the glass. Upstream default 1.15.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the pointer damp.',
    },
  },
} satisfies Meta<typeof FluidGlass>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Fluid Glass' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('fluid-glass-stage');
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
  args: { ...FLUID_GLASS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    if (stage.getAttribute('data-webgl') === 'ready') {
      movePointer(stage, 80, 80);
      await playPaint(stage);
    }
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const CubeGlass: Story = {
  args: { ...FLUID_GLASS_DEFAULTS, mode: 'cube', ior: 1.4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-mode', 'cube');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FLUID_GLASS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
