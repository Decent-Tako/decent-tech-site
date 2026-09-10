import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { FlyingPosters } from './FlyingPosters';
import { FLYING_POSTERS_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Flying Posters',
  component: FlyingPosters,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Flying Posters, commit 625f250, 2026-09-10. Mechanism: ogl image planes rotate as you drag or scroll. Licence MIT + Commons Clause. Page https://reactbits.dev/components/flying-posters . Runtime ogl 1.0.11. Pause holds the stack lerp. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FLYING_POSTERS_DEFAULTS },
  argTypes: {
    planeWidth: {
      control: { type: 'range', min: 80, max: 480, step: 8 },
      description: 'Plane width in pixels. Upstream default 320.',
    },
    planeHeight: {
      control: { type: 'range', min: 80, max: 480, step: 8 },
      description: 'Plane height in pixels. Upstream default 320.',
    },
    distortion: {
      control: { type: 'range', min: 0, max: 8, step: 0.25 },
      description: 'Bend of each poster. Upstream default 3.',
    },
    scrollEase: {
      control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
      description: 'Lerp toward the scroll target. Upstream default 0.01.',
    },
    cameraFov: {
      control: { type: 'range', min: 20, max: 90, step: 1 },
      description: 'Camera field of view. Upstream default 45.',
    },
    cameraZ: {
      control: { type: 'range', min: 8, max: 40, step: 1 },
      description: 'Camera distance. Upstream default 20.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the stack.',
    },
  },
} satisfies Meta<typeof FlyingPosters>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Flying Posters' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('flying-posters-stage');
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

async function playScroll(stage: HTMLElement) {
  const posters = stage.querySelector('.posters-container');
  await expect(posters).toBeTruthy();
  (posters as HTMLElement).dispatchEvent(
    new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }),
  );
  await waitFor(() => {
    expect(Number.parseFloat(stage.getAttribute('data-scroll') ?? '0')).not.toBe(0);
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
  args: { ...FLYING_POSTERS_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    if (stage.getAttribute('data-webgl') === 'ready') {
      await playScroll(stage);
      await playPaint(stage);
    }
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const StrongBend: Story = {
  args: { ...FLYING_POSTERS_DEFAULTS, distortion: 6, scrollEase: 0.08 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-distortion', '6');
    await playPaint(stage);
    if (stage.getAttribute('data-webgl') === 'ready') {
      await playScroll(stage);
      await playPaint(stage);
    }
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FLYING_POSTERS_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
