import { Autocomplete } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { withMantine } from './withMantine';

const meta = {
  title: 'Styled systems/Mantine/Command',
  decorators: [withMantine],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@mantine/core` 9.6.0. Licence MIT. Docs https://mantine.dev/core/autocomplete/ . Source https://github.com/mantinedev/mantine . Autocomplete is the search primitive. Spotlight is a separate package.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official Mantine Autocomplete. Default provider, no Academy theme.">
      <Autocomplete
        label="Search"
        placeholder="Search"
        data={['Calendar', 'Search people']}
      />
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText('Search');
    await userEvent.type(input, 'cal');
    await expect(input).toHaveValue('cal');
  },
};
