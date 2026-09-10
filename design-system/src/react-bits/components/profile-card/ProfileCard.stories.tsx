import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { movePointer } from '../../frame/pointerSupport';
import { ProfileCard } from './ProfileCard';
import { PROFILE_CARD_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Profile Card',
  component: ProfileCard,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Profile Card, commit 625f250, 2026-09-10. Mechanism: pointer motion on the shell drives CSS rotate and shine. Licence MIT + Commons Clause. Page https://reactbits.dev/components/profile-card . No extra runtime. Pause cancels the tilt engine. Replay remounts the card.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PROFILE_CARD_DEFAULTS },
  argTypes: {
    innerGradient: {
      control: 'text',
      description:
        'Inside gradient. Brand blue to yellow. Upstream default linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%).',
    },
    behindGlowEnabled: {
      control: 'boolean',
      description: 'Show the glow behind the card. Upstream default true.',
    },
    behindGlowColor: {
      control: 'color',
      description: 'Glow colour. Brand accent blue. Upstream default rgba(125, 190, 255, 0.67).',
    },
    behindGlowSize: {
      control: 'text',
      description: 'Glow size as a CSS length. Upstream default 50%.',
    },
    enableTilt: {
      control: 'boolean',
      description: 'Tilt the card with the pointer. Upstream default true.',
    },
    enableMobileTilt: {
      control: 'boolean',
      description: 'Tilt from device orientation. Upstream default false. Stories keep this off.',
    },
    mobileTiltSensitivity: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Device tilt gain. Upstream default 5.',
    },
    showUserInfo: {
      control: 'boolean',
      description: 'Show handle, status, and contact. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always turns tilt off.',
    },
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Profile Card' })).toBeVisible();
}

async function playTilt(canvas: Canvas) {
  const stage = canvas.getByTestId('profile-card-stage');
  const shell = stage.querySelector('.pc-card-shell');
  if (!(shell instanceof HTMLElement)) throw new Error('The Profile Card shell is missing.');
  movePointer(shell, 40, 40);
  await waitFor(() => {
    expect(shell.classList.contains('active')).toBe(true);
  }, SLOW);
  return stage;
}

async function playContact(canvas: Canvas) {
  const stage = canvas.getByTestId('profile-card-stage');
  await userEvent.click(canvas.getByRole('button', { name: /Contact Start/i }));
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-contacted', 'true');
  }, SLOW);
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...PROFILE_CARD_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await expect(canvas.getByRole('heading', { name: 'Start' })).toBeVisible();
    const stage = await playTilt(canvas);
    await playContact(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-contacted', 'false');
  },
};

export const NoTilt: Story = {
  args: { ...PROFILE_CARD_DEFAULTS, enableTilt: false },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('profile-card-stage');
    await expect(stage).toHaveAttribute('data-tilt', 'false');
    await playContact(canvas);
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PROFILE_CARD_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('profile-card-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-tilt', 'false');
    await playContact(canvas);
    await playPauseResume(canvas, stage);
  },
};
