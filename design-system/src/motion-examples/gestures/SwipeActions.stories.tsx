import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { pointerDrag } from '../../pages/storySupport';
import { SwipeActions } from './SwipeActions';
import { SWIPE_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Swipe actions',
  component: SwipeActions,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-swipe-actions in Academy branding.',
          'Mechanism: custom pointer tracking, not the drag prop. useMotionValue holds swipe amount. useSpring follows it. useTransform maps amount to progress. Past 80% snaps to a full swipe. Past 25% on release snaps open to 50%.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-drag . Example https://motion.dev/examples/react-swipe-actions . Live https://examples.motion.dev/react/swipe-actions .',
          'lucide-react 1.43.0 is already in this catalogue for icons. The tutorial rest is Motion+. The live example still publishes this source. Replay jumps the swipe amount to 0.',
        ].join(' '),
      },
    },
  },
  args: { ...SWIPE_DEFAULTS },
  argTypes: {
    stiffness: {
      control: { type: 'range', min: 200, max: 1200, step: 20 },
      description: 'useSpring stiffness. Upstream 900.',
    },
    damping: {
      control: { type: 'range', min: 20, max: 120, step: 5 },
      description: 'useSpring damping. Upstream 80.',
    },
    itemHeight: {
      control: { type: 'range', min: 64, max: 120, step: 4 },
      description: 'Row height in pixels. Upstream 80.',
    },
    itemMaxWidth: {
      control: { type: 'range', min: 280, max: 480, step: 8 },
      description: 'Max row width in pixels. Upstream 384.',
    },
    fullSwipeRatio: {
      control: { type: 'range', min: 0.5, max: 0.95, step: 0.05 },
      description: 'Commit a full swipe past this width ratio. Upstream 0.8.',
    },
    snapRatio: {
      control: { type: 'range', min: 0.1, max: 0.45, step: 0.05 },
      description: 'Snap open past this width ratio. Upstream 0.25.',
    },
    heading: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof SwipeActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...SWIPE_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByRole('heading', { name: 'Swipe actions' }),
    ).toBeVisible();
    const row = canvas.getByLabelText(/Buddy check-in/);
    await pointerDrag(row, -140, 0);
    await waitFor(() => {
      expect(Number(row.getAttribute('data-swipe-progress'))).toBeLessThan(
        -0.2,
      );
    });
    await expect(canvas.getByRole('button', { name: 'Archive' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(() => {
      const reset = canvas.getByLabelText(/Buddy check-in/);
      expect(reset.getAttribute('data-swipe-progress')).toBe('0');
    });
  },
};

export const FollowUp: Story = {
  args: {
    ...SWIPE_DEFAULTS,
    heading: 'Thank the inner circle. Send the first asks.',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    const row = canvas.getByLabelText(/Thank the inner circle/);
    await pointerDrag(row, 140, 0);
    await waitFor(() => {
      expect(Number(row.getAttribute('data-swipe-progress'))).toBeGreaterThan(
        0.2,
      );
    });
    await expect(canvas.getByRole('button', { name: 'Thank' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...SWIPE_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(
      canvas.getByText('Buddy check-in. Publish the Week 0 page.'),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};
