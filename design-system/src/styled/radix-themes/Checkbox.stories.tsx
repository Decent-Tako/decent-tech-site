import { Checkbox, Flex, Text } from '@radix-ui/themes';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { withRadixTheme } from './withRadixTheme';

const meta = {
  title: 'Styled systems/Radix Themes/Checkbox',
  decorators: [withRadixTheme],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@radix-ui/themes` 3.3.0. Licence MIT. Docs https://www.radix-ui.com/themes/docs/components/checkbox . Source https://github.com/radix-ui/themes . Builds on `radix-ui` Checkbox.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official Radix Themes Checkbox. Default Theme, no Academy theme.">
      <Text as="label" size="2">
        <Flex gap="2" align="center">
          <Checkbox />
          Enable notices
        </Flex>
      </Text>
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const box = canvas.getByRole('checkbox', { name: 'Enable notices' });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
