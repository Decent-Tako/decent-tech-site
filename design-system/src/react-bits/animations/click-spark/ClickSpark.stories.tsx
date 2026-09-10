import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { assertCanvasPainted } from '../../frame/canvasSupport';
import { ClickSpark } from './ClickSpark';
import { CLICK_SPARK_DEFAULTS, SPARK_EASES } from './source';

const meta = {
  title: 'React Bits/Animations/Click Spark',
  component: ClickSpark,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Click Spark, commit 625f250, 2026-09-10. Mechanism: a 2D canvas draws radial line sparks at each click. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/click-spark . No extra runtime. Pause stops new sparks. Replay remounts the canvas. Spark colour default is brand accent yellow #DEF54F (upstream #fff).',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...CLICK_SPARK_DEFAULTS },
  argTypes: {
    sparkColor: {
      control: 'color',
      description: 'Spark stroke. Brand accent yellow #DEF54F. Upstream default #fff.',
    },
    sparkSize: {
      control: { type: 'range', min: 2, max: 40, step: 1 },
      description: 'Line length at the start. Upstream default 10.',
    },
    sparkRadius: {
      control: { type: 'range', min: 4, max: 80, step: 1 },
      description: 'Travel in pixels. Upstream default 15.',
    },
    sparkCount: {
      control: { type: 'range', min: 3, max: 24, step: 1 },
      description: 'Sparks per click. Upstream default 8.',
    },
    duration: {
      control: { type: 'range', min: 50, max: 1500, step: 50 },
      description: 'Burst length in milliseconds. Upstream default 400.',
    },
    easing: {
      control: 'select',
      options: [...SPARK_EASES],
      description: 'Burst ease. Upstream default ease-out.',
    },
    extraScale: {
      control: { type: 'range', min: 0.5, max: 4, step: 0.1 },
      description: 'Radius scale. Upstream default 1.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always ignores clicks and runs no burst.',
    },
  },
} satisfies Meta<typeof ClickSpark>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const INK = '#212121';

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Click Spark' })).toBeVisible();
}

async function playBurst(canvas: Canvas) {
  const stage = canvas.getByTestId('click-spark-stage');
  const host = canvas.getByTestId('click-spark-host');
  const sparkCanvas = canvas.getByTestId('click-spark-canvas') as HTMLCanvasElement;
  const rect = sparkCanvas.getBoundingClientRect();
  host.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      clientX: rect.left + rect.width * (4.5 / 32),
      clientY: rect.top + rect.height * (4.5 / 32),
    }),
  );
  await waitFor(() => {
    expect(Number(stage.dataset.sparks)).toBeGreaterThan(0);
  });
  await assertCanvasPainted(sparkCanvas, INK, { grid: 32, timeoutMs: 2000 });
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
  args: { ...CLICK_SPARK_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playBurst(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playBurst(canvas);
  },
};

export const LargeBurst: Story = {
  args: { ...CLICK_SPARK_DEFAULTS, sparkCount: 16, sparkRadius: 40, extraScale: 1.5 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playBurst(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...CLICK_SPARK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('click-spark-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await userEvent.click(canvas.getByTestId('click-spark-host'));
    await expect(stage).toHaveAttribute('data-sparks', '0');
    await playPause(canvas, stage);
  },
};
