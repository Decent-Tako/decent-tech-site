import { Button } from '@radix-ui/themes';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import { withRadixTheme } from './withRadixTheme';

const meta = {
  title: 'Styled systems/Radix Themes/Button',
  component: Button,
  decorators: [withRadixTheme],
  parameters: {
    docs: {
      description: {
        component:
          'Package `@radix-ui/themes` 3.3.0. Licence MIT. Docs https://www.radix-ui.com/themes/docs/components/button . Source https://github.com/radix-ui/themes . Builds on `radix-ui` primitives. Default Theme appearance, no Academy tokens.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Submit' },
  render: (args) => (
    <Frame note="Official Radix Themes Button. Default Theme, no Academy theme.">
      <Button {...args} />
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(button);
    await expect(button).toBeEnabled();
  },
};
