import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { BLUE, CURRENT_WEEK, INK, LINE, PAPER, PEAK_WEEK, YELLOW } from './dataset';
import type { StateRow, WeekRow } from './dataset';

const FIXED = { width: 480, height: 220 } as const;
const MARGIN = { top: 24, right: 16, bottom: 8, left: 8 };

export function RechartsLine({
  data,
  themed = false,
  annotate = false,
  animate = true,
  responsive = false,
}: {
  data: WeekRow[];
  themed?: boolean;
  annotate?: boolean;
  animate?: boolean;
  responsive?: boolean;
}) {
  const size = responsive
    ? { style: { width: '100%', height: '14rem' }, responsive: true as const }
    : FIXED;

  return (
    <div className={responsive ? 'chart-plot-host chart-plot-host-wide' : undefined}>
      <LineChart
        {...size}
        data={data}
        margin={MARGIN}
        accessibilityLayer
        desc="Weekly ask counts for a fictional Academy cohort"
      >
        <CartesianGrid stroke={themed ? LINE : undefined} />
        <XAxis dataKey="id" />
        <YAxis domain={[0, 48]} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="asks"
          name="Asks"
          stroke={themed ? INK : undefined}
          dot={themed ? { r: 4, fill: PAPER, stroke: INK } : undefined}
          isAnimationActive={animate}
        />
        {annotate ? (
          <ReferenceDot
            x={PEAK_WEEK.id}
            y={PEAK_WEEK.asks}
            r={5}
            fill={themed ? YELLOW : undefined}
            stroke={themed ? INK : undefined}
          >
            <Label value="Challenge week" position="top" />
          </ReferenceDot>
        ) : null}
      </LineChart>
    </div>
  );
}

export function RechartsBar({
  data,
  themed = false,
  animate = true,
}: {
  data: WeekRow[];
  themed?: boolean;
  animate?: boolean;
}) {
  return (
    <BarChart {...FIXED} data={data} margin={MARGIN} accessibilityLayer>
      <CartesianGrid stroke={themed ? LINE : undefined} />
      <XAxis dataKey="id" />
      <YAxis domain={[0, 48]} />
      <Tooltip />
      <Bar
        dataKey="asks"
        name="Asks"
        fill={themed ? INK : undefined}
        isAnimationActive={animate}
      />
    </BarChart>
  );
}

export function RechartsArea({
  data,
  themed = false,
  animate = true,
}: {
  data: WeekRow[];
  themed?: boolean;
  animate?: boolean;
}) {
  return (
    <AreaChart {...FIXED} data={data} margin={MARGIN} accessibilityLayer>
      <CartesianGrid stroke={themed ? LINE : undefined} />
      <XAxis dataKey="id" />
      <YAxis domain={[0, 48]} />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="asks"
        name="Asks"
        stroke={themed ? INK : undefined}
        fill={themed ? LINE : undefined}
        isAnimationActive={animate}
      />
    </AreaChart>
  );
}

export function RechartsProgress({
  themed = false,
  animate = true,
}: {
  themed?: boolean;
  animate?: boolean;
}) {
  const row = {
    name: CURRENT_WEEK.id,
    completion: CURRENT_WEEK.completion,
    remaining: CURRENT_WEEK.remaining,
  };

  return (
    <BarChart
      {...FIXED}
      layout="vertical"
      data={[row]}
      margin={{ top: 16, right: 24, bottom: 8, left: 24 }}
      accessibilityLayer
    >
      <XAxis type="number" domain={[0, 100]} unit="%" />
      <YAxis type="category" dataKey="name" width={48} />
      <Tooltip />
      <Bar
        dataKey="completion"
        name="Finished %"
        stackId="progress"
        fill={themed ? YELLOW : undefined}
        isAnimationActive={animate}
      />
      <Bar
        dataKey="remaining"
        name="Remaining %"
        stackId="progress"
        fill={themed ? LINE : undefined}
        isAnimationActive={animate}
      />
    </BarChart>
  );
}

export function RechartsLegendTooltip({
  data,
  themed = false,
  animate = true,
}: {
  data: WeekRow[];
  themed?: boolean;
  animate?: boolean;
}) {
  return (
    <BarChart {...FIXED} data={data} margin={MARGIN} accessibilityLayer>
      <CartesianGrid stroke={themed ? LINE : undefined} />
      <XAxis dataKey="id" />
      <YAxis domain={[0, 100]} unit="%" />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="completion"
        name="Finished %"
        stackId="week"
        fill={themed ? YELLOW : undefined}
        isAnimationActive={animate}
      />
      <Bar
        dataKey="remaining"
        name="Remaining %"
        stackId="week"
        fill={themed ? INK : undefined}
        isAnimationActive={animate}
      />
    </BarChart>
  );
}

export function RechartsSmallMultiples({
  data,
  themed = false,
  animate = true,
}: {
  data: StateRow[];
  themed?: boolean;
  animate?: boolean;
}) {
  return (
    <div className="chart-multiples">
      {data.map((state) => (
        <div className="chart-multiple" key={state.id}>
          <BarChart width={88} height={96} data={[state]} accessibilityLayer>
            <YAxis hide domain={[0, 10]} />
            <XAxis dataKey="id" tick={{ fontSize: 11 }} />
            <Bar
              dataKey="participants"
              name="Participants"
              fill={themed ? BLUE : undefined}
              isAnimationActive={animate}
            />
          </BarChart>
          <span>{state.participants}</span>
        </div>
      ))}
    </div>
  );
}
