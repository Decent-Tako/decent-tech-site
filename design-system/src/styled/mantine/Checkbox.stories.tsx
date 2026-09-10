import { Checkbox } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { withMantine } from './withMantine';

const meta = {
  title: 'Styled systems/Mantine/Checkbox',
  decorators: [withMantine],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@mantine/core` 9.6.0. Licence MIT. Docs https://mantine.dev/core/checkbox/ . Source https://github.com/mantinedev/mantine .',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official Mantine Checkbox. Default provider, no Academy theme.">
      <Checkbox label="Enable notices" />
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole('checkbox', { name: 'Enable notices' });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
