import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { FEATURES } from '../../../pages/content';
import { ScrollFloat } from './ScrollFloat';
import { GSAP_EASES, SCROLL_FLOAT_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Text animations/Scroll Float',
  component: ScrollFloat,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Scroll Float, commit 625f250, 2026-09-10. Mechanism: ScrollTrigger scrubs each glyph from a squashed yPercent 120 pose into rest. Licence MIT + Commons Clause. Page https://reactbits.dev/text-animations/scroll-float . Runtime gsap 3.15.0. Pause disables the trigger. Replay remounts the heading.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...SCROLL_FLOAT_DEFAULTS },
  argTypes: {
    text: {
      control: 'text',
      description: `Word that splits into glyphs. Academy default is the Week 0 title. Upstream children have no default.`,
    },
    containerClassName: {
      control: 'text',
      description: 'Class on the heading. Upstream default empty.',
    },
    textClassName: {
      control: 'text',
      description: 'Class on the glyph row. Upstream default empty.',
    },
    animationDuration: {
      control: { type: 'range', min: 0.2, max: 3, step: 0.1 },
      description: 'Tween duration in seconds. Upstream default 1.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the float. Upstream default back.inOut(2).',
    },
    scrollStart: {
      control: 'text',
      description: 'ScrollTrigger start. Upstream default center bottom+=50%.',
    },
    scrollEnd: {
      control: 'text',
      description: 'ScrollTrigger end. Upstream default bottom bottom-=40%.',
    },
    stagger: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.01 },
      description: 'Seconds between glyphs. Upstream default 0.03.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the glyphs in the final pose.',
    },
  },
} satisfies Meta<typeof ScrollFloat>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Scroll Float' })).toBeVisible();
}

async function playScroll(canvas: Canvas) {
  const stage = canvas.getByTestId('scroll-float-stage');
  const scroller = canvas.getByTestId('scroll-float-scroller');
  await expect(canvas.getByTestId('scroll-float-copy')).toHaveTextContent(FEATURES[0].title);
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
  args: { ...SCROLL_FLOAT_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playScroll(canvas);
    await playPause(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await playScroll(canvas);
  },
};

export const SlowStagger: Story = {
  args: {
    ...SCROLL_FLOAT_DEFAULTS,
    stagger: 0.08,
    animationDuration: 1.6,
    ease: 'power2.out',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playScroll(canvas);
    await playPause(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...SCROLL_FLOAT_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('scroll-float-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-progress', '1');
    await expect(canvas.getByTestId('scroll-float-copy')).toHaveTextContent(FEATURES[0].title);
    await playPause(canvas, stage);
  },
};
