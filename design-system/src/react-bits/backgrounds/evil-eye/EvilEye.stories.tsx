import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { movePointer } from '../../frame/pointerSupport';
import { EvilEye } from './EvilEye';
import { EVIL_EYE_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Backgrounds/Evil Eye',
  component: EvilEye,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Evil Eye, commit 625f250, 2026-09-10. Mechanism: ogl polar-noise iris; time drives flame and the pointer moves the pupil. Licence MIT + Commons Clause. Page https://reactbits.dev/backgrounds/evil-eye . Runtime ogl 1.0.11. Pause holds uTime. Replay remounts the sketch.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...EVIL_EYE_DEFAULTS },
  argTypes: {
    eyeColor: {
      control: 'color',
      description: 'Iris colour. Brand accent-yellow #DEF54F. Upstream default #FF6F37.',
    },
    intensity: {
      control: { type: 'range', min: 0.2, max: 4, step: 0.1 },
      description: 'Colour gain. Upstream default 1.5.',
    },
    pupilSize: {
      control: { type: 'range', min: 0.1, max: 1.5, step: 0.05 },
      description: 'Pupil scale. Upstream default 0.6.',
    },
    irisWidth: {
      control: { type: 'range', min: 0.05, max: 0.8, step: 0.05 },
      description: 'Iris ring width. Upstream default 0.25.',
    },
    glowIntensity: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Outer glow. Upstream default 0.35.',
    },
    scale: {
      control: { type: 'range', min: 0.3, max: 2, step: 0.05 },
      description: 'Eye scale. Upstream default 0.8.',
    },
    noiseScale: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Noise frequency. Upstream default 1.',
    },
    pupilFollow: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'How far the pupil follows the pointer. Upstream default 1.',
    },
    flameSpeed: {
      control: { type: 'range', min: 0, max: 3, step: 0.1 },
      description: 'Flame time scale. Upstream default 1.',
    },
    backgroundColor: {
      control: 'color',
      description: 'Field colour. Brand ink #212121. Upstream default #000000.',
    },
    lightMode: {
      control: 'boolean',
      description: 'Light-page mix. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always holds the flame still.',
    },
  },
} satisfies Meta<typeof EvilEye>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };
const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Evil Eye' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('evil-eye-stage');
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
  await expect(stage).toHaveTextContent('Week 0');
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
  args: { ...EVIL_EYE_DEFAULTS },
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

export const WideIris: Story = {
  args: { ...EVIL_EYE_DEFAULTS, irisWidth: 0.5, pupilSize: 0.4, glowIntensity: 0.7 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...EVIL_EYE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-speed', '0');
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};
