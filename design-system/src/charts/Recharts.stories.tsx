import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { DataTable, ChartFrame } from './Frame';
import {
  RechartsArea,
  RechartsBar,
  RechartsLegendTooltip,
  RechartsLine,
  RechartsProgress,
  RechartsSmallMultiples,
} from './rechartsCharts';
import { CURRENT_WEEK, DATASET_NOTE, STATES, WEEKS } from './dataset';
import { assertFaceNotFallback } from '../brand/fontFallback';

const meta = {
  title: 'Charts and data/Recharts',
  parameters: {
    docs: {
      description: {
        component:
          'Package `recharts` 3.10.1. Licence MIT. Docs https://recharts.org . Source https://github.com/recharts/recharts . React `^16.8` through `^19`. `accessibilityLayer` default true. Prior use: installed in the motion-library manifest. Issue 176 rejected it for that specimen. Academy need: later graph components.',
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
      caption="Themed Recharts line. Peak week uses ReferenceDot. Tooltip is the package default."
      note={`${DATASET_NOTE} Light theme: stroke uses #212121. The peak mark uses #DEF54F.`}
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <RechartsLine data={WEEKS} themed annotate />
    </ChartFrame>
  ),
  play: async ({ canvas }) => {
    // Axis and legend labels render in Brand Sans. A fallback would misreport the brand.
    await assertFaceNotFallback('Brand Sans', 400);
    await assertFaceNotFallback('Brand Sans', 700);

    await expect(canvas.getByText('Weekly asks')).toBeVisible();
    await expect(canvas.getByRole('cell', { name: 'W5' })).toBeVisible();
    await expect(canvas.getByRole('application')).toBeVisible();
  },
};

export const Line: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="Upstream LineChart and Line with package default colours."
      note="Package `recharts` 3.10.1. API LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <RechartsLine data={WEEKS} />
    </ChartFrame>
  ),
};

export const Bar: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="Upstream BarChart and Bar with package default colours."
      note="Package `recharts` 3.10.1. API BarChart, Bar, Tooltip."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <RechartsBar data={WEEKS} />
    </ChartFrame>
  ),
};

export const Area: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="Upstream AreaChart and Area with package default colours."
      note="Package `recharts` 3.10.1. API AreaChart, Area, Tooltip."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <RechartsArea data={WEEKS} />
    </ChartFrame>
  ),
};

export const Progress: Story = {
  render: () => (
    <ChartFrame
      title="Week 0 completion"
      caption="Stacked vertical Bar stands in for progress. Recharts has no Progress component."
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
      <RechartsProgress themed />
    </ChartFrame>
  ),
};

export const SmallMultiples: Story = {
  render: () => (
    <ChartFrame
      title="State cohort mix"
      caption="One small BarChart per state. Same participants field as visx."
      note="Package `recharts` 3.10.1. API BarChart, Bar. Themed fill uses #0035B1."
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
      <RechartsSmallMultiples data={STATES} themed />
    </ChartFrame>
  ),
};

export const LegendTooltip: Story = {
  render: () => (
    <ChartFrame
      title="Week completion"
      caption="Stacked Bar with package Legend and Tooltip."
      note="API Legend, Tooltip, Bar stackId. Finished uses #DEF54F. Remaining uses #212121."
      table={<DataTable caption="Completion" columns={weekColumns} rows={WEEKS} />}
    >
      <RechartsLegendTooltip data={WEEKS} themed />
    </ChartFrame>
  ),
};

export const Responsive: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="Recharts 3 `responsive` prop. Resize the Storybook panel."
      note="API LineChart responsive. This is the current 3.x sizing path. ResponsiveContainer remains available."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <RechartsLine data={WEEKS} themed responsive />
    </ChartFrame>
  ),
};

export const Empty: Story = {
  render: () => (
    <ChartFrame
      title="Weekly asks"
      caption="No cohort data."
      note="Empty array passed to LineChart. Axes still render. The table is omitted."
    >
      <RechartsLine data={[]} />
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
      caption="isAnimationActive is false on Line."
      note="Recharts animates by default. Pass isAnimationActive={false} when the user asks for reduced motion."
      table={<DataTable caption="Ask counts" columns={weekColumns} rows={WEEKS} />}
    >
      <RechartsLine data={WEEKS} themed annotate animate={false} />
    </ChartFrame>
  ),
};
