import { Flex, Text, TextField } from '@radix-ui/themes';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { withRadixTheme } from './withRadixTheme';

const meta = {
  title: 'Styled systems/Radix Themes/Command',
  decorators: [withRadixTheme],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@radix-ui/themes` 3.3.0. Licence MIT. Docs https://www.radix-ui.com/themes/docs/components/text-field . Source https://github.com/radix-ui/themes . No command palette. Search uses Text Field type=search.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Radix Themes has no command palette. This is the official search Text Field.">
      <Flex direction="column" gap="1" maxWidth="16rem">
        <Text as="label" size="2" htmlFor="radix-search">
          Search
        </Text>
        <TextField.Root
          id="radix-search"
          type="search"
          placeholder="Search"
        />
      </Flex>
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Search');
    await userEvent.type(input, 'cal');
    await expect(input).toHaveValue('cal');
  },
};
