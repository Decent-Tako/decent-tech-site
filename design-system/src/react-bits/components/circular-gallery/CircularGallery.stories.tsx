import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { CircularGallery } from './CircularGallery';
import { CIRCULAR_GALLERY_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Circular Gallery',
  component: CircularGallery,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Circular Gallery, commit 625f250, 2026-09-10. Mechanism: ogl image planes on a bent orbit, driven by drag, wheel, or arrows. Licence MIT + Commons Clause. Page https://reactbits.dev/components/circular-gallery . Runtime ogl 1.0.11. Pause holds the orbit lerp. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CIRCULAR_GALLERY_DEFAULTS },
  argTypes: {
    bend: {
      control: { type: 'range', min: -8, max: 8, step: 0.25 },
      description: 'Arc depth of the row. Upstream default 3.',
    },
    textColor: {
      control: 'color',
      description: 'Caption colour. Brand paper. Upstream default #ffffff.',
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 0.4, step: 0.01 },
      description: 'Plane corner radius in shader space. Upstream default 0.05.',
    },
    font: {
      control: 'text',
      description: 'Canvas caption face. Brand Sans. Upstream default bold 30px Figtree.',
    },
    scrollSpeed: {
      control: { type: 'range', min: 0, max: 8, step: 0.25 },
      description: 'Drag and key step scale. Upstream default 2.',
    },
    scrollEase: {
      control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
      description: 'Lerp toward the scroll target. Upstream default 0.05.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always flattens the row and holds scroll.',
    },
  },
} satisfies Meta<typeof CircularGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Circular Gallery' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('circular-gallery-stage');
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

async function playScroll(stage: HTMLElement) {
  const gallery = stage.querySelector('.circular-gallery');
  await expect(gallery).toBeTruthy();
  (gallery as HTMLElement).focus();
  await userEvent.keyboard('{ArrowRight}');
  await waitFor(() => {
    expect(Number.parseFloat(stage.getAttribute('data-scroll') ?? '0')).not.toBe(0);
  }, SLOW);
}

export const Default: Story = {
  args: { ...CIRCULAR_GALLERY_DEFAULTS },
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

export const FlatRow: Story = {
  args: { ...CIRCULAR_GALLERY_DEFAULTS, bend: 0, scrollEase: 0.2 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-bend', '0');
    await playPaint(stage);
    if (stage.getAttribute('data-webgl') === 'ready') {
      await playScroll(stage);
      await playPaint(stage);
    }
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...CIRCULAR_GALLERY_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await expect(stage).toHaveAttribute('data-bend', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
