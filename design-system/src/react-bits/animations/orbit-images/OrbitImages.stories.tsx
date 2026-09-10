import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { OrbitImages } from './OrbitImages';
import { ORBIT_DIRECTIONS, ORBIT_EASINGS, ORBIT_IMAGES_DEFAULTS, ORBIT_SHAPES } from './source';

const meta = {
  title: 'React Bits/Animations/Orbit Images',
  component: OrbitImages,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Orbit Images, commit 625f250, 2026-09-10. Mechanism: five Academy photographs travel an SVG offset-path on a shared motion progress clock. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/orbit-images . Runtime motion 13.2.0. Pause stops the clock. Replay remounts the orbit. Photographs come from public/photos through publicAsset().',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ORBIT_IMAGES_DEFAULTS },
  argTypes: {
    shape: {
      control: 'select',
      options: [...ORBIT_SHAPES],
      description: 'Path family. Upstream default ellipse.',
    },
    baseWidth: {
      control: { type: 'range', min: 400, max: 2000, step: 20 },
      description: 'Design width of the path. Upstream default 1400.',
    },
    radiusX: {
      control: { type: 'range', min: 80, max: 900, step: 10 },
      description: 'Horizontal radius. Upstream default 700.',
    },
    radiusY: {
      control: { type: 'range', min: 40, max: 500, step: 10 },
      description: 'Vertical radius. Upstream default 170.',
    },
    radius: {
      control: { type: 'range', min: 80, max: 600, step: 10 },
      description: 'Radius for circle, square, triangle, star, and heart. Upstream default 300.',
    },
    starPoints: {
      control: { type: 'range', min: 3, max: 12, step: 1 },
      description: 'Star points. Upstream default 5.',
    },
    starInnerRatio: {
      control: { type: 'range', min: 0.2, max: 0.9, step: 0.05 },
      description: 'Star inner radius ratio. Upstream default 0.5.',
    },
    rotation: {
      control: { type: 'range', min: -45, max: 45, step: 1 },
      description: 'Path rotation in degrees. Upstream default -8.',
    },
    duration: {
      control: { type: 'range', min: 4, max: 80, step: 1 },
      description: 'Loop length in seconds. Upstream default 40.',
    },
    itemSize: {
      control: { type: 'range', min: 32, max: 128, step: 4 },
      description: 'Photograph size in pixels. Upstream default 64.',
    },
    direction: {
      control: 'select',
      options: [...ORBIT_DIRECTIONS],
      description: 'Travel direction. Upstream default normal.',
    },
    fill: {
      control: 'boolean',
      description: 'Spread items around the path. Upstream default true.',
    },
    showPath: {
      control: 'boolean',
      description: 'Draw the path stroke. Upstream default false.',
    },
    pathColor: {
      control: 'color',
      description: 'Path stroke. Brand ink at 10%. Upstream default rgba(0,0,0,0.1).',
    },
    pathWidth: {
      control: { type: 'range', min: 1, max: 8, step: 1 },
      description: 'Path stroke width. Upstream default 2.',
    },
    easing: {
      control: 'select',
      options: [...ORBIT_EASINGS],
      description: 'Progress easing. Upstream default linear.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the photographs still.',
    },
  },
} satisfies Meta<typeof OrbitImages>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Orbit Images' })).toBeVisible();
}

function itemTransform(stage: HTMLElement) {
  const item = stage.querySelector('.orbit-item');
  return item ? getComputedStyle(item).transform : '';
}

async function playOrbit(canvas: Canvas) {
  const stage = canvas.getByTestId('orbit-images-stage');
  await waitFor(() => {
    expect(stage.querySelectorAll('.orbit-image').length).toBe(5);
  }, SLOW);
  const first = itemTransform(stage);
  await waitFor(() => {
    expect(itemTransform(stage)).not.toBe(first);
  }, SLOW);
  return stage;
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...ORBIT_IMAGES_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playOrbit(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playOrbit(canvas);
  },
};

export const StarPath: Story = {
  args: { ...ORBIT_IMAGES_DEFAULTS, shape: 'star', showPath: true, duration: 8, radius: 280 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('orbit-images-stage');
    await expect(stage).toHaveAttribute('data-shape', 'star');
    await playOrbit(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ORBIT_IMAGES_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('orbit-images-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await waitFor(() => {
      expect(stage.querySelectorAll('.orbit-image').length).toBe(5);
    }, SLOW);
    const first = itemTransform(stage);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await expect(itemTransform(stage)).toBe(first);
    await playPause(canvas, stage);
  },
};
