import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { InfiniteMenu } from './InfiniteMenu';
import { assertCanvasPainted, dragPointer } from './playSupport';
import { INFINITE_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Infinite menu',
  component: InfiniteMenu,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Infinite Menu, commit 625f250, 2026-09-10. Mechanism: instanced discs on a subdivided icosphere in WebGL 2, quaternion arcball drag with inertia, nearest-vertex snap. Licence MIT + Commons Clause. Page https://reactbits.dev/components/infinite-menu . Runtime gl-matrix 3.4.3, MIT. Drag the sphere. Pause stops the render loop. Replay resets the camera.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...INFINITE_DEFAULTS },
  argTypes: {
    scale: {
      control: { type: 'range', min: 0.5, max: 2, step: 0.05 },
      description: 'Camera distance factor. Upstream default 1.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Stage background. Default --ink #212121.',
    },
    itemCount: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Number of items on the sphere. Default 4.',
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

type Args = { backgroundColor?: string };

function background(args: Args): string {
  return args.backgroundColor ?? INFINITE_DEFAULTS.backgroundColor;
}

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Infinite menu' }),
  ).toBeVisible();
}

// Wait for the WebGL probe, then branch. When WebGL 2 is ready, prove that
// the sphere paints, drag it 200 pixels, wait for the nearest vertex to
// change, and prove that it paints again. The active item title is that vertex
// modulo the item count, so with one item the title cannot change; the vertex
// index proves the rotation in every story.
async function playDrag(canvas: Canvas, background: string) {
  const stage = canvas.getByTestId('infinite-menu-stage');
  await expect(stage).toBeInTheDocument();
  await waitFor(() => {
    expect(stage.dataset.webgl).not.toBe('pending');
  }, SLOW);

  if (stage.dataset.webgl !== 'ready') {
    await expect(stage).toHaveAttribute('data-webgl', 'unavailable');
    await expect(canvas.getByText(/WebGL 2 is not available/)).toBeVisible();
    return { stage, target: null };
  }

  await waitFor(() => {
    expect(stage.dataset.vertex).toBeDefined();
    expect(stage.dataset.active).toBeTruthy();
  }, SLOW);
  const target = stage.querySelector('canvas');
  if (!target) throw new Error('The menu canvas did not mount.');
  await assertCanvasPainted(target, background);

  const before = stage.dataset.vertex;
  await dragPointer(target, 200);
  await waitFor(() => {
    expect(stage.dataset.vertex).not.toBe(before);
    expect(stage.dataset.active).toBeTruthy();
  }, SLOW);
  await assertCanvasPainted(target, background);
  return { stage, target };
}

async function playPause(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
}

// Storybook runs the play on every view of the story, so the play must leave
// the sketch running. A story that ends paused shows a frozen, pulled-back
// sphere and a Resume button to every visitor.
async function playResume(
  canvas: Canvas,
  stage: HTMLElement,
  target: HTMLCanvasElement | null,
  background: string,
  button: 'Resume' | 'Replay',
) {
  await userEvent.click(canvas.getByRole('button', { name: button }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
  await expect(canvas.getByRole('button', { name: 'Pause' })).toBeVisible();
  if (target) await assertCanvasPainted(target, background);
}

export const Default: Story = {
  args: { ...INFINITE_DEFAULTS },
  play: async ({ canvas, args }) => {
    await playBrand(canvas);
    const { stage, target } = await playDrag(canvas, background(args));
    await playPause(canvas, stage);
    await playResume(canvas, stage, target, background(args), 'Replay');
  },
};

export const FewItems: Story = {
  args: { ...INFINITE_DEFAULTS, itemCount: 1 },
  play: async ({ canvas, args }) => {
    await playBrand(canvas);
    const { stage, target } = await playDrag(canvas, background(args));
    await playPause(canvas, stage);
    await playResume(canvas, stage, target, background(args), 'Resume');
  },
};

export const ReducedMotion: Story = {
  args: { ...INFINITE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas, args }) => {
    await playBrand(canvas);
    const { stage, target } = await playDrag(canvas, background(args));
    await playPause(canvas, stage);
    await playResume(canvas, stage, target, background(args), 'Resume');
  },
};
