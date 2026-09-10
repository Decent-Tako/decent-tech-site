import { Button } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { withMantine } from './withMantine';

const meta = {
  title: 'Styled systems/Mantine/Button',
  component: Button,
  decorators: [withMantine],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@mantine/core` 9.6.0. Licence MIT. Docs https://mantine.dev/core/button/ . Source https://github.com/mantinedev/mantine . Default MantineProvider, no Academy tokens.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Submit', color: 'dark' },
  render: (args) => (
    <Frame note="Official Mantine Button. Default provider, no Academy theme. color=dark so filled type meets WCAG AA. Mantine blue.5 does not.">
      <Button {...args} />
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(button);
    await expect(button).toBeEnabled();
  },
};
