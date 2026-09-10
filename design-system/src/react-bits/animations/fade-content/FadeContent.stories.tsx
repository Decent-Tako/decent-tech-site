import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FadeContent } from './FadeContent';
import { FADE_CONTENT_DEFAULTS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Animations/Fade Content',
  component: FadeContent,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Fade Content, commit 625f250, 2026-09-10. Mechanism: gsap.set autoAlpha 0 with optional blur, then a ScrollTrigger plays a timeline to autoAlpha 1 once the wrapper enters the viewport. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/fade-content . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the wrapper.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FADE_CONTENT_DEFAULTS },
  argTypes: {
    blur: {
      control: 'boolean',
      description: 'Start from blur(10px) and sharpen. Upstream default false.',
    },
    duration: {
      control: { type: 'range', min: 100, max: 4000, step: 100 },
      description: 'Fade-in length in milliseconds. Upstream default 1000.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the fade-in. Upstream default power2.out.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 2000, step: 50 },
      description: 'Wait before the fade-in, in milliseconds. Upstream default 0.',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Share of the viewport the wrapper must cross. Upstream default 0.1.',
    },
    initialOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Opacity before the fade-in. Upstream default 0.',
    },
    disappearAfter: {
      control: { type: 'range', min: 0, max: 4000, step: 100 },
      description: 'Milliseconds after the fade-in before it fades back. 0 keeps it. Upstream default 0.',
    },
    disappearDuration: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Fade-out length in seconds. Upstream default 0.5.',
    },
    disappearEase: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the fade-out. Upstream default power2.in.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the card at once with no blur or delay.',
    },
  },
} satisfies Meta<typeof FadeContent>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Fade Content' })).toBeVisible();
}

async function playFadeIn(canvas: Canvas) {
  const stage = canvas.getByTestId('fade-content-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'visible');
  }, SLOW);
  await expect(canvas.getByTestId('fade-content-card')).toBeVisible();
  await expect(canvas.getByText('Week 0')).toBeVisible();
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
  args: { ...FADE_CONTENT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playFadeIn(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playFadeIn(canvas);
  },
};

export const BlurWithDelay: Story = {
  args: { ...FADE_CONTENT_DEFAULTS, blur: true, delay: 300, duration: 600 },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playFadeIn(canvas);
    await playPause(canvas, stage);
  },
};

export const Disappear: Story = {
  args: {
    ...FADE_CONTENT_DEFAULTS,
    duration: 400,
    disappearAfter: 300,
    disappearDuration: 0.3,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playFadeIn(canvas);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-state', 'gone');
    }, SLOW);
    await expect(canvas.getByTestId('fade-content-card')).not.toBeVisible();
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...FADE_CONTENT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playFadeIn(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
