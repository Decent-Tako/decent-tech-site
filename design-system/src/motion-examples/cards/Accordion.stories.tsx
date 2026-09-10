import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { Accordion } from './Accordion';
import { expectCardsBrand, playReplay } from './play';
import { ACCORDION_DEFAULTS, REDUCED_MOTION_OPTIONS } from './source';

const meta = {
  title: 'Motion examples/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-accordion in Academy branding.',
          'The article page now marks this example plus:true and only prints the Get started stub.',
          'Full source is the live View source chunk on examples.motion.dev.',
          'Mechanism: height auto plus maskImage variants. Inner copy blur and opacity. Chevron rotate 180. layoutId focus ring on :focus-visible.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-accordion . Live source https://examples.motion.dev/assets/index-C4wM9kMh.js .',
          'The demo exports no props. Controls lift duration, blur, and items. Replay remounts every item closed.',
        ].join(' '),
      },
    },
  },
  args: { ...ACCORDION_DEFAULTS },
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'MotionConfig duration. Upstream 0.3.',
    },
    blur: {
      control: { type: 'range', min: 0, max: 8, step: 0.5 },
      description: 'Closed copy blur in pixels. Upstream 2.',
    },
    items: { control: 'object' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
    replayNonce: { control: { type: 'number', min: 0, max: 20, step: 1 } },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...ACCORDION_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectCardsBrand(canvas);
    const trigger = canvas.getByRole('button', { name: 'What is Week 0?' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(
        canvas.getByRole('button', { name: 'What is Week 0?' }),
      ).toHaveAttribute('aria-expanded', 'true');
    });
    await waitFor(() => {
      expect(canvas.getByText(/Week 0 is Set Up/)).toBeVisible();
    });
    await playReplay(canvas, 'accordion');
    await waitFor(() => {
      expect(
        canvas.getByRole('button', { name: 'What is Week 0?' }),
      ).toHaveAttribute('aria-expanded', 'false');
    });
  },
};

export const SlowBlur: Story = {
  args: {
    ...ACCORDION_DEFAULTS,
    duration: 0.8,
    blur: 6,
    items: [
      {
        header: 'How does Learn + Do work?',
        body: [
          'Sunday sessions: 30 minutes learn, 30 minutes do. Finish the current lesson and its action before the next week opens.',
        ],
      },
      {
        header: 'Who is Buddy?',
        body: [
          'Buddy is the person you check in with most. The Team Leader runs Learn + Do and keeps the Team moving.',
        ],
      },
      {
        header: 'What is the 100-person tracker?',
        body: [
          'Map 100 people. Start with the inner circle. Send the first asks before Challenge week.',
        ],
      },
    ],
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: 'How does Learn + Do work?' }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole('button', { name: 'How does Learn + Do work?' }),
      ).toHaveAttribute('aria-expanded', 'true');
    });
    await playReplay(canvas, 'accordion');
  },
};

export const ReducedMotion: Story = {
  args: { ...ACCORDION_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await expectCardsBrand(canvas);
    await expect(canvas.getByTestId('accordion')).toHaveAttribute(
      'data-running',
      'false',
    );
    await expect(
      canvas.getByRole('button', { name: 'What is Week 0?' }),
    ).toHaveAttribute('aria-expanded', 'false');
  },
};
