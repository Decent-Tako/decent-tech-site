import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ClerkSignIn } from './ClerkSignIn';
import { expectFormsBrand, playReplay } from './play';
import { CLERK_SIGN_IN_DEFAULTS, REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Forms/Clerk sign-in',
  component: ClerkSignIn,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-clerk-sign-in in Academy branding.',
          'Mechanism: parent animate sets the variant name. The sign-in card scales. resize() opens the password field. The OTP card stacks with AnimatePresence.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animation#variants . Example https://motion.dev/examples/react-clerk-sign-in . Live https://examples.motion.dev/react/clerk-sign-in . Repository https://github.com/motiondivision/motion .',
          'Upstream spring bounce 0.3, visualDuration 0.4, verify delay 650 ms, OTP length 6. Replay remounts the flow.',
        ].join(' '),
      },
    },
  },
  args: { ...CLERK_SIGN_IN_DEFAULTS },
  argTypes: {
    bounce: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
      description: 'Spring bounce. Upstream default 0.3.',
    },
    visualDuration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Spring visualDuration. Upstream default 0.4.',
    },
    yFrom: {
      control: { type: 'range', min: -24, max: 0, step: 1 },
      description: 'Password enter y in pixels. Upstream default -8.',
    },
    verifyDelayMs: {
      control: { type: 'range', min: 50, max: 1200, step: 50 },
      description: 'Mock submit wait in milliseconds. Upstream default 650.',
    },
    resendSeconds: {
      control: { type: 'range', min: 0, max: 60, step: 1 },
      description: 'Resend countdown. Upstream default 30.',
    },
    otpLength: {
      control: { type: 'range', min: 4, max: 8, step: 1 },
      description: 'OTP slot count. Upstream default 6.',
    },
    welcomeTitle: { control: 'text' },
    createTitle: { control: 'text' },
    verifyTitle: { control: 'text' },
    description: { control: 'text' },
    verifyDescription: { control: 'text' },
    emailLabel: { control: 'text' },
    passwordLabel: { control: 'text' },
    continueLabel: { control: 'text' },
    verifyLabel: { control: 'text' },
    startOverLabel: { control: 'text' },
    emailPlaceholder: { control: 'text' },
    passwordPlaceholder: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof ClerkSignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

async function completeToVerify(canvas: {
  getByLabelText: (text: string | RegExp) => HTMLElement;
  getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
  getByText: (text: string | RegExp) => HTMLElement;
}) {
  await userEvent.type(
    canvas.getByLabelText('Email address'),
    'you@wearemobilise.org',
  );
  await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
  await waitFor(() => {
    expect(canvas.getByLabelText('Password')).toBeVisible();
  });
  await userEvent.type(canvas.getByLabelText('Password'), 'circle-password');
  await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
  await waitFor(
    () => {
      expect(canvas.getByText('Check your Circle inbox')).toBeVisible();
    },
    { timeout: 4000 },
  );
}

export const Default: Story = {
  args: { ...CLERK_SIGN_IN_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    await completeToVerify(canvas);
    await playReplay(canvas, 'clerk-sign-in');
    await expect(canvas.queryByLabelText('Password')).toBeNull();
  },
};

export const FastVerify: Story = {
  args: {
    ...CLERK_SIGN_IN_DEFAULTS,
    verifyDelayMs: 80,
    resendSeconds: 3,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await completeToVerify(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Start over' }));
    await waitFor(() => {
      expect(canvas.queryByText('Check your Circle inbox')).toBeNull();
    });
  },
};

export const ReducedMotion: Story = {
  args: {
    ...CLERK_SIGN_IN_DEFAULTS,
    verifyDelayMs: 80,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    await completeToVerify(canvas);
  },
};
