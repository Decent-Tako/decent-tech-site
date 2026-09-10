import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { AnimatedContent } from './AnimatedContent';
import { ANIMATED_CONTENT_DEFAULTS, GSAP_EASES } from './source';

const meta = {
  title: 'React Bits/Animations/Animated Content',
  component: AnimatedContent,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Animated Content, commit 625f250, 2026-09-10. Mechanism: gsap.set offsets, scales, and fades the wrapper, then a ScrollTrigger plays a timeline to the rest pose once the wrapper enters the viewport. Licence MIT + Commons Clause. Page https://reactbits.dev/animations/animated-content . Runtime gsap 3.15.0. Pause holds the gsap global timeline. Replay remounts the wrapper.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...ANIMATED_CONTENT_DEFAULTS },
  argTypes: {
    distance: {
      control: { type: 'range', min: 0, max: 400, step: 10 },
      description: 'Travel in pixels before the rest pose. Upstream default 100.',
    },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Axis of travel. Upstream default vertical.',
    },
    reverse: {
      control: 'boolean',
      description: 'Travel from the opposite side. Upstream default false.',
    },
    duration: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Enter length in seconds. Upstream default 0.8.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the enter. Upstream default power3.out.',
    },
    initialOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Opacity before the enter, when animateOpacity is on. Upstream default 0.',
    },
    animateOpacity: {
      control: 'boolean',
      description: 'Fade opacity with the travel. Upstream default true.',
    },
    scale: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.05 },
      description: 'Start scale. The rest pose is 1. Upstream default 1.',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Share of the viewport the wrapper must cross. Upstream default 0.1.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 2, step: 0.05 },
      description: 'Wait before the enter, in seconds. Upstream default 0.',
    },
    disappearAfter: {
      control: { type: 'range', min: 0, max: 4, step: 0.1 },
      description: 'Seconds after the enter before it leaves. 0 keeps it. Upstream default 0.',
    },
    disappearDuration: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Leave length in seconds. Upstream default 0.5.',
    },
    disappearEase: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the leave. Upstream default power3.in.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the card at once with no travel or delay.',
    },
  },
} satisfies Meta<typeof AnimatedContent>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Animated Content' })).toBeVisible();
}

async function playEnter(canvas: Canvas) {
  const stage = canvas.getByTestId('animated-content-stage');
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-state', 'visible');
  }, SLOW);
  await expect(canvas.getByTestId('animated-content-card')).toBeVisible();
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
  args: { ...ANIMATED_CONTENT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playEnter(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playEnter(canvas);
  },
};

export const HorizontalFromLeft: Story = {
  args: {
    ...ANIMATED_CONTENT_DEFAULTS,
    direction: 'horizontal',
    reverse: true,
    duration: 0.6,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playEnter(canvas);
    await expect(stage).toHaveAttribute('data-direction', 'horizontal');
    await playPause(canvas, stage);
  },
};

export const Disappear: Story = {
  args: {
    ...ANIMATED_CONTENT_DEFAULTS,
    duration: 0.4,
    disappearAfter: 0.3,
    disappearDuration: 0.3,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playEnter(canvas);
    await waitFor(() => {
      expect(stage).toHaveAttribute('data-state', 'gone');
    }, SLOW);
    await expect(canvas.getByTestId('animated-content-card')).not.toBeVisible();
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...ANIMATED_CONTENT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playEnter(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await playPause(canvas, stage);
  },
};
