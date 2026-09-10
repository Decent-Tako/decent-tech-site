import { Annotation, CircleSubject, Connector, Label } from '@visx/annotation';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GlyphDot } from '@visx/glyph';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { LegendOrdinal } from '@visx/legend';
import { PatternLines } from '@visx/pattern';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { AreaClosed, Bar, LinePath } from '@visx/shape';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import type { ReactNode } from 'react';
import { useId } from 'react';

import { BLUE, CURRENT_WEEK, INK, LINE, PAPER, PEAK_WEEK, YELLOW } from './dataset';
import type { StateRow, WeekRow } from './dataset';

const MARGIN = { top: 36, right: 16, bottom: 36, left: 40 };
const ASK_DOMAIN: [number, number] = [0, 48];
const COMPLETE_DOMAIN: [number, number] = [0, 100];

const FALLBACK = { width: 480, height: 220 };

function PlotShell({
  title,
  children,
}: {
  title: string;
  children: (inner: { width: number; height: number }) => ReactNode;
}) {
  return (
    <div className="chart-plot-host">
      <ParentSize initialSize={FALLBACK}>
        {({ width, height }) => {
          const plotWidth = width < 32 ? FALLBACK.width : width;
          const plotHeight = height < 32 ? FALLBACK.height : height;
          const innerWidth = Math.max(plotWidth - MARGIN.left - MARGIN.right, 0);
          const innerHeight = Math.max(plotHeight - MARGIN.top - MARGIN.bottom, 0);

          return (
            <svg width={plotWidth} height={plotHeight} role="img">
              <title>{title}</title>
              <Group left={MARGIN.left} top={MARGIN.top}>
                {children({ width: innerWidth, height: innerHeight })}
              </Group>
            </svg>
          );
        }}
      </ParentSize>
    </div>
  );
}

function tickProps(themed: boolean) {
  return {
    fill: themed ? INK : '#000000',
    fontSize: 11,
    fontFamily: 'system-ui, sans-serif',
  };
}

function visxFill(themed: boolean, accent: 'ink' | 'line' | 'blue' | 'yellow' = 'ink') {
  if (!themed) {
    return '#000000';
  }

  if (accent === 'line') {
    return LINE;
  }
  if (accent === 'blue') {
    return BLUE;
  }
  if (accent === 'yellow') {
    return YELLOW;
  }
  return INK;
}

export function VisxLine({
  data,
  themed = false,
  annotate = false,
}: {
  data: WeekRow[];
  themed?: boolean;
  annotate?: boolean;
}) {
  return (
    <PlotShell title="Weekly asks">
      {({ width, height }) => {
        const x = scaleBand({
          domain: data.map((row) => row.id),
          range: [0, width],
          padding: 0.4,
        });
        const y = scaleLinear({ domain: ASK_DOMAIN, range: [height, 0], nice: true });
        const peak = data.find((row) => row.id === PEAK_WEEK.id);
        const peakX = peak ? (x(peak.id) ?? 0) + x.bandwidth() / 2 : 0;
        const peakY = peak ? y(peak.asks) : 0;

        return (
          <>
            <GridRows scale={y} width={width} stroke={themed ? LINE : '#cccccc'} numTicks={4} />
            {data.length > 0 ? (
              <>
                <AreaClosed
                  data={data}
                  x={(row) => (x(row.id) ?? 0) + x.bandwidth() / 2}
                  y={(row) => y(row.asks)}
                  yScale={y}
                  fill={themed ? LINE : '#000000'}
                  opacity={0.35}
                />
                <LinePath
                  data={data}
                  x={(row) => (x(row.id) ?? 0) + x.bandwidth() / 2}
                  y={(row) => y(row.asks)}
                  stroke={visxFill(themed)}
                  strokeWidth={2}
                />
                {data.map((row) => (
                  <GlyphDot
                    key={row.id}
                    cx={(x(row.id) ?? 0) + x.bandwidth() / 2}
                    cy={y(row.asks)}
                    r={4}
                    fill={themed ? PAPER : '#FFFFFF'}
                    stroke={visxFill(themed)}
                    strokeWidth={2}
                  />
                ))}
                {annotate && peak ? (
                  <Annotation x={peakX} y={peakY} dx={-84} dy={-18}>
                    <Connector stroke={visxFill(themed)} type="line" />
                    <CircleSubject
                      stroke={visxFill(themed)}
                      fill={themed ? YELLOW : '#FFFFFF'}
                      r={5}
                    />
                    <Label
                      title="Challenge week"
                      subtitle={`${peak.asks} example asks`}
                      showAnchorLine={false}
                      backgroundFill={themed ? PAPER : '#FFFFFF'}
                      backgroundPadding={6}
                      fontColor={visxFill(themed)}
                      titleFontWeight={700}
                    />
                  </Annotation>
                ) : null}
              </>
            ) : null}
            <AxisLeft
              scale={y}
              stroke={visxFill(themed)}
              tickStroke={visxFill(themed)}
              numTicks={4}
              tickLabelProps={tickProps(themed)}
            />
            <AxisBottom
              top={height}
              scale={x}
              stroke={visxFill(themed)}
              tickStroke={visxFill(themed)}
              tickLabelProps={tickProps(themed)}
            />
          </>
        );
      }}
    </PlotShell>
  );
}

