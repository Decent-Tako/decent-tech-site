import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { dragPointer } from '../../frame/pointerSupport';
import { Lanyard } from './Lanyard';
import { LANYARD_DEFAULTS, LANYARD_FITS } from './source';

const meta = {
  title: 'React Bits/Components/Lanyard',
  component: Lanyard,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Lanyard, commit 625f250, 2026-09-10. Mechanism: a Rapier rope hangs a GLTF badge. Drag the card to swing it. Licence MIT + Commons Clause. Page https://reactbits.dev/components/lanyard . Runtime three 0.180.0, @react-three/fiber 9.7.0, @react-three/drei 10.7.8, @react-three/rapier 2.2.0, meshline 3.3.1. Pause holds the physics step. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...LANYARD_DEFAULTS },
  argTypes: {
    cameraZ: {
      control: { type: 'range', min: 12, max: 60, step: 1 },
      description: 'Camera z of position [0, 0, z]. Upstream default 30.',
    },
    gravityY: {
      control: { type: 'range', min: -80, max: 0, step: 1 },
      description: 'Y of gravity [0, y, 0]. Upstream default -40.',
    },
    fov: {
      control: { type: 'range', min: 10, max: 60, step: 1 },
      description: 'Camera field of view. Upstream default 20.',
    },
    transparent: {
      control: 'boolean',
      description: 'Clear colour alpha. Brand default false so the canvas is opaque ink. Upstream default true.',
    },
    imageFit: {
      control: 'select',
      options: [...LANYARD_FITS],
      description: 'How the photograph fills the badge face. Upstream default cover.',
    },
    lanyardWidth: {
      control: { type: 'range', min: 0.4, max: 3, step: 0.1 },
      description: 'Strap mesh-line width. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds physics and the render loop.',
    },
  },
} satisfies Meta<typeof Lanyard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 15000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Lanyard' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('lanyard-stage');
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
  await assertCanvasPainted(sketch as HTMLCanvasElement, INK, {
    grid: 16,
    timeoutMs: 10000,
  });
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
  args: { ...LANYARD_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    const sketch = await playPaint(stage);
    if (sketch) {
      await dragPointer(sketch, 120);
      await playPaint(stage);
    }
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const WideStrap: Story = {
  args: { ...LANYARD_DEFAULTS, lanyardWidth: 2, fov: 28, gravityY: -24 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-fov', '28');
    const sketch = await playPaint(stage);
    if (sketch) {
      await dragPointer(sketch, 80);
      await playPaint(stage);
    }
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...LANYARD_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-gravity', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
