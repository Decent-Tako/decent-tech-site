import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { MorphSlider } from './MorphSlider';
import { GSAP_EASES, MORPH_SLIDER_DEFAULTS, MORPH_TRANSITIONS } from './source';

const meta = {
  title: 'React Bits/Components/Morph Slider',
  component: MorphSlider,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Morph Slider, commit 625f250, 2026-09-10. Mechanism: an ogl shader morphs one photograph into the next. Licence MIT + Commons Clause. Page https://reactbits.dev/components/morph-slider . Runtime ogl 1.0.11, gsap 3.15.0. Pause holds the rAF loop. Replay remounts the slider.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...MORPH_SLIDER_DEFAULTS },
  argTypes: {
    startIndex: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: 'Slide that starts visible. Upstream default 0.',
    },
    transition: {
      control: 'select',
      options: [...MORPH_TRANSITIONS],
      description: 'Shader morph mode. Upstream default melt.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Morph length in seconds. Upstream default 1.1.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of uProgress. Upstream default power2.inOut.',
    },
    intensity: {
      control: { type: 'range', min: 0, max: 1.5, step: 0.05 },
      description: 'Displacement strength. Upstream default 0.55.',
    },
    scale: {
      control: { type: 'range', min: 0.5, max: 4, step: 0.1 },
      description: 'Noise scale. Upstream default 2.4.',
    },
    aberration: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Chromatic aberration. Upstream default 0.35.',
    },
    drift: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Idle UV drift. Upstream default 0.4.',
    },
    autoplay: {
      control: 'boolean',
      description: 'Advance on a timer. Upstream default false.',
    },
    autoplayDelay: {
      control: { type: 'range', min: 1, max: 10, step: 0.5 },
      description: 'Seconds between autoplay steps. Upstream default 4.',
    },
    loop: {
      control: 'boolean',
      description: 'Wrap from last to first. Upstream default true.',
    },
    radius: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Corner radius in pixels. Upstream default 16.',
    },
    overlayColor: {
      control: 'color',
      description: 'Shader overlay. Brand token ink. Upstream default #000000.',
    },
    showCaptions: {
      control: 'boolean',
      description: 'Show the caption under the stage. Upstream default true.',
    },
    showControls: {
      control: 'boolean',
      description: 'Show previous and next buttons. Upstream default true.',
    },
    showIndicators: {
      control: 'boolean',
      description: 'Show the slide dots. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shortens the morph and turns drift off.',
    },
  },
} satisfies Meta<typeof MorphSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 15000 };
const BLACK = '#000000';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Morph Slider' })).toBeVisible();
}

async function playReady(canvas: Canvas) {
  const stage = canvas.getByTestId('morph-slider-stage');
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
  await assertCanvasPainted(sketch as HTMLCanvasElement, BLACK, {
    grid: 16,
    timeoutMs: 10000,
  });
  return sketch as HTMLCanvasElement;
}

async function playNext(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-index', '1');
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
  args: { ...MORPH_SLIDER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await playPaint(stage);
    await playNext(canvas, stage);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    const after = await playReady(canvas);
    await playPaint(after);
  },
};

export const Ripple: Story = {
  args: { ...MORPH_SLIDER_DEFAULTS, transition: 'ripple', intensity: 0.9 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-transition', 'ripple');
    await playPaint(stage);
    await playNext(canvas, stage);
    await playPaint(stage);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...MORPH_SLIDER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playReady(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPaint(stage);
    await playNext(canvas, stage);
    await playPauseResume(canvas, stage);
  },
};
