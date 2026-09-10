import { Group, Panel, Separator } from 'react-resizable-panels';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Specimen } from './Specimen';

const meta = {
  title: 'UI primitives/Panels',
  parameters: {
    docs: {
      description: {
        component:
          'Package `react-resizable-panels` 4.12.4. Licence MIT. Docs https://react-resizable-panels.vercel.app . Source https://github.com/bvaughn/react-resizable-panels . React `^18 || ^19`. Prior use: installed only. Academy need: split panels.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Themed: Story = {
  render: () => (
    <Specimen themed note="Light theme: panel surfaces use Academy paper and ink.">
      <Group className="gallery-panel-group" orientation="horizontal">
        <Panel className="gallery-split gallery-panel" id="outline" minSize={20}>
          Outline
        </Panel>
        <Separator className="gallery-separator" />
        <Panel className="gallery-split gallery-panel" id="canvas" minSize={20}>
          Canvas
        </Panel>
      </Group>
    </Specimen>
  ),
};

export const Default: Story = {
  render: () => (
    <Specimen note="Upstream Group, Panel, and Separator.">
      <Group className="gallery-panel-group" orientation="horizontal">
        <Panel className="gallery-split" id="outline" minSize={20}>
          Outline
        </Panel>
        <Separator className="gallery-separator" />
        <Panel className="gallery-split" id="canvas" minSize={20}>
          Canvas
        </Panel>
      </Group>
    </Specimen>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Outline')).toBeVisible();
    await expect(canvas.getByText('Canvas')).toBeVisible();
  },
};
