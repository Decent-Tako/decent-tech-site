import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';

import { assertFaceNotFallback } from '../../brand/fontFallback';
import { LayoutAnimation } from './LayoutAnimation';
import { expectLayoutBrand, playReplay } from './play';
import {
  LAYOUT_ANIMATION_DEFAULTS,
  LAYOUT_MODE_OPTIONS,
  REDUCED_MOTION_OPTIONS,
} from './source';

const meta = {
  title: 'Motion examples/Layout animation',
  component: LayoutAnimation,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: [
          'Rebuild of motion.dev react-layout-animation in Academy branding.',
          'Mechanism: justifyContent switches flex-end to flex-start. The handle is motion.div layout. MeasureLayout snapshots the old box. The projection node FLIP-animates a CSS transform to the new box.',
          'Package motion 13.2.0, licence MIT. Docs https://motion.dev/docs/react-layout-animations . Example https://motion.dev/examples/react-layout-animation . Live https://examples.motion.dev/react/layout-animation . Repository https://github.com/motiondivision/motion .',
          'Upstream default is layout true, spring visualDuration 0.2, bounce 0.2, isOn false. Replay remounts the switch off. One-shot on click.',
        ].join(' '),
      },
    },
  },
  args: { ...LAYOUT_ANIMATION_DEFAULTS },
  argTypes: {
    layout: {
      control: 'select',
      options: [...LAYOUT_MODE_OPTIONS],
      description: 'layout prop. Upstream default true (size and position).',
    },
    visualDuration: {
      control: { type: 'range', min: 0.05, max: 1, step: 0.05 },
      description: 'Spring visualDuration in seconds. Upstream default 0.2.',
    },
    bounce: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Spring bounce. Upstream default 0.2.',
    },
    heading: { control: 'text' },
    offLabel: { control: 'text' },
    onLabel: { control: 'text' },
    reducedMotion: {
      control: 'select',
      options: [...REDUCED_MOTION_OPTIONS],
    },
  },
} satisfies Meta<typeof LayoutAnimation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...LAYOUT_ANIMATION_DEFAULTS, reducedMotion: 'never' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    const toggle = canvas.getByRole('button', { name: /Publish the page/ });
    await expect(toggle).toHaveAttribute('data-on', 'false');
    await userEvent.click(toggle);
    await waitFor(() => {
      expect(toggle).toHaveAttribute('data-on', 'true');
    });
    await expect(canvas.getByText('Live')).toBeVisible();
    await playReplay(canvas, 'layout-animation');
    await expect(
      canvas.getByRole('button', { name: /Publish the page/ }),
    ).toHaveAttribute('data-on', 'false');
  },
};

export const SlowSpring: Story = {
  args: {
    ...LAYOUT_ANIMATION_DEFAULTS,
    visualDuration: 0.6,
    bounce: 0.45,
    heading: 'Hold the handle. The page stays Draft until you press.',
    reducedMotion: 'never',
  },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await userEvent.click(
      canvas.getByRole('button', { name: /Hold the handle/ }),
    );
    await waitFor(() => {
      expect(
        canvas.getByRole('button', { name: /Hold the handle/ }),
      ).toHaveAttribute('data-on', 'true');
    });
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
  },
};

export const ReducedMotion: Story = {
  args: { ...LAYOUT_ANIMATION_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);
    await expectLayoutBrand(canvas);
    await expect(canvas.getByText('Draft')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(
      canvas.getByRole('button', { name: /Publish the page/ }),
    ).toHaveAttribute('data-on', 'false');
  },
};
