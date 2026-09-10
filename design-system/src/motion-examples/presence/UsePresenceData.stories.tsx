import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { PRESENCE_DATA_DEFAULTS } from './defaults';
import { expectPresenceBrand, playPhotos, playReplay } from './play';
import {
  PRESENCE_MODE_OPTIONS,
  REDUCED_MOTION_OPTIONS,
} from './source';
import { UsePresenceData } from './UsePresenceData';

const meta = {
  title: 'Motion examples/Presence/usePresenceData',
  component: UsePresenceData,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-use-presence-data in Academy branding.',
          'The upstream demo exports no props. Controls lift mode, custom offset, spring delay, visualDuration, and bounce.',
          'Mechanism: AnimatePresence custom={direction} mode="popLayout". Slide is forwardRef and reads direction with usePresenceData().',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-animate-presence .',
          'Example https://motion.dev/examples/react-use-presence-data .',
          'Live https://examples.motion.dev/react/use-presence-data .',
          'One-shot per slide. Replay remounts on Week 0. Next and Previous is the live trigger.',
        ].join(' '),
      },
    },
  },
  args: {
    ...PRESENCE_DATA_DEFAULTS,
    reducedMotion: 'never',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: [...PRESENCE_MODE_OPTIONS],
      description: 'AnimatePresence mode. Upstream default popLayout.',
    },
    presenceInitial: {
      control: 'boolean',
      description: 'AnimatePresence initial. Upstream default false.',
    },
    xOffset: {
      control: { type: 'range', min: 20, max: 120, step: 5 },
      description: 'Enter x is direction * xOffset. Upstream default 50.',
    },
    delay: {
      control: { type: 'range', min: 0, max: 0.8, step: 0.05 },
      description: 'Enter spring delay in seconds. Upstream default 0.2.',
    },
    visualDuration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Enter spring visualDuration. Upstream default 0.3.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Enter spring bounce. Upstream default 0.4.',
    },
    tapScale: {
      control: { type: 'range', min: 0.7, max: 1, step: 0.05 },
      description: 'Prev/Next whileTap scale. Upstream default 0.9.',
    },
    size: {
      control: { type: 'range', min: 120, max: 240, step: 10 },
      description: 'Slide size in pixels. Upstream default 150.',
    },
    caption: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof UsePresenceData>;

export default meta;
type Story = StoryObj<typeof meta>;

async function playNextPrev(
  canvas: Parameters<NonNullable<Story['play']>>[0]['canvas'],
) {
  const row = canvas.getByTestId('presence-slide').closest('.presence-slides');
  await expect(row).toHaveAttribute('data-slide', '1');
  await expect(canvas.getByText('Set Up')).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
  await waitFor(() => {
    expect(row).toHaveAttribute('data-slide', '2');
  });
  await waitFor(() => {
    expect(canvas.getByText('Finding your why')).toBeVisible();
  });
  await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
  await waitFor(() => {
    expect(row).toHaveAttribute('data-slide', '1');
  });
}

export const Default: Story = {
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expect(canvas.getByText('Six Academy weeks')).toBeVisible();
    await playPhotos(canvas);
    await playNextPrev(canvas);
    await playReplay(canvas, 'presence-data');
  },
};

export const WaitMode: Story = {
  args: {
    ...PRESENCE_DATA_DEFAULTS,
    mode: 'wait',
    caption: 'Wait mode: exit finishes before Week 1 enters',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByText('Wait mode: exit finishes before Week 1 enters'),
    ).toBeVisible();
    await playPhotos(canvas);
    await playNextPrev(canvas);
    await playReplay(canvas, 'presence-data');
  },
};

export const ReducedMotion: Story = {
  args: {
    ...PRESENCE_DATA_DEFAULTS,
    reducedMotion: 'always',
  },
  play: async ({ canvas }) => {
    await expectPresenceBrand(canvas);
    await playPhotos(canvas);
    await playNextPrev(canvas);
  },
};
