import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Specimen } from './Specimen';

import 'react-day-picker/style.css';

const meta = {
  title: 'UI primitives/DayPicker',
  parameters: {
    docs: {
      description: {
        component:
          'Package `react-day-picker` 10.0.1. Licence MIT. Docs https://daypicker.dev . Source https://github.com/gpbl/react-day-picker . Prior use: motion library installed 9.8.1 with no import. Gallery uses current 10.0.1. Academy need: date input.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Picker({ className }: { className?: string }) {
  const [selected, setSelected] = useState<Date | undefined>(
    new Date(2026, 8, 9),
  );

  return (
    <DayPicker
      className={className}
      mode="single"
      month={new Date(2026, 8, 1)}
      today={new Date(2026, 8, 9)}
      selected={selected}
      onSelect={setSelected}
    />
  );
}

export const Themed: Story = {
  render: () => (
    <Specimen themed note="Light theme: DayPicker accent tokens #0035B1 and #DEF54F.">
      <Picker />
    </Specimen>
  ),
};

export const Default: Story = {
  render: () => (
    <Specimen note="Upstream DayPicker mode=single with the package stylesheet.">
      <Picker />
    </Specimen>
  ),
  play: async ({ canvas, userEvent }) => {
    const day = canvas.getByRole('button', {
      name: 'Thursday, September 10th, 2026',
    });
    await userEvent.click(day);
    await expect(day).toHaveAccessibleName(
      'Thursday, September 10th, 2026, selected',
    );
  },
};
