import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { PillNav } from './PillNav';
import { GSAP_EASES, PILL_NAV_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/Components/Pill Nav',
  component: PillNav,
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits Pill Nav, commit 625f250, 2026-09-10. Mechanism: hover plays a gsap circle wipe on each pill. Licence MIT + Commons Clause. Page https://reactbits.dev/components/pill-nav . Runtime gsap 3.15.0, react-router-dom 6.30.6. Pause holds the gsap global timeline. Replay remounts the nav.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...PILL_NAV_DEFAULTS },
  argTypes: {
    logoAlt: {
      control: 'text',
      description: 'Alt text for the logo. Brand default Uncomfortable Academy. Upstream default Logo.',
    },
    ease: {
      control: 'select',
      options: [...GSAP_EASES],
      description: 'gsap ease of the hover wipe. Upstream default power3.easeOut.',
    },
    baseColor: {
      control: 'color',
      description: 'Nav shell colour. Brand token paper. Upstream default #fff.',
    },
    pillColor: {
      control: 'color',
      description: 'Idle pill colour. Brand token ink. Upstream default #120F17.',
    },
    hoveredPillTextColor: {
      control: 'color',
      description: 'Hover label colour. Brand token ink. Upstream default #120F17.',
    },
    pillTextColor: {
      control: 'color',
      description: 'Idle label colour. Brand token paper. Upstream default follows baseColor.',
    },
    initialLoadAnimation: {
      control: 'boolean',
      description: 'Scale the logo and expand the pills on mount. Upstream default true.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always skips the load animation.',
    },
  },
} satisfies Meta<typeof PillNav>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

const SLOW = { timeout: 8000 };

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: 'Pill Nav' })).toBeVisible();
}

async function playSelect(canvas: Canvas) {
  const stage = canvas.getByTestId('pill-nav-stage');
  await userEvent.click(canvas.getAllByRole('menuitem', { name: 'Learn' })[0]);
  await waitFor(() => {
    expect(stage).toHaveAttribute('data-active', '#learn');
  }, SLOW);
  return stage;
}

async function playPauseResume(canvas: Canvas, stage: HTMLElement) {
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Resume' }));
  await expect(stage).toHaveAttribute('data-paused', 'false');
}

export const Default: Story = {
  args: { ...PILL_NAV_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await playPauseResume(canvas, stage);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-run', '1');
    await expect(stage).toHaveAttribute('data-active', '#start');
  },
};

export const AccentPills: Story = {
  args: {
    ...PILL_NAV_DEFAULTS,
    pillColor: '#0035B1',
    hoveredPillTextColor: '#FFFFFF',
    pillTextColor: '#DEF54F',
    initialLoadAnimation: false,
  },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playSelect(canvas);
    await expect(stage).toHaveAttribute('data-load', 'false');
    await playPauseResume(canvas, stage);
  },
};

export const ReducedMotion: Story = {
  args: { ...PILL_NAV_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = canvas.getByTestId('pill-nav-stage');
    await expect(stage).toHaveAttribute('data-reduced', 'true');
    await expect(stage).toHaveAttribute('data-load', 'false');
    await playSelect(canvas);
    await playPauseResume(canvas, stage);
  },
};
