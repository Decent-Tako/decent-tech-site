import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PHOTOS } from '../../pages/content';
import { pointerDrag } from '../../pages/storySupport';
import { CardStack } from './CardStack';
import { expectCardsBrand, playReplay } from './play';
import {
  CARD_STACK_DEFAULTS,
  CARD_STACK_IMAGES,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Card stack',
  component: CardStack,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-card-stack in Academy branding.',
          'The article page now marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: drag x on the top card. useMotionValue x, useTransform rotate, wrap currentIndex, mix/progress/easeIn for scale and opacity.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-drag . Example https://motion.dev/examples/react-card-stack . Live source https://examples.motion.dev/assets/index-BV1YOFDw.js .',
          'Upstream props: images and maxRotate 5. Controls also lift minSpeed, swipe springs, and stack size because those are the hardcoded swipe thresholds.',
          'next/image is replaced with img. Photographs are Academy weeks, full colour. One-shot per swipe. Replay remounts at index 0.',
        ].join(' '),
      },
    },
  },
  args: {
    ...CARD_STACK_DEFAULTS,
    images: CARD_STACK_IMAGES,
  },
  argTypes: {
    maxRotate: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Fan rotation in degrees. Upstream default 5.',
    },
    minSpeed: {
      control: { type: 'range', min: 10, max: 200, step: 10 },
      description: 'Velocity that commits a swipe. Upstream 50.',
    },
    minDistanceRatio: {
      control: { type: 'range', min: 0.2, max: 0.9, step: 0.05 },
      description: 'Commit distance as a fraction of stack width. Upstream 0.5.',
    },
    swipeStiffness: {
      control: { type: 'range', min: 200, max: 900, step: 20 },
      description: 'Spring after a committed swipe. Upstream 600.',
    },
    swipeDamping: {
      control: { type: 'range', min: 20, max: 80, step: 5 },
      description: 'Swipe spring damping. Upstream 50.',
    },
    returnStiffness: {
      control: { type: 'range', min: 100, max: 600, step: 20 },
      description: 'Spring when the swipe is short. Upstream 300.',
    },
    restStiffness: {
      control: { type: 'range', min: 200, max: 900, step: 20 },
      description: 'Rest layout spring. Upstream 600.',
    },
    restDamping: {
      control: { type: 'range', min: 10, max: 60, step: 5 },
      description: 'Rest layout damping. Upstream 30.',
    },
    stackSize: {
      control: { type: 'range', min: 240, max: 520, step: 20 },
      description: 'Stack box in pixels. Upstream 400.',
    },
    images: { control: 'object' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof CardStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...CARD_STACK_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectCardsBrand(canvas);
    await expect(
      canvas.getByText('Week 0. Set the goal to $3,000.'),
    ).toBeVisible();
    const stack = canvas.getByLabelText('Academy week photographs');
    await expect(stack).toHaveAttribute('data-index', '0');
    const top = canvas.getByRole('img', { name: PHOTOS.hero.alt });
    await pointerDrag(top, 260, 0);
    await waitFor(() => {
      expect(canvas.getByLabelText('Academy week photographs')).toHaveAttribute(
        'data-index',
        '1',
      );
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => {
      expect(canvas.getByLabelText('Academy week photographs')).toHaveAttribute(
        'data-index',
        '0',
      );
    });
  },
};

export const WideFan: Story = {
  args: {
    ...CARD_STACK_DEFAULTS,
    maxRotate: 16,
    stackSize: 320,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await expect(
      canvas.getByText('Week 0. Set the goal to $3,000.'),
    ).toBeVisible();
    await playReplay(canvas, 'card-stack');
  },
};

export const ReducedMotion: Story = {
  args: { ...CARD_STACK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await expect(canvas.getByTestId('card-stack')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(
      canvas.getByText('Week 0. Set the goal to $3,000.'),
    ).toBeVisible();
  },
};
