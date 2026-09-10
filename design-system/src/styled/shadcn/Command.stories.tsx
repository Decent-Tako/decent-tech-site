import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Frame } from '../Frame';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { withShadcn } from './withShadcn';

const meta = {
  title: 'Styled systems/shadcn/Command',
  decorators: [withShadcn],
  parameters: {
    docs: {
      description: {
        component:
          'Package `shadcn` 4.21.0, style `base-nova`. Licence MIT. Docs https://ui.shadcn.com/docs/components/command . Source https://github.com/shadcn-ui/ui . Builds on `cmdk` 1.1.1.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Frame note="Official shadcn Command. No Academy theme.">
      <Command label="Command menu" className="max-w-sm border">
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandItem value="calendar">Calendar</CommandItem>
          <CommandItem value="search">Search people</CommandItem>
        </CommandList>
      </Command>
    </Frame>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Search');
    await userEvent.type(input, 'cal');
    await expect(canvas.getByText('Calendar')).toBeVisible();
    await expect(canvas.queryByText('Search people')).toBeNull();
  },
};
