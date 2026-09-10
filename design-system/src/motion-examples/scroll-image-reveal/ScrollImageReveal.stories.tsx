import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { ScrollImageReveal } from './ScrollImageReveal';
import { SCROLL_IMAGE_REVEAL_DEFAULTS } from './scrollImageRevealData';

const meta = {
  title: 'Motion examples/Scroll image reveal',
  component: ScrollImageReveal,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Package motion 13.2.0. Licence MIT. Rebuild of motion.dev react-scroll-image-reveal. Mechanism: per image, useScroll({ target, offset: ["start end", "end start"] }) plus useTransform of clipPath inset(0% 50% 0% 50%) to inset(0% 0% 0% 0%) over [0, clipEnd], scale [scaleFrom, scaleMid, scaleTo] over [0, clipEnd, 1], and y 0% to yTo% over [0, 1]. Docs https://motion.dev/docs/react-use-transform . Example https://motion.dev/examples/react-scroll-image-reveal . Live source https://examples.motion.dev/react/scroll-image-reveal . First-party test https://github.com/motiondivision/motion/blob/main/dev/react/src/tests/scroll-image-reveal.tsx . The tutorial completion is Motion+. The live example publishes this source. Replay remounts and scrolls to the second photograph.',
      },
      story: { inline: true, height: '820px' },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    clipEnd: {
      control: { type: 'range', min: 0.15, max: 0.8, step: 0.05 },
      description: 'Progress where the curtain is fully open. Upstream 0.4.',
    },
    scaleFrom: {
      control: { type: 'range', min: 1, max: 1.8, step: 0.05 },
      description: 'Image scale at progress 0. Upstream 1.3.',
    },
    scaleMid: {
      control: { type: 'range', min: 0.9, max: 1.2, step: 0.05 },
      description: 'Image scale at clipEnd. Upstream 1.',
    },
    scaleTo: {
      control: { type: 'range', min: 1, max: 1.4, step: 0.05 },
      description: 'Image scale at progress 1. Upstream 1.1.',
    },
    yTo: {
      control: { type: 'range', min: 0, max: 40, step: 1 },
      description: 'Vertical shift percent at progress 1. Upstream 20.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the photograph with no clip-path.',
    },
  },
  args: {
    ...SCROLL_IMAGE_REVEAL_DEFAULTS,
  },
} satisfies Meta<typeof ScrollImageReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playReveal(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('button', { name: 'Replay' })).toBeVisible();
  await expect(
    canvas.getByRole('heading', { name: 'Find your uncomfortable' }),
  ).toBeVisible();
  await expect(canvas.getByText(/Challenge week/)).toBeVisible();
  await expectFullColorPhotos(canvas);
  await waitFor(() => {
    const figures = [
      ...canvasElement.querySelectorAll('[data-reveal-progress]'),
    ];
    const open = figures.some((figure) => {
      const progress = Number(figure.getAttribute('data-reveal-progress') ?? '0');
      return progress > 0.2;
    });
    expect(open).toBe(true);
  });
}

export const Default: Story = {
  args: {
    ...SCROLL_IMAGE_REVEAL_DEFAULTS,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playReveal(canvas, canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => {
      const figures = [
        ...canvasElement.querySelectorAll('[data-reveal-progress]'),
      ];
      const open = figures.some((figure) => {
        const progress = Number(
          figure.getAttribute('data-reveal-progress') ?? '0',
        );
        return progress > 0.2;
      });
      expect(open).toBe(true);
    });
  },
};

export const SlowReveal: Story = {
  args: {
    ...SCROLL_IMAGE_REVEAL_DEFAULTS,
    clipEnd: 0.7,
    scaleFrom: 1.5,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playReveal(canvas, canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => {
      const figures = [
        ...canvasElement.querySelectorAll('[data-reveal-progress]'),
      ];
      const open = figures.some((figure) => {
        const progress = Number(
          figure.getAttribute('data-reveal-progress') ?? '0',
        );
        return progress > 0.2;
      });
      expect(open).toBe(true);
    });
  },
};

export const ReducedMotion: Story = {
  args: {
    ...SCROLL_IMAGE_REVEAL_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByRole('heading', { name: 'Find your uncomfortable' }),
    ).toBeVisible();
    await expectFullColorPhotos(canvas);
  },
};
