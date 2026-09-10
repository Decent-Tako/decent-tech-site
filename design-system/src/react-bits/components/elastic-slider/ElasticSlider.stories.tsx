import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { dragPointer } from '../../frame/pointerSupport';
import { ElasticSlider } from './ElasticSlider';
import { ELASTIC_SLIDER_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Elastic Slider',
  component: ElasticSlider,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Elastic Slider, commit 625f250, 2026-09-10. Mechanism: motion springs stretch the track past its ends, then snap back. Licence MIT + Commons Clause. Page https://reactbits.dev/components/elastic-slider . Runtime motion 13.2.0. Pause ignores drag. Replay remounts the slider.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ELASTIC_SLIDER_DEFAULTS },
  argTypes: {
    defaultValue: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Start value. Upstream default 50.',
    },
    startingValue: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
      description: 'Range minimum. Upstream default 0.',
    },
    maxValue: {
      control: { type: 'range', min: 10, max: 4000, step: 10 },
      description: 'Range maximum. Upstream default 100.',
    },
    isStepped: {
      control: 'boolean',
      description: 'Snap to stepSize. Upstream default false.',
    },
    stepSize: {
      control: { type: 'range', min: 1, max: 500, step: 1 },
      description: 'Step when isStepped is true. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always ignores drag overflow.',
    },
  },
} satisfies Meta<typeof ElasticSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Elastic Slider' })).toBeVisible();
}

async function playDrag(canvas: Canvas) {
  const stage = canvas.getByTestId('elastic-slider-stage');
  const start = stage.getAttribute('data-value');
  const slider = canvas.getByRole('slider', { name: 'Elastic slider' });
  await dragPointer(slider, 80);
  await waitFor(() => {
    expect(stage.getAttribute('data-value')).not.toBe(start);
  }, SLOW);
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...ELASTIC_SLIDER_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playDrag(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-value', String(ELASTIC_SLIDER_DEFAULTS.defaultValue));
  },
};

export const GoalSteps: Story = {
  args: {
    ...ELASTIC_SLIDER_DEFAULTS,
    startingValue: 0,
    maxValue: 3000,
    defaultValue: 1500,
    isStepped: true,
    stepSize: 100,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('elastic-slider-stage');
    await expect(stage).toHaveAttribute('data-stepped', 'true');
    await playDrag(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ELASTIC_SLIDER_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('elastic-slider-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-value', String(ELASTIC_SLIDER_DEFAULTS.defaultValue));
    await playPauseResume(canvas, stage);
  },
};
