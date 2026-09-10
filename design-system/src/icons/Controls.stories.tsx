import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { IconControls, type IconRenderProps } from './catalog';

function ControlsStory(props: IconRenderProps) {
  return <IconControls props={props} />;
}

const meta = {
  title: 'Icon resources/Controls',
  component: ControlsStory,
  args: {
    size: 48,
    color: '#111111',
    strokeWidth: 2,
    weight: 'regular',
    mirrored: false,
    labelled: true,
    heroSolid: false,
  },
  argTypes: {
    size: { control: { type: 'range', min: 16, max: 96, step: 4 } },
    color: { control: 'color' },
    strokeWidth: { control: { type: 'range', min: 0.5, max: 3, step: 0.5 } },
    weight: {
      control: 'select',
      options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    },
    mirrored: { control: 'boolean' },
    labelled: { control: 'boolean' },
    heroSolid: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Package-native size, colour, stroke or weight, mirroring, and accessible names. Heroicons has no stroke prop. Lucide and Tabler have no weight prop. Only Phosphor has mirrored.',
      },
    },
  },
} satisfies Meta<typeof ControlsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Themed: Story = {
  args: {
    color: '#0035B1',
    size: 48,
    labelled: true,
  },
};

export const Default: Story = {
  play: async ({ canvas }) => {
    const rocket = canvas.getByRole('img', { name: 'lucide-react Rocket' });
    await expect(rocket).toBeVisible();
    await expect(rocket).toHaveAttribute('width', '48');
    await expect(canvas.getByRole('img', { name: '@phosphor-icons/react RocketIcon' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: '@tabler/icons-react IconRocket' })).toBeVisible();
    await expect(
      canvas.getByRole('img', { name: '@heroicons/react RocketLaunchIcon' }),
    ).toBeVisible();
    await expect(canvas.getByText('strokeWidth supported')).toBeVisible();
    await expect(canvas.getByText('weight supported')).toBeVisible();
    await expect(canvas.getByText('mirrored supported')).toBeVisible();
  },
};

export const Mirrored: Story = {
  args: {
    mirrored: true,
    labelled: true,
    size: 48,
  },
};

export const LabelledOff: Story = {
  args: {
    labelled: false,
    size: 48,
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('img', { name: 'lucide-react Rocket' })).toBeNull();
    await expect(canvas.getByText('Rocket')).toBeVisible();
  },
};

