import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { FollowPointer } from './FollowPointer';
import { movePointer } from './playSupport';
import { FOLLOW_DEFAULTS } from './source';

const meta = {
  title: 'Motion examples/Follow pointer with spring',
  component: FollowPointer,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Rebuild of motion.dev react-follow-pointer-with-spring. Mechanism: useSpring x/y, pointermove, frame.read. Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-use-spring . Example https://motion.dev/examples/react-follow-pointer-with-spring . Continuous. Pause stops tracking. Speed is stiffness.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...FOLLOW_DEFAULTS },
  argTypes: {
    damping: {
      control: { type: 'range', min: 1, max: 40, step: 1 },
      description: 'Spring damping. Upstream default 3.',
    },
    stiffness: {
      control: { type: 'range', min: 10, max: 300, step: 5 },
      description: 'Spring stiffness. Upstream default 50. This is Speed.',
    },
    restDelta: {
      control: { type: 'range', min: 0.0001, max: 0.05, step: 0.0001 },
      description: 'Spring restDelta. Upstream default 0.001.',
    },
    size: {
      control: { type: 'range', min: 48, max: 160, step: 2 },
      description: 'Ball size in pixels. Upstream default 100.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof FollowPointer>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playBrand(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Follow pointer with spring' }),
  ).toBeVisible();
}

export const Default: Story = {
  args: { ...FOLLOW_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('follow-stage');
    const ball = canvas.getByTestId('follow-ball');
    movePointer(stage, 220, 120);
    await waitFor(() => {
      expect(ball.dataset.x).toBeTruthy();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(ball).toHaveAttribute('data-paused', 'true');
    await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  },
};

export const TightSpring: Story = {
  args: {
    ...FOLLOW_DEFAULTS,
    stiffness: 180,
    damping: 18,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    movePointer(canvas.getByTestId('follow-stage'), 180, 90);
    await waitFor(() => {
      expect(canvas.getByTestId('follow-ball').dataset.x).toBeTruthy();
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  },
};

export const ReducedMotion: Story = {
  args: {
    ...FOLLOW_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
    await expect(canvas.getByTestId('follow-ball')).toHaveAttribute(
      'data-paused',
      'true',
    );
  },
};
