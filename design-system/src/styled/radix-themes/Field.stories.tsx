import { Flex, Text, TextField } from '@radix-ui/themes';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { withRadixTheme } from './withRadixTheme';

const meta = {
  title: 'Styled systems/Radix Themes/Field',
  decorators: [withRadixTheme],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@radix-ui/themes` 3.3.0. Licence MIT. Docs https://www.radix-ui.com/themes/docs/components/text-field . Source https://github.com/radix-ui/themes . Text Field is the labelled field primitive.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official Radix Themes TextField. Default Theme, no Academy theme.">
      <Flex direction="column" gap="1" maxWidth="16rem">
        <Text as="label" size="2" htmlFor="radix-name">
          Name
        </Text>
        <TextField.Root id="radix-name" placeholder="Required" />
      </Flex>
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Name');
    await userEvent.type(input, 'Ada');
    await expect(input).toHaveValue('Ada');
  },
};
