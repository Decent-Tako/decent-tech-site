import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { ClerkUserButton } from './ClerkUserButton';
import { expectFormsBrand, playReplay, waitUntilOpaque } from './play';
import { CLERK_USER_BUTTON_DEFAULTS, REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Forms/Clerk user button',
  component: ClerkUserButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-clerk-user-button in Academy branding.',
          'Mechanism: closed button and open menu share layoutId="clerk-userbtn". The avatar shares layoutId="clerk-avatar". Menu copy fades with AnimatePresence.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-clerk-user-button . Live https://examples.motion.dev/react/clerk-user-button . Repository https://github.com/motiondivision/motion .',
          'Upstream spring bounce 0.15, visualDuration 0.25, content delay 0.15. Replay closes the menu and signs back in.',
        ].join(' '),
      },
    },
  },
  args: { ...CLERK_USER_BUTTON_DEFAULTS },
  argTypes: {
    bounce: {
      control: { type: 'range', min: 0, max: 0.6, step: 0.05 },
      description: 'Layout spring bounce. Upstream default 0.15.',
    },
    visualDuration: {
      control: { type: 'range', min: 0.1, max: 0.8, step: 0.05 },
      description: 'Layout spring visualDuration. Upstream default 0.25.',
    },
    contentDelay: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.05 },
      description: 'Menu copy enter delay. Upstream default 0.15.',
    },
    fullName: { control: 'text' },
    email: { control: 'text' },
    initials: { control: 'text' },
    manageLabel: { control: 'text' },
    signOutLabel: { control: 'text' },
    signInLabel: { control: 'text' },
    signedInHint: { control: 'text' },
    signedOutHint: { control: 'text' },
    initialOpen: {
      control: 'boolean',
      description: 'Open the menu on mount. Upstream default false.',
    },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof ClerkUserButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...CLERK_USER_BUTTON_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open account menu' }),
    );
    await waitFor(() => {
      expect(canvas.getByRole('menu', { name: 'Account menu' })).toBeVisible();
    });
    await waitFor(() => {
      expect(canvas.getByText('Alex, Week 0')).toBeVisible();
    });
    await playReplay(canvas, 'clerk-user-button');
    await expect(
      canvas.getByRole('button', { name: 'Open account menu' }),
    ).toBeVisible();
  },
};

export const OpenOnMount: Story = {
  args: {
    ...CLERK_USER_BUTTON_DEFAULTS,
    initialOpen: true,
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByRole('menu', { name: 'Account menu' })).toBeVisible();
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Sign out' }));
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });
    await waitUntilOpaque(canvas.getByRole('button', { name: 'Sign in' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...CLERK_USER_BUTTON_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFormsBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open account menu' }),
    );
    await waitFor(() => {
      expect(canvas.getByRole('menu', { name: 'Account menu' })).toBeVisible();
    });
  },
};
