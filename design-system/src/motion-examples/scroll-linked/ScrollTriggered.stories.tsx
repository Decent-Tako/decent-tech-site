import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { expectFullColorPhotos } from '../../pages/storySupport';
import { TRIGGERED_DEFAULTS } from './data';
import { ScrollTriggered } from './ScrollTriggered';

const meta = {
  title: 'Motion examples/Scroll-triggered',
  component: ScrollTriggered,
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-scroll-triggered in Academy branding.',
          'Mechanism: whileInView swaps offscreen/onscreen variants. The onscreen variant springs y and rotate.',
          'Package motion 13.2.0, licence MIT.',
          'Docs https://motion.dev/docs/react-motion-component . Example https://motion.dev/examples/react-scroll-triggered .',
          'One-shot per enter. Replay remounts the cards.',
        ].join(' '),
      },
      story: { inline: true, height: '640px' },
    },
  },
  tags: ['autodocs'],
  args: { ...TRIGGERED_DEFAULTS },
  argTypes: {
    amount: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'viewport.amount. Upstream 0.8. Package default "some".',
    },
    once: {
      control: 'boolean',
      description: 'viewport.once. Upstream unset, package default false.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Spring bounce. Upstream 0.4.',
    },
    duration: {
      control: { type: 'range', min: 0.2, max: 2, step: 0.1 },
      description: 'Spring visual duration in seconds. Upstream 0.8.',
    },
    offscreenY: {
      control: { type: 'range', min: 80, max: 480, step: 10 },
      description: 'offscreen variant y. Upstream 300.',
    },
    onscreenY: {
      control: { type: 'range', min: 0, max: 120, step: 5 },
      description: 'onscreen variant y. Upstream 50.',
    },
    rotate: {
      control: { type: 'range', min: -25, max: 25, step: 1 },
      description: 'onscreen rotate in degrees. Upstream -10.',
    },
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
    },
  },
} satisfies Meta<typeof ScrollTriggered>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playTriggered(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
  canvasElement: HTMLElement,
) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(
    canvas.getByRole('heading', { name: 'Scroll-triggered' }),
  ).toBeVisible();
  await expect(
    canvas.getByRole('heading', { name: 'Set the goal to $3,000.' }),
  ).toBeVisible();
  await expectFullColorPhotos(canvas);
  const first = canvasElement.querySelector('[data-card]') as HTMLElement | null;
  expect(first).not.toBeNull();
  await waitFor(() => {
    const transform = getComputedStyle(first as HTMLElement).transform;
    expect(transform).not.toBe('none');
    expect(transform).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  await expect(
    canvas.getByRole('heading', { name: 'Set the goal to $3,000.' }),
  ).toBeVisible();
}

export const Default: Story = {
  args: { ...TRIGGERED_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas, canvasElement }) => {
    await playTriggered(canvas, canvasElement);
  },
};

export const Once: Story = {
  args: {
    ...TRIGGERED_DEFAULTS,
    once: true,
    bounce: 0.15,
    duration: 1.2,
    reducedMotion: 'never',
  },
  play: async ({ canvas, canvasElement }) => {
    await playTriggered(canvas, canvasElement);
    const stage = canvasElement.querySelector('[data-scroll-stage]') as HTMLElement;
    stage.scrollTop = stage.scrollHeight;
    await waitFor(() => {
      expect(
        canvas.getByRole('heading', {
          name: '$3,000 before Challenge week.',
        }),
      ).toBeVisible();
    });
  },
};

export const ReducedMotion: Story = {
  args: { ...TRIGGERED_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas, canvasElement }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectFullColorPhotos(canvas);
    const first = canvasElement.querySelector('[data-card]') as HTMLElement;
    await waitFor(() => {
      const transform = getComputedStyle(first).transform;
      expect(transform).not.toBe('none');
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(
      canvas.getByRole('heading', { name: 'Set the goal to $3,000.' }),
    ).toBeVisible();
  },
};
