import { TextInput } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { withMantine } from './withMantine';

const meta = {
  title: 'Styled systems/Mantine/Field',
  decorators: [withMantine],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@mantine/core` 9.6.0. Licence MIT. Docs https://mantine.dev/core/text-input/ . Source https://github.com/mantinedev/mantine . TextInput is the labelled field.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official Mantine TextInput. Default provider, no Academy theme.">
      <TextInput label="Name" placeholder="Required" />
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Name');
    await userEvent.type(input, 'Ada');
    await expect(input).toHaveValue('Ada');
  },
};
