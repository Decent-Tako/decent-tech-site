import { Command } from 'cmdk';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Specimen } from './Specimen';

const meta = {
  title: 'UI primitives/Command',
  parameters: {
    docs: {
      description: {
        component:
          'Package `cmdk` 1.1.1. Licence MIT. Docs https://github.com/pacocoursey/cmdk . React `^18 || ^19`. Prior use: installed only. Academy need: command and search.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Themed: Story = {
  render: () => (
    <Specimen themed note="Light theme: selected item background #DEF54F.">
      <Command label="Command menu" className="gallery-command">
        <Command.Input placeholder="Search" />
        <Command.List>
          <Command.Empty>No results</Command.Empty>
          <Command.Item value="calendar">Calendar</Command.Item>
          <Command.Item value="search">Search people</Command.Item>
        </Command.List>
      </Command>
    </Specimen>
  ),
};

export const Default: Story = {
  render: () => (
    <Specimen note="Upstream cmdk Command, Input, List, and Item.">
      <Command label="Command menu" className="gallery-command">
        <Command.Input placeholder="Search" />
        <Command.List>
          <Command.Empty>No results</Command.Empty>
          <Command.Item value="calendar">Calendar</Command.Item>
          <Command.Item value="search">Search people</Command.Item>
        </Command.List>
      </Command>
    </Specimen>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByPlaceholderText('Search');
    await userEvent.type(input, 'cal');
    await expect(canvas.getByText('Calendar')).toBeVisible();
    await expect(canvas.queryByText('Search people')).toBeNull();
  },
};
