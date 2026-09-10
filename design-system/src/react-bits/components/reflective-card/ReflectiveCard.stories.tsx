import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { ReflectiveCard } from './ReflectiveCard';
import { REFLECTIVE_CARD_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Reflective Card',
  component: ReflectiveCard,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Reflective Card, commit 625f250, 2026-09-10. Mechanism: an SVG metallic displacement filter sits on a webcam feed, with a photograph fallback when the camera is missing. Licence MIT + Commons Clause. Page https://reactbits.dev/components/reflective-card . Runtime lucide-react 1.43.0. Pause holds the video. Replay remounts the card.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...REFLECTIVE_CARD_DEFAULTS },
  argTypes: {
    blurStrength: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Blur on the feed in pixels. Upstream default 12.',
    },
    color: {
      control: 'color',
      description: 'Text colour. Brand paper. Upstream default white.',
    },
    metalness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Sheen opacity. Upstream default 1.',
    },
    roughness: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Noise overlay opacity. Upstream default 0.4.',
    },
    overlayColor: {
      control: 'color',
      description: 'Wash over the feed. Upstream default rgba(255, 255, 255, 0.1).',
    },
    displacementStrength: {
      control: { type: 'range', min: 0, max: 60, step: 1 },
      description: 'Displacement scale. Upstream default 20.',
    },
    noiseScale: {
      control: { type: 'range', min: 0.1, max: 4, step: 0.1 },
      description: 'Turbulence scale. Upstream default 1.',
    },
    specularConstant: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Specular highlight strength. Upstream default 1.2.',
    },
    grayscale: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: '1 is fully grey. Upstream default 1.',
    },
    glassDistortion: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Glass displacement. Upstream default 0.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always turns metalness, blur, and displacement off.',
    },
  },
} satisfies Meta<typeof ReflectiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Reflective Card' })).toBeVisible();
}

async function playWebcam(canvas: Canvas) {
  const stage = canvas.getByTestId('reflective-card-stage');
  await waitFor(() => {
    expect(stage).not.toHaveAttribute('data-webcam', 'pending');
  }, SLOW);
  if (stage.dataset.webcam === 'unavailable') {
    await expect(canvas.getByRole('img')).toBeVisible();
  }
  await expect(canvas.getByText('Start')).toBeVisible();
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
  args: { ...REFLECTIVE_CARD_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playWebcam(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playWebcam(canvas);
  },
};

export const ColourMetal: Story = {
  args: { ...REFLECTIVE_CARD_DEFAULTS, grayscale: 0, metalness: 0.6 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playWebcam(canvas);
    await expect(stage).toHaveAttribute('data-metal', '0.6');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...REFLECTIVE_CARD_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playWebcam(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPauseResume(canvas, stage);
  },
};