export function VisxBar({
  data,
  themed = false,
}: {
  data: WeekRow[];
  themed?: boolean;
}) {
  const hatchId = useId().replaceAll(':', '');

  return (
    <PlotShell title="Weekly asks">
      {({ width, height }) => {
        const x = scaleBand({
          domain: data.map((row) => row.id),
          range: [0, width],
          padding: 0.28,
        });
        const y = scaleLinear({ domain: ASK_DOMAIN, range: [height, 0] });

        return (
          <>
            {themed ? (
              <PatternLines
                id={hatchId}
                height={6}
                width={6}
                stroke={INK}
                strokeWidth={1}
                orientation={['diagonal']}
              />
            ) : null}
            <GridRows scale={y} width={width} stroke={themed ? LINE : '#cccccc'} numTicks={4} />
            {data.map((row) => {
              const barHeight = Math.max(height - y(row.asks), row.asks === 0 ? 0 : 2);
              return (
                <Group key={row.id}>
                  <Bar
                    x={x(row.id) ?? 0}
                    y={y(row.asks)}
                    width={x.bandwidth()}
                    height={barHeight}
                    fill={visxFill(themed)}
                  />
                  {themed ? (
                    <Bar
                      x={x(row.id) ?? 0}
                      y={y(row.asks)}
                      width={x.bandwidth()}
                      height={barHeight}
                      fill={`url(#${hatchId})`}
                      pointerEvents="none"
                    />
                  ) : null}
                </Group>
              );
            })}
            <AxisLeft
              scale={y}
              stroke={visxFill(themed)}
              tickStroke={visxFill(themed)}
              numTicks={4}
              tickLabelProps={tickProps(themed)}
            />
            <AxisBottom
              top={height}
              scale={x}
              stroke={visxFill(themed)}
              tickStroke={visxFill(themed)}
              tickLabelProps={tickProps(themed)}
            />
          </>
        );
      }}
    </PlotShell>
  );
}

export function VisxArea({
  data,
  themed = false,
}: {
  data: WeekRow[];
  themed?: boolean;
}) {
  return (
    <PlotShell title="Weekly asks">
      {({ width, height }) => {
        const x = scaleBand({
          domain: data.map((row) => row.id),
          range: [0, width],
          padding: 0.4,
        });
        const y = scaleLinear({ domain: ASK_DOMAIN, range: [height, 0], nice: true });

        return (
          <>
            <GridRows scale={y} width={width} stroke={themed ? LINE : '#cccccc'} numTicks={4} />
            {data.length > 0 ? (
              <AreaClosed
                data={data}
                x={(row) => (x(row.id) ?? 0) + x.bandwidth() / 2}
                y={(row) => y(row.asks)}
                yScale={y}
                fill={visxFill(themed, themed ? 'line' : 'ink')}
                stroke={visxFill(themed)}
                strokeWidth={2}
              />
            ) : null}
            <AxisLeft
              scale={y}
              stroke={visxFill(themed)}
              tickStroke={visxFill(themed)}
              numTicks={4}
              tickLabelProps={tickProps(themed)}
            />
            <AxisBottom
              top={height}
              scale={x}
              stroke={visxFill(themed)}
              tickStroke={visxFill(themed)}
              tickLabelProps={tickProps(themed)}
            />
          </>
        );
      }}
    </PlotShell>
  );
}

export function VisxProgress({ themed = false }: { themed?: boolean }) {
  const hatchId = useId().replaceAll(':', '');

  return (
    <PlotShell title="Week 0 completion">
      {({ width, height }) => {
        const x = scaleLinear({ domain: COMPLETE_DOMAIN, range: [0, width] });
        const y = scaleBand({ domain: [CURRENT_WEEK.id], range: [0, height], padding: 0.4 });
        const barHeight = y.bandwidth();

        return (
          <>
            {themed ? (
              <PatternLines
                id={hatchId}
                height={7}
                width={7}
                stroke={INK}
                strokeWidth={1.2}
                orientation={['diagonal']}
              />
            ) : null}
            <Bar
              x={0}
              y={y(CURRENT_WEEK.id) ?? 0}
              width={width}
              height={barHeight}
              fill={themed ? LINE : '#e0e0e0'}
            />
            <Bar
              x={0}
              y={y(CURRENT_WEEK.id) ?? 0}
              width={x(CURRENT_WEEK.completion)}
              height={barHeight}
              fill={themed ? YELLOW : '#000000'}
            />
            {themed ? (
              <Bar
                x={0}
                y={y(CURRENT_WEEK.id) ?? 0}
                width={x(CURRENT_WEEK.completion)}
                height={barHeight}
                fill={`url(#${hatchId})`}
                pointerEvents="none"
              />
            ) : null}
            <AxisBottom
              top={height}
              scale={x}
              stroke={visxFill(themed)}
              tickStroke={visxFill(themed)}
              tickLabelProps={tickProps(themed)}
              numTicks={5}
            />
            <AxisLeft
              scale={y}
              stroke={visxFill(themed)}
              tickStroke={visxFill(themed)}
              tickLabelProps={tickProps(themed)}
            />
          </>
        );
      }}
    </PlotShell>
  );
}

