import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { DataTable, ChartFrame } from './Frame';
import { CURRENT_WEEK, DATASET_NOTE, STATES, WEEKS } from './dataset';
import { assertFaceNotFallback } from '../brand/fontFallback';
import {
  VisxArea,
  VisxBar,
  VisxLegendTooltip,
  VisxLine,
  VisxProgress,
  VisxSmallMultiples,
} from './visxCharts';

const meta = {
  title: 'Charts and data/visx',
  parameters: {
    docs: {
      description: {
        component:
          'Packages `@visx/shape` `@visx/scale` `@visx/axis` `@visx/group` `@visx/grid` `@visx/pattern` `@visx/glyph` `@visx/annotation` `@visx/legend` `@visx/tooltip` `@visx/responsive` 4.0.0. Licence MIT. Docs https://visx.airbnb.tech . Source https://github.com/airbnb/visx . React `^18 || ^19`. Accessibility is DIY. Prior use: Storybook candidate ActivityLine, CompletionBars, StateBars. Academy need: later graph components.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const weekColumns = [
  { key: 'id', header: 'Week' },
  { key: 'asks', header: 'Asks' },
  { key: 'completion', header: 'Finished %' },
];

export const Themed: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="Themed visx line, area, glyphs, and Annotation on the peak week."
      note={`${DATASET_NOTE} Light theme: ink stroke, line fill, yellow subject. ParentSize sizes the SVG.`}
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <VisxLine data={WEEKS} themed annotate />
    </ChartFrame>
  ),
  play: async ({ canvas }) => {
    // Axis and legend labels render in Brand Sans. A fallback would misreport the brand.
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);

    await expect(canvas.getByRole('figure', { name: 'Weekly asks' })).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'W5' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'Weekly asks' })).toBeVisible();
  },
};

export const Line: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="Upstream LinePath and GlyphDot with default black marks."
      note="API LinePath, GlyphDot, AxisBottom, AxisLeft, GridRows. visx has no default theme."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <VisxLine data={WEEKS} />
    </ChartFrame>
  ),
};

export const Bar: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="Upstream Bar with default black fill."
      note="API Bar, scaleBand, scaleLinear, AxisBottom, AxisLeft."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <VisxBar data={WEEKS} />
    </ChartFrame>
  ),
};

export const Area: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="Upstream AreaClosed with default black fill."
      note="API AreaClosed, yScale, AxisBottom, AxisLeft."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <VisxArea data={WEEKS} />
    </ChartFrame>
  ),
};

export const Progress: Story = {
  render: () => (
    <ChartFrame
      title="Week 0 completion"
      caption="A Bar meter. visx has no Progress component. Hatch keeps colour from being the only cue."
      note={`Current week is ${CURRENT_WEEK.title} at ${CURRENT_WEEK.completion} percent.`}
      table={
        <DataTable
          caption="Current week"
          columns={[
            { key: 'id', header: 'Week' },
            { key: 'completion', header: 'Finished %' },
            { key: 'remaining', header: 'Remaining %' },
          ]}
          rows={[CURRENT_WEEK]}
        />
      }
    >
      <VisxProgress themed />
    </ChartFrame>
  ),
};

export const SmallMultiples: Story = {
  render: () => (
    <ChartFrame
      title="State cohort mix"
      caption="One small Bar per state. Same participants field as Recharts."
      note="API Bar. Themed fill uses #0035B1. Resize the panel to wrap the grid."
      table={
        <DataTable
          caption="Participants by state"
          columns={[
            { key: 'id', header: 'State' },
            { key: 'participants', header: 'Participants' },
          ]}
          rows={STATES}
        />
      }
    >
      <VisxSmallMultiples data={STATES} themed />
    </ChartFrame>
  ),
};

export const LegendTooltip: Story = {
  render: () => (
    <ChartFrame
      title="Week completion"
      caption="Stacked bars with LegendOrdinal and TooltipWithBounds."
      note="API LegendOrdinal, useTooltip, TooltipWithBounds, localPoint. Hover a bar to open the tooltip."
      table={<DataTable caption="Completion" columns={weekColumns} rows={WEEKS} />}
    >
      <VisxLegendTooltip data={WEEKS} themed />
    </ChartFrame>
  ),
};

export const Responsive: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="ParentSize from @visx/responsive. Resize the Storybook panel."
      note="API ParentSize. The SVG uses the measured width and a fixed host height."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <VisxLine data={WEEKS} themed annotate />
    </ChartFrame>
  ),
};

export const Empty: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="No cohort data."
      note="Empty array. Axes still render. Marks and the table are omitted."
    >
      <VisxLine data={[]} />
    </ChartFrame>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No cohort data.')).toBeVisible();
  },
};

export const ReducedMotion: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="visx primitives do not animate. The reduced-motion story is the same plot."
      note="No isAnimationActive equivalent. Motion is not used here. A second animation runtime is out of scope."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <VisxLine data={WEEKS} themed annotate />
    </ChartFrame>
  ),
};
