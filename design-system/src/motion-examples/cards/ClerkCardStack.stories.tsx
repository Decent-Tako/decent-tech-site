import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ClerkCardStack } from './ClerkCardStack';
import { expectCardsBrand, playReplay } from './play';
import {
  CLERK_CARD_STACK_DEFAULTS,
  PRESENCE_MODE_OPTIONS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Clerk card stack',
  component: ClerkCardStack,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-clerk-card-stack in Academy branding.',
          'Mechanism: MotionConfig spring. Parent variant verifying. SIGN_IN_VARIANTS recede the email card. AnimatePresence popLayout mounts the OTP card with VERIFY_VARIANTS from y 100.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animate-presence . Example https://motion.dev/examples/react-clerk-card-stack . Live source https://examples.motion.dev/assets/index-3Fx5eVo2.js .',
          'The demo exports no props. Controls lift the hardcoded spring, recede, overlay y, OTP length, and presence mode. x -50% and 25rem width stay fixed. Replay returns to the email card.',
        ].join(' '),
      },
    },
  },
  args: { ...CLERK_CARD_STACK_DEFAULTS },
  argTypes: {
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Shared spring bounce. Upstream 0.3.',
    },
    visualDuration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Shared spring visualDuration. Upstream 0.4.',
    },
    overlayY: {
      control: { type: 'range', min: 40, max: 200, step: 10 },
      description: 'OTP card enter y. Upstream 100.',
    },
    recedeY: {
      control: { type: 'range', min: -40, max: 0, step: 2 },
      description: 'Email card recede y. Upstream -10.',
    },
    recedeScale: {
      control: { type: 'range', min: 0.8, max: 1, step: 0.01 },
      description: 'Email card recede scale. Upstream 0.95.',
    },
    dimOpacity: {
      control: { type: 'range', min: 0.3, max: 1, step: 0.05 },
      description: 'Email card dim opacity. Upstream 0.6.',
    },
    otpLength: {
      control: { type: 'range', min: 4, max: 8, step: 1 },
      description: 'OTP slots. Upstream 6.',
    },
    presenceMode: {
      control: 'select',
      options: [...PRESENCE_MODE_OPTIONS],
      description: 'AnimatePresence mode. Upstream popLayout.',
    },
    heading: { control: 'text' },
    description: { control: 'text' },
    verifyHeading: { control: 'text' },
    verifyDescription: { control: 'text' },
    submitLabel: { control: 'text' },
    verifyLabel: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof ClerkCardStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...CLERK_CARD_STACK_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectCardsBrand(canvas);
    await expect(
      canvas.getByRole('heading', { name: 'Join Uncomfortable Academy' }),
    ).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Email'), 'ben@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Send code' }));
    await waitFor(() => {
      expect(canvas.getByText('Enter the Lounge code')).toBeVisible();
    });
    await expect(canvas.getByLabelText('Verification code')).toBeInTheDocument();
    await playReplay(canvas, 'clerk-card-stack');
    await waitFor(() => {
      expect(
        canvas.getByRole('heading', { name: 'Join Uncomfortable Academy' }),
      ).toBeVisible();
    });
  },
};

export const LongOverlay: Story = {
  args: {
    ...CLERK_CARD_STACK_DEFAULTS,
    overlayY: 180,
    recedeY: -24,
    recedeScale: 0.88,
    visualDuration: 0.7,
    heading: 'Publish the Week 0 page',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await expect(
      canvas.getByRole('heading', { name: 'Publish the Week 0 page' }),
    ).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Email'), 'team@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Send code' }));
    await waitFor(() => {
      expect(canvas.getByText('Enter the Lounge code')).toBeVisible();
    });
    await playReplay(canvas, 'clerk-card-stack');
  },
};

export const ReducedMotion: Story = {
  args: { ...CLERK_CARD_STACK_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await expect(canvas.getByTestId('clerk-card-stack')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(
      canvas.getByRole('heading', { name: 'Join Uncomfortable Academy' }),
    ).toBeVisible();
  },
};