export function VisxLegendTooltip({
  data,
  themed = false,
}: {
  data: WeekRow[];
  themed?: boolean;
}) {
  const hatchId = useId().replaceAll(':', '');
  const tooltip = useTooltip<WeekRow>();
  const legendScale = scaleOrdinal({
    domain: ['Finished %', 'Remaining %'],
    range: themed ? [YELLOW, INK] : ['#000000', '#888888'],
  });

  return (
    <>
      <div className="chart-plot-host">
      <ParentSize initialSize={FALLBACK}>
        {({ width, height }) => {
          const plotWidth = width < 32 ? FALLBACK.width : width;
          const plotHeight = height < 32 ? FALLBACK.height : height;
          const innerWidth = Math.max(plotWidth - MARGIN.left - MARGIN.right, 0);
          const innerHeight = Math.max(plotHeight - MARGIN.top - MARGIN.bottom, 0);
          const x = scaleBand({
            domain: data.map((row) => row.id),
            range: [0, innerWidth],
            padding: 0.28,
          });
          const y = scaleLinear({ domain: COMPLETE_DOMAIN, range: [innerHeight, 0] });

          return (
            <>
              <svg width={plotWidth} height={plotHeight} role="img">
                <title>Week completion</title>
                {themed ? (
                  <PatternLines
                    id={hatchId}
                    height={6}
                    width={6}
                    stroke={PAPER}
                    strokeWidth={1}
                    orientation={['diagonal']}
                  />
                ) : null}
                <Group left={MARGIN.left} top={MARGIN.top}>
                  <GridRows
                    scale={y}
                    width={innerWidth}
                    stroke={themed ? LINE : '#cccccc'}
                    numTicks={5}
                  />
                  {data.map((row) => {
                    const finishedHeight = innerHeight - y(row.completion);
                    const stacked = row.completion + row.remaining;
                    const remainingHeight = y(row.completion) - y(stacked);
                    return (
                      <Group
                        key={row.id}
                        onMouseMove={(event) => {
                          const point = localPoint(event);
                          tooltip.showTooltip({
                            tooltipData: row,
                            tooltipLeft: point?.x,
                            tooltipTop: point?.y,
                          });
                        }}
                        onMouseLeave={() => tooltip.hideTooltip()}
                      >
                        <Bar
                          x={x(row.id) ?? 0}
                          y={y(row.completion)}
                          width={x.bandwidth()}
                          height={finishedHeight}
                          fill={themed ? YELLOW : '#000000'}
                        />
                        <Bar
                          x={x(row.id) ?? 0}
                          y={y(stacked)}
                          width={x.bandwidth()}
                          height={remainingHeight}
                          fill={themed ? INK : '#888888'}
                        />
                        {themed ? (
                          <Bar
                            x={x(row.id) ?? 0}
                            y={y(stacked)}
                            width={x.bandwidth()}
                            height={remainingHeight}
                            fill={`url(#${hatchId})`}
                            pointerEvents="none"
                          />
                        ) : null}
                      </Group>
                    );
                  })}
                  <AxisLeft
                    scale={y}
                    stroke={visxFill(themed)}
                    tickStroke={visxFill(themed)}
                    numTicks={5}
                    tickLabelProps={tickProps(themed)}
                  />
                  <AxisBottom
                    top={innerHeight}
                    scale={x}
                    stroke={visxFill(themed)}
                    tickStroke={visxFill(themed)}
                    tickLabelProps={tickProps(themed)}
                  />
                </Group>
              </svg>
              {tooltip.tooltipOpen && tooltip.tooltipData ? (
                <TooltipWithBounds
                  className="chart-tooltip"
                  top={tooltip.tooltipTop}
                  left={tooltip.tooltipLeft}
                  style={{ ...defaultStyles }}
                >
                  {tooltip.tooltipData.id}: {tooltip.tooltipData.completion}% finished
                </TooltipWithBounds>
              ) : null}
            </>
          );
        }}
      </ParentSize>
      </div>
      <div className="chart-legend">
        <LegendOrdinal scale={legendScale} direction="row" shape="rect" />
      </div>
    </>
  );
}

export function VisxSmallMultiples({
  data,
  themed = false,
}: {
  data: StateRow[];
  themed?: boolean;
}) {
  const y = scaleLinear({ domain: [0, 10], range: [72, 0] });

  return (
    <div className="chart-multiples">
      {data.map((state) => (
        <div className="chart-multiple" key={state.id}>
          <svg width={88} height={96} role="img">
            <title>{`${state.name} participants`}</title>
            <Bar
              x={28}
              y={y(state.participants)}
              width={32}
              height={72 - y(state.participants)}
              fill={themed ? BLUE : '#000000'}
            />
            <text x={44} y={90} textAnchor="middle" fontSize={11} fill={visxFill(themed)}>
              {state.id}
            </text>
          </svg>
          <span>{state.participants}</span>
        </div>
      ))}
    </div>
  );
}
