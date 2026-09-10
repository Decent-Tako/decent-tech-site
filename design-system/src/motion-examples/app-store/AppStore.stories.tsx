import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import {
  effectiveOpacity,
  expectFullColorPhotos,
  expectLiveWordmark,
} from '../../pages/storySupport';
import { AppStore } from './AppStore';

const meta = {
  title: 'Motion examples/App Store',
  component: AppStore,
  parameters: {
    a11y: { test: 'error' },
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Package `motion` 13.2.0. Licence MIT. Rebuild of the motion.dev iOS App Store example. Mechanism: `layoutId` shared layout between the grid `Card` and the expanded `Item`, plus `AnimatePresence` for the overlay fade. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-app-store . Live source https://examples.motion.dev/react/app-store . Repository https://github.com/motiondivision/motion . React `^18 || ^19`. No extra runtime: `next/image` is replaced with `img` because Storybook is not Next.js. `layoutId` strings stay fixed because they are identity keys, not visual parameters. Photo crop offsets stay fixed because they are content composition. Intended viewport 990px and above; below that the grid is 50/50. Prior Academy use: Pages/Navigation already uses `layoutId` for a different composition.',
      },
      story: { inline: true, height: '920px' },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    overlayDuration: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
      description: 'Overlay fade duration in seconds.',
    },
    overlayDelay: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.05 },
      description: 'Overlay fade delay in seconds. Upstream default 0.1.',
    },
    layoutType: {
      control: 'select',
      options: ['spring', 'tween'],
      description: 'Shared-layout transition type. Motion default is spring.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Spring bounce. Used when layoutType is spring.',
    },
    visualDuration: {
      control: { type: 'range', min: 0.1, max: 1.2, step: 0.05 },
      description: 'Spring visual duration in seconds.',
    },
    tweenDuration: {
      control: { type: 'range', min: 0.1, max: 1.2, step: 0.05 },
      description: 'Tween duration in seconds. Used when layoutType is tween.',
    },
    presenceMode: {
      control: 'select',
      options: ['sync', 'wait', 'popLayout'],
      description: 'AnimatePresence mode. Upstream default is sync.',
    },
    initialOpenId: {
      control: 'select',
      options: ['none', 'start', 'learn', 'tools', 'lounge'],
      description: 'Card that starts expanded. none shows the grid.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'MotionConfig reducedMotion. always shows the final state.',
    },
  },
  args: {
    overlayDuration: 0.2,
    overlayDelay: 0.1,
    layoutType: 'spring',
    bounce: 0.2,
    visualDuration: 0.4,
    tweenDuration: 0.35,
    presenceMode: 'sync',
    initialOpenId: 'none',
    reducedMotion: 'user',
  },
} satisfies Meta<typeof AppStore>;

export default meta;
type Story = StoryObj<typeof meta>;

const START_TITLE = 'Set the goal to $3,000. Publish the page.';
const START_BODY = /Complete the Circle profile/;
const LEARN_TITLE = 'Complete one week at a time.';

async function playStore(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expectLiveWordmark(canvas);
  await expect(canvas.getByRole('heading', { name: 'Today' })).toBeVisible();
  await expectFullColorPhotos(canvas);
}

async function waitForOpenCopy(
  canvasElement: HTMLElement,
  body: RegExp,
) {
  await waitFor(
    () => {
      const open = canvasElement.querySelector('.card-content-container.open');
      expect(open).not.toBeNull();
      const paragraph = open!.querySelector('p.big');
      expect(paragraph).not.toBeNull();
      expect(paragraph!.textContent ?? '').toMatch(body);
      expect(getComputedStyle(paragraph as HTMLElement).color).toBe(
        'rgb(33, 33, 33)',
      );
      const plate = open!.querySelector('.title-container') as HTMLElement | null;
      expect(plate).not.toBeNull();
      expect(effectiveOpacity(plate!)).toBe(1);
      const heading = plate!.querySelector('h2') as HTMLElement | null;
      const kicker = plate!.querySelector('.h6') as HTMLElement | null;
      expect(heading).not.toBeNull();
      expect(kicker).not.toBeNull();
      expect(effectiveOpacity(heading!)).toBe(1);
      expect(effectiveOpacity(kicker!)).toBe(1);
      expect(getComputedStyle(heading!).color).toBe('rgb(255, 255, 255)');
      expect(getComputedStyle(kicker!).color).toBe('rgb(255, 255, 255)');
    },
    { timeout: 4000 },
  );
}

export const Default: Story = {
  args: {
    overlayDuration: 0.2,
    overlayDelay: 0.1,
    layoutType: 'spring',
    bounce: 0.2,
    visualDuration: 0.4,
    tweenDuration: 0.35,
    presenceMode: 'sync',
    initialOpenId: 'none',
    reducedMotion: 'user',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playStore(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitForOpenCopy(canvasElement, START_BODY);
    await userEvent.click(canvas.getByRole('button', { name: 'Close card' }));
    await waitFor(
      () => {
        expect(canvas.queryByRole('button', { name: 'Close card' })).toBeNull();
      },
      { timeout: 3000 },
    );
    await userEvent.click(
      canvas.getByRole('button', { name: `Six weeks. ${LEARN_TITLE}` }),
    );
    await waitForOpenCopy(canvasElement, /Finish the current lesson/);
  },
};

export const OpenOnMount: Story = {
  args: {
    overlayDuration: 0.2,
    overlayDelay: 0.1,
    layoutType: 'spring',
    bounce: 0.2,
    visualDuration: 0.4,
    tweenDuration: 0.35,
    presenceMode: 'sync',
    initialOpenId: 'start',
    reducedMotion: 'user',
  },
  play: async ({ canvas, userEvent }) => {
    await playStore(canvas);
    await waitFor(
      () => {
        expect(canvas.getByText(START_BODY)).toBeVisible();
        expect(canvas.getByRole('button', { name: 'Close card' })).toBeVisible();
      },
      { timeout: 3000 },
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(
      () => {
        expect(canvas.getByText(START_BODY)).toBeVisible();
        expect(canvas.getByRole('button', { name: 'Close card' })).toBeVisible();
      },
      { timeout: 3000 },
    );
  },
};

export const ReducedMotion: Story = {
  args: {
    overlayDuration: 0.2,
    overlayDelay: 0.1,
    layoutType: 'spring',
    bounce: 0.2,
    visualDuration: 0.4,
    tweenDuration: 0.35,
    presenceMode: 'sync',
    initialOpenId: 'none',
    reducedMotion: 'always',
  },
  play: async ({ canvas, userEvent }) => {
    await playStore(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: `Week 0. ${START_TITLE}` }),
    );
    await waitFor(
      () => {
        expect(canvas.getByText(START_BODY)).toBeVisible();
      },
      { timeout: 3000 },
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitFor(
      () => {
        expect(canvas.getByText(START_BODY)).toBeVisible();
      },
      { timeout: 3000 },
    );
  },
};

export const TweenLayout: Story = {
  args: {
    overlayDuration: 0.2,
    overlayDelay: 0.1,
    layoutType: 'tween',
    bounce: 0.2,
    visualDuration: 0.4,
    tweenDuration: 0.5,
    presenceMode: 'sync',
    initialOpenId: 'none',
    reducedMotion: 'user',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await playStore(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await waitForOpenCopy(canvasElement, START_BODY);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 700);
    });
  },
};
