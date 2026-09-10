import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { ScrollReveal } from './ScrollReveal';
import { SCROLL_REVEAL_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Scroll Reveal',
  component: ScrollReveal,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Scroll Reveal, commit 625f250, 2026-09-10. Mechanism: ScrollTrigger scrubs rotation, opacity, and optional blur of each word. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/scroll-reveal . Runtime gsap 3.15.0. Pause disables the triggers. Replay remounts the heading.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SCROLL_REVEAL_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Paragraph that splits into words. Academy default is the Week 0 copy. Upstream children have no default.`,
    },
    enableBlur: {
      control: 'boolean',
      description: 'Sharpen from blurStrength as the words fade in. Upstream default true.',
    },
    baseOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Start opacity of each word. Upstream default 0.1.',
    },
    baseRotation: {
      control: { type: 'range', min: 0, max: 15, step: 0.5 },
      description: 'Start rotation of the block in degrees. Upstream default 3.',
    },
    blurStrength: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Start blur in pixels. Upstream default 4.',
    },
    containerClassName: {
      control: 'text',
      description: 'Class on the heading. Upstream default empty.',
    },
    textClassName: {
      control: 'text',
      description: 'Class on the paragraph. Upstream default empty.',
    },
    rotationEnd: {
      control: 'text',
      description: 'ScrollTrigger end of the rotation. Upstream default bottom bottom.',
    },
    wordAnimationEnd: {
      control: 'text',
      description: 'ScrollTrigger end of the word fade. Upstream default bottom bottom.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the words in the final pose.',
    },
  },
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Scroll Reveal' })).toBeVisible();
}

async function playScroll(canvas: Canvas) {
  const stage = canvas.getByTestId('scroll-reveal-stage');
  const scroller = canvas.getByTestId('scroll-reveal-scroller');
  await expect(canvas.getByTestId('scroll-reveal-copy')).toHaveTextContent(FEATURES[0].copy);
  scroller.scrollTop = scroller.scrollHeight;
  scroller.dispatchEvent(new Event('scroll'));
  await waitFor(() => {
    expect(Number(stage.getAttribute('data-progress') ?? '0')).toBeGreaterThan(0.2);
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
  args: { ...SCROLL_REVEAL_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playScroll(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playScroll(canvas);
  },
};

export const NoBlurTilt: Story = {
  args: {
    ...SCROLL_REVEAL_DEFAULTS,
    enableBlur: false,
    baseRotation: 8,
    baseOpacity: 0,
    text: FEATURES[1].copy,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scroll-reveal-stage');
    await expect(stage).toHaveAttribute('data-blur', 'false');
    const scroller = canvas.getByTestId('scroll-reveal-scroller');
    scroller.scrollTop = scroller.scrollHeight;
    scroller.dispatchEvent(new Event('scroll'));
    await waitFor(() => {
      expect(Number(stage.getAttribute('data-progress') ?? '0')).toBeGreaterThan(0.2);
    }, SLOW);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SCROLL_REVEAL_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scroll-reveal-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(Number(stage.getAttribute('data-progress'))).toBe(1);
    await expect(canvas.getByTestId('scroll-reveal-copy')).toHaveTextContent(FEATURES[0].copy);
    await playPause(canvas, stage);
  },
};
