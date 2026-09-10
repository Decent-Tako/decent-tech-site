import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { dragPointer } from '../../frame/pointerSupport';
import { InfiniteMenu } from './InfiniteMenu';
import { INFINITE_MENU_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Infinite Menu',
  component: InfiniteMenu,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Infinite Menu, commit 625f250, 2026-09-10. Mechanism: instanced discs on a subdivided icosphere in WebGL 2, quaternion arcball drag with inertia, nearest-vertex snap. Licence MIT + Commons Clause. Page https://reactbits.dev/components/infinite-menu . Runtime gl-matrix 3.4.3. Pause stops the render loop. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...INFINITE_MENU_DEFAULTS },
  argTypes: {
    scale: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.05 },
      description: 'Camera distance factor. Upstream default 1.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Stage background. Brand ink. Upstream default #000000.',
    },
    itemCount: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Number of items on the sphere. Wrapper default 4.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always removes the release inertia. Drag still works.',
    },
  },
} satisfies Meta<typeof InfiniteMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 10000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Infinite Menu' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('infinite-menu-stage');
  await waitFor(() => {
    expect(['ready', 'unavailable']).toContain(stage.getAttribute('data-webgl'));
  }, SLOW);
  return stage;
}

async function playPaint(stage: HTMLElement, background: string) {
  if (stage.getAttribute('data-webgl') !== 'ready') {
    await expect(stage.querySelector('[data-webgl="unavailable"]')).toBeVisible();
    return null;
  }
  const sketch = stage.querySelector('canvas');
  await expect(sketch).toBeTruthy();
  await assertCanvasPainted(sketch as HTMLCanvasElement, background);
  return sketch as HTMLCanvasElement;
}

async function playDrag(stage: HTMLElement, sketch: HTMLCanvasElement) {
  await waitFor(() => {
    expect(stage.dataset.vertex).toBeDefined();
    expect(stage.dataset.active).toBeTruthy();
  }, SLOW);
  const before = stage.dataset.vertex;
  await dragPointer(sketch, 200);
  await waitFor(() => {
    expect(stage.dataset.vertex).not.toBe(before);
    expect(stage.dataset.active).toBeTruthy();
  }, SLOW);
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...INFINITE_MENU_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    const sketch = await playPaint(stage, INK);
    if (sketch) {
      await playDrag(stage, sketch);
      await playPaint(stage, INK);
    }
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after, INK);
  },
};

export const FewItems: Story = {
  args: { ...INFINITE_MENU_DEFAULTS, itemCount: 1 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-count', '1');
    const sketch = await playPaint(stage, INK);
    if (sketch) {
      await playDrag(stage, sketch);
      await playPaint(stage, INK);
    }
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...INFINITE_MENU_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    const sketch = await playPaint(stage, INK);
    if (sketch) {
      await playDrag(stage, sketch);
      await playPaint(stage, INK);
    }
    await playPauseResume(canvas, stage);
  },
};
