import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { NotificationsStack } from './NotificationsStack';
import { expectCardsBrand, playReplay } from './play';
import {
  NOTIFICATIONS_STACK_DEFAULTS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Notifications stack',
  component: NotificationsStack,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-notifications-stack in Academy branding.',
          'The article page now marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: parent animate open/closed. Variants propagate. Closed cards stack with y -index*(height+gap), scale 1-index*0.1, opacity 1-index*0.4.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation#variants . Example https://motion.dev/examples/react-notifications-stack . Live source https://examples.motion.dev/assets/index-Ck-xMYFm.js .',
          'The demo exports no props. Controls lift count, size, scale step, opacity step, and the springs. Replay collapses the stack.',
        ].join(' '),
      },
    },
  },
  args: { ...NOTIFICATIONS_STACK_DEFAULTS },
  argTypes: {
    count: {
      control: { type: 'range', min: 2, max: 5, step: 1 },
      description: 'Card count. Upstream 3.',
    },
    height: {
      control: { type: 'range', min: 56, max: 96, step: 4 },
      description: 'Card height in pixels. Upstream 60.',
    },
    width: {
      control: { type: 'range', min: 240, max: 360, step: 8 },
      description: 'Card width in pixels. Upstream 280.',
    },
    gap: {
      control: { type: 'range', min: 4, max: 16, step: 1 },
      description: 'Gap in pixels. Upstream 8.',
    },
    scaleStep: {
      control: { type: 'range', min: 0.04, max: 0.2, step: 0.02 },
      description: 'Closed scale drop per index. Upstream 0.1.',
    },
    opacityStep: {
      control: { type: 'range', min: 0.1, max: 0.6, step: 0.05 },
      description: 'Closed opacity drop per index. Upstream 0.4.',
    },
    mass: {
      control: { type: 'range', min: 0.3, max: 1.5, step: 0.1 },
      description: 'Parent spring mass. Upstream 0.7.',
    },
    stiffness: {
      control: { type: 'range', min: 200, max: 900, step: 20 },
      description: 'Child spring stiffness. Upstream 600.',
    },
    damping: {
      control: { type: 'range', min: 20, max: 80, step: 5 },
      description: 'Child spring damping. Upstream 50.',
    },
    itemDelay: {
      control: { type: 'range', min: 0, max: 0.12, step: 0.01 },
      description: 'Stagger delay per index. Upstream 0.04.',
    },
    openY: {
      control: { type: 'range', min: 0, max: 40, step: 2 },
      description: 'Open stack y. Upstream 20.',
    },
    openScale: {
      control: { type: 'range', min: 0.8, max: 1, step: 0.02 },
      description: 'Open stack scale. Upstream 0.9.',
    },
    notifications: { control: 'object' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof NotificationsStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...NOTIFICATIONS_STACK_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectCardsBrand(canvas);
    const front = canvas.getByRole('button', { name: /Week 0 page is live/ });
    await userEvent.click(front);
    await waitFor(() => {
      expect(canvas.getByTestId('notes-stack')).toHaveAttribute(
        'data-open',
        'true',
      );
    });
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Collapse' })).toBeVisible();
    });
    await waitFor(() => {
      expect(
        canvas.getByRole('button', { name: /Buddy check-in/ }),
      ).toBeVisible();
    });
    await playReplay(canvas, 'notifications-stack');
    await waitFor(() => {
      expect(canvas.getByTestId('notes-stack')).toHaveAttribute(
        'data-open',
        'false',
      );
    });
  },
};

export const FiveCards: Story = {
  args: {
    ...NOTIFICATIONS_STACK_DEFAULTS,
    count: 5,
    height: 76,
    width: 320,
    opacityStep: 0.15,
    scaleStep: 0.08,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: /Week 0 page is live/ }),
    );
    await waitFor(() => {
      expect(canvas.getByTestId('notes-stack')).toHaveAttribute(
        'data-open',
        'true',
      );
    });
    await expect(
      canvas.getByRole('button', { name: /Inner circle/ }),
    ).toBeVisible();
    await playReplay(canvas, 'notifications-stack');
  },
};

export const ReducedMotion: Story = {
  args: { ...NOTIFICATIONS_STACK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await expect(canvas.getByTestId('notifications-stack')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(
      canvas.getByRole('button', { name: /Week 0 page is live/ }),
    ).toBeVisible();
  },
};
