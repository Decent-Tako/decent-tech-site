import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { SpecularButton } from './SpecularButton';
import { SPECULAR_BUTTON_DEFAULTS, SPECULAR_BUTTON_SIZES, SPECULAR_BUTTON_TYPES } from './source';

const STAGE_INK = '#212121';

const meta = {
  title: 'React Bits/Components/Specular Button',
  component: SpecularButton,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Specular Button, commit 625f250, 2026-09-10. Mechanism: an ogl WebGL 2 shader draws a specular rim that follows the pointer or sweeps on autoAnimate. Licence MIT + Commons Clause. Page https://reactbits.dev/components/specular-button . Runtime ogl 1.0.11. Pause skips the render after the first frame. Replay remounts the button.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SPECULAR_BUTTON_DEFAULTS },
  argTypes: {
    size: {
      control: 'select',
      options: [...SPECULAR_BUTTON_SIZES],
      description: 'Padding and type size. Upstream default lg.',
    },
    radius: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Corner radius in pixels. Upstream default 18.',
    },
    tint: {
      control: 'color',
      description: 'Fill tint. Brand paper. Upstream default #ffffff.',
    },
    tintOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Tint mix. Upstream default 0.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Backdrop blur in pixels. Upstream default 0.',
    },
    textColor: {
      control: 'color',
      description: 'Label colour. Brand paper. Upstream default #f5f5f5.',
    },
    lineColor: {
      control: 'color',
      description: 'Specular line. Brand paper. Upstream default #ffffff.',
    },
    baseColor: {
      control: 'color',
      description: 'Rim base. Brand charcoal. Upstream default #525252.',
    },
    intensity: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Shine intensity. Upstream default 1.',
    },
    shineSize: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'Angular shine window in degrees. Upstream default 10.',
    },
    shineFade: {
      control: { type: 'range', min: 1, max: 80, step: 1 },
      description: 'Shine fade in degrees. Upstream default 40.',
    },
    thickness: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Rim thickness. Upstream default 1.',
    },
    speed: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Idle sweep speed. Upstream default 0.35.',
    },
    followMouse: {
      control: 'boolean',
      description: 'Steer the light toward the pointer. Upstream default true.',
    },
    proximity: {
      control: { type: 'range', min: 40, max: 600, step: 10 },
      description: 'Pointer fade distance in pixels. Upstream default 250.',
    },
    autoAnimate: {
      control: 'boolean',
      description: 'Keep the shine on without a pointer. Upstream default false.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button. Upstream default false.',
    },
    type: {
      control: 'select',
      options: [...SPECULAR_BUTTON_TYPES],
      description: 'HTML button type. Upstream default button.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always mounts the sketch paused on one still frame.',
    },
  },
} satisfies Meta<typeof SpecularButton>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Specular Button' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('specular-button-stage');
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

async function playShine(stage: HTMLElement) {
  const button = stage.querySelector('.specular-button');
  const sketch = stage.querySelector('canvas');
  if (!(button instanceof HTMLElement) || !(sketch instanceof HTMLCanvasElement)) {
    throw new Error('The Specular Button or canvas is missing.');
  }
  movePointer(button, 24, 12);
  await assertCanvasPainted(sketch, STAGE_INK, { grid: 48, timeoutMs: 8000 });
  await userEvent.click(button);
  await expect(stage).toHaveAttribute('data-clicked', 'true');
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...SPECULAR_BUTTON_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    if (ready) await playShine(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    if (after.ready) await playShine(after.stage);
  },
};

export const AutoSweep: Story = {
  args: { ...SPECULAR_BUTTON_DEFAULTS, autoAnimate: true, size: 'md', thickness: 4 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-auto', 'true');
    await expect(stage).toHaveAttribute('data-size', 'md');
    if (ready) {
      const sketch = stage.querySelector('canvas');
      if (sketch instanceof HTMLCanvasElement) {
        await assertCanvasPainted(sketch, STAGE_INK, { grid: 48, timeoutMs: 8000 });
      }
    }
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SPECULAR_BUTTON_DEFAULTS, reducedMotion: 'always', autoAnimate: true },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const { stage, ready } = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    if (ready) await expect(stage).toHaveAttribute('data-webgl', 'ready');
    await playPauseResume(canvas, stage);
  },
};
