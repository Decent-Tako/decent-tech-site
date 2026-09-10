import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { ScrollHorizontal } from './ScrollHorizontal';
import { SCROLL_HORIZONTAL_DEFAULTS } from './scrollHorizontalData';

const OFFSETS = [
  'start start',
  'start end',
  'end start',
  'end end',
  'center start',
  'start center',
] as const;

const meta = {
  title: 'Motion examples/Scroll horizontal',
  component: ScrollHorizontal,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Package motion 13.2.0. Licence MIT. Rebuild of motion.dev react-scroll-horizontal. Mechanism: useScroll({ target, offset: ["start start", "end end"] }) plus useTransform(scrollYProgress, [0, 1], [0, -totalDistance]) on x of a sticky row. Docs https://motion.dev/docs/react-scroll-animations . Example https://motion.dev/examples/react-scroll-horizontal . Live source https://examples.motion.dev/react/scroll-horizontal . Repository https://github.com/motiondivision/motion . Mix-blend multiply is dropped so photographs stay full colour. Prior Academy use: Pages/Feature scroll. Replay remounts and scrolls to mid-track.',
      },
      story: { inline: true, height: '820px' },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    itemWidth: {
      control: { type: 'range', min: 240, max: 480, step: 10 },
      description: 'Card width in pixels. Upstream ITEM_WIDTH 400.',
    },
    gap: {
      control: { type: 'range', min: 8, max: 60, step: 2 },
      description: 'Gap between cards in pixels. Upstream GAP 30.',
    },
    offsetStart: {
      control: 'select',
      options: [...OFFSETS],
      description: 'useScroll offset start. Upstream start start.',
    },
    offsetEnd: {
      control: 'select',
      options: [...OFFSETS],
      description: 'useScroll offset end. Upstream end end.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always stacks the row as a horizontal overflow list.',
    },
  },
  args: {
    ...SCROLL_HORIZONTAL_DEFAULTS,
  },
} satisfies Meta<typeof ScrollHorizontal>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playHorizontal(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expect(
    canvas.getByRole('heading', { name: 'Academy weeks' }),
  ).toBeVisible();
  await expect(canvas.getByRole('heading', { name: 'Start' })).toBeVisible();
  await expectFullColorPhotos(canvas);
  const stage = canvasElement.querySelector('[data-scroll-stage]');
  await waitFor(() => {
    const progress = Number(stage?.getAttribute('data-progress') ?? '0');
    expect(progress).toBeGreaterThan(0.15);
  });
}

export const Default: Story = {
  args: {
    ...SCROLL_HORIZONTAL_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playHorizontal(canvas, canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    const stage = canvasElement.querySelector('[data-scroll-stage]');
    await waitFor(() => {
      const progress = Number(stage?.getAttribute('data-progress') ?? '0');
      expect(progress).toBeGreaterThan(0.15);
    });
  },
};

export const CompactCards: Story = {
  args: {
    ...SCROLL_HORIZONTAL_DEFAULTS,
    itemWidth: 280,
    gap: 16,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playHorizontal(canvas, canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    const stage = canvasElement.querySelector('[data-scroll-stage]');
    await waitFor(() => {
      const progress = Number(stage?.getAttribute('data-progress') ?? '0');
      expect(progress).toBeGreaterThan(0.15);
    });
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SCROLL_HORIZONTAL_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas, canvasElement }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByRole('heading', { name: 'Start' })).toBeVisible();
    await expectFullColorPhotos(canvas);
    const stage = canvasElement.querySelector('[data-scroll-stage]');
    await expect(stage).not.toBeNull();
  },
};
