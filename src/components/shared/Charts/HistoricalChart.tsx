import {
  Box,
  BoxProps,
  Button,
  Center,
  chakra,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Spacer,
  Spinner,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { EChartsOption } from 'echarts';
import ReactEChartsCore, { EChartsInstance } from 'echarts-for-react';
import React, { useCallback, useMemo, useState } from 'react';
import { MdSettings } from 'react-icons/md';

import { shortenNumber } from '~/utils/formatTokenAmount';

export interface ChartLine {
  name: string;
  color: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
}

type Aggregator = 'min' | 'max' | 'avg' | 'sum';

interface HistoricalChartProps extends BoxProps {
  lines: ChartLine[];
  loading?: boolean;
  error?: string;
  formatValue?: (value: number) => string;
  formatYLabel?: (value: number) => string;
  showLegend?: boolean;
  onChartReady?: (chart: EChartsInstance) => void;
  isAreaChart?: boolean;
  height?: number;
  durations?: number[]; // In days
  aggregate?: boolean; // In days
  defaultAggregator?: Aggregator; // In days
  defaultDuration?: number;
  showCurrentStats?: boolean;
  currentStats?: Array<{ label: React.ReactNode; value: string }>;
}

const ChartOverlay = chakra(Center, {
  baseStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    p: 8,
  },
});

function filterDataByDuration(data: ChartLine['data'], durationInDays: number) {
  const sortedData = [...data].sort(
    (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
  );

  const duration = durationInDays * 24 * 3600 * 1000;
  const startTs =
    sortedData.length > 0
      ? sortedData[sortedData.length - 1].timestamp.valueOf()
      : 0;

  const endTs = startTs > 0 ? startTs - duration : 0;
  return sortedData.filter((dp) => dp.timestamp.valueOf() > endTs);
}

function aggregateData(
  data: ChartLine['data'],
  maxTs: number,
  intervalInDays: number,
  aggregator: Aggregator,
) {
  const interval = intervalInDays * 24 * 3600 * 1000;
  const sortedData = [...data].sort(
    (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
  );

  const rangedData: { timestamp: Date; data: ChartLine['data'] }[] = [];
  for (const datum of sortedData) {
    const i = Math.floor((maxTs - datum.timestamp.valueOf()) / interval);
    if (!rangedData[i]) {
      rangedData[i] = {
        timestamp: new Date(maxTs - interval * i),
        data: [],
      };
    }

    rangedData[i].data.push(datum);
  }

  return rangedData
    .map(({ timestamp, data }) => {
      let value = 0;
      switch (aggregator) {
        case 'max':
          value = Math.max(...data.map((datum) => datum.value));
          break;
        case 'min':
          value = Math.min(...data.map((datum) => datum.value));
          break;
        case 'sum':
          value = data.reduce((sum, datum) => sum + datum.value, 0);
          break;
        case 'avg':
          value =
            data.reduce((sum, datum) => sum + datum.value, 0) / data.length;
          break;
      }

      return {
        timestamp,
        value,
      };
    })
    .filter((val) => !!val);
}

export default function HistoricalChart({
  lines,
  loading = false,
  error,
  formatValue = (value: number) => String(value),
  formatYLabel = (value: number | string) => shortenNumber(Number(value), 2),
  showLegend = false,
  onChartReady,
  isAreaChart,
  height = 360,

  durations,
  defaultDuration,

  aggregate,
  defaultAggregator = 'sum',

  showCurrentStats = false,
  currentStats = [],

  ...boxProps
}: HistoricalChartProps): JSX.Element {
  const legendWidth = useBreakpointValue({ base: undefined, md: 100 });
  const [duration, setDuration] = useState(defaultDuration); // In Days
  const [aggregationInterval, setAggregationInterval] = useState(1); // In Days
  const [aggregator, setAggregator] = useState<Aggregator>(defaultAggregator); // In Days

  const computeLineData = useCallback(
    (line: ChartLine, maxTs: number): [Date, number][] => {
      let data: ChartLine['data'];
      if (Array.isArray(durations) && typeof duration === 'number') {
        data = filterDataByDuration(line.data, duration);
      } else {
        data = line.data;
      }

      if (aggregate) {
        data = aggregateData(data, maxTs, aggregationInterval, aggregator);
      }

      return (
        data
          .map<[Date, number]>(({ timestamp, value }) => [timestamp, value])
          // Sort data for perfect connecting animation when changing duration
          .sort((a, b) => b[0].valueOf() - a[0].valueOf())
      );
    },
    [aggregate, aggregationInterval, aggregator, duration, durations],
  );

  const series = useMemo(() => {
    const maxTs = Math.max(
      ...lines.map((line) =>
        Math.max(...line.data.map((datum) => datum.timestamp.valueOf())),
      ),
    );

    const series: EChartsOption['series'] = lines.map((line) => {
      return {
        name: line.name,
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        showSymbol: false,
        areaStyle: isAreaChart
          ? {
              opacity: 0.325,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: line.color,
                  },
                  {
                    offset: 1,
                    color: 'white',
                  },
                ],
              },
            }
          : undefined,
        label: {
          fontWeight: 800,
        },
        lineStyle: {
          color: line.color,
        },
        itemStyle: {
          color: line.color,
        },

        data: computeLineData(line, maxTs),
      };
    });

    return series;
  }, [computeLineData, isAreaChart, lines]);

  const option = useMemo(() => {
    const isMonthChanging = (() => {
      let month: number | undefined = undefined;
      for (const serie of series) {
        for (const datum of serie.data as [Date, number][]) {
          const dMonth = datum[0].getMonth();
          if (month === undefined) {
            month = dMonth;
          } else if (month !== dMonth) {
            return true;
          }
        }
      }

      return false;
    })();

    const option: EChartsOption = {
      legend: {
        show: showLegend,
        width: legendWidth ? series.length * legendWidth : undefined,
      },
      grid: {
        top: showLegend ? 64 : 16,
        bottom: 48,
        left: 48,
        right: 32,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (params) => {
          if (
            !Array.isArray(params) ||
            params.length === 0 ||
            !Array.isArray(params[0].data) ||
            params[0].data.length === 0
          ) {
            return '';
          }

          const date = new Date(params[0].data[0]).toLocaleDateString(
            undefined,
            {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            },
          );

          let legend = '';

          for (const param of params) {
            const series = param.seriesName;
            if (!Array.isArray(param.data)) continue;

            const value = param.data[1];

            legend += `
              <div style="display: flex; margin-bottom: 2px;">
                <div>${param.marker}</div>
                <div style="flex: 1">${series}</div>
                <strong style="margin-left: 16px">${formatValue(
                  Number(value),
                )}</strong>
              </div>
              `;
          }

          return `
            <div style="line-height: 1">
              <div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
                ${date}
              </div>
              ${legend}
            </div>`;
        },
      },
      title: {
        left: 'center',
      },
      xAxis: {
        type: 'time',
        axisLine: {
          show: true,
        },
        axisPointer: {
          label: {
            show: false,
          },
          lineStyle: {
            color: '#E53E3E',
          },
        },
        axisTick: {
          show: true,
        },
        minorTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          hideOverlap: true,
          // Overriding default behavior when in certain scenarios,
          // only day is visible with no month information
          formatter: isMonthChanging
            ? undefined
            : {
                year: '{yyyy}',
                month: '{bold|{MMM}}',
                day: '{d} {MMM}',
                hour: '{HH}:{mm}',
                minute: '{HH}:{mm}',
                second: '{HH}:{mm}:{ss}',
                millisecond: '{hh}:{mm}:{ss} {SSS}',
                // none: '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {SSS}',
              },
          // rotate: 22.5,
          rich: {
            bold: {
              // fontStyle: 'italic',
              fontWeight: 'bold',
              // fontSize: 10,
              // // opacity: 0.8,
              // color: '#3B0065',
              // height: 8,
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        min: function (value: { min: number }) {
          return value.min * 0.75;
        },
        max: function (value: { max: number }) {
          return value.max * 1.25;
        },
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisPointer: {
          show: false,
          label: {
            show: false,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
        },
        axisLabel: {
          show: true,
          showMinLabel: false,
          showMaxLabel: false,
          formatter: formatYLabel,
        },
      },
      series,
    };

    return option;
  }, [showLegend, legendWidth, series, formatYLabel, formatValue]);

  const noData =
    lines.reduce((dataLength, line) => dataLength + line.data.length, 0) === 0;

  return (
    <Box {...boxProps}>
      {(Array.isArray(durations) || showCurrentStats) && (
        <HStack align="center" p="2">
          {showCurrentStats &&
            currentStats.map(({ label, value }, index) => (
              <Box key={index} textAlign="left">
                <Text fontSize="sm">{label}</Text>
                <Text fontSize="3xl" fontWeight="medium">
                  {value}
                </Text>
              </Box>
            ))}
          <Spacer />
          {loading && !noData && <Spinner color="purple.500" />}
          {(durations ?? []).map((days) => (
            <Box
              key={days}
              p="2"
              fontWeight="bold"
              color={duration === days ? 'gray.900' : 'gray.300'}
              cursor="pointer"
              onClick={() => setDuration(days)}
              _hover={
                duration === days
                  ? {}
                  : {
                      color: 'gray.700',
                    }
              }
            >
              {days}D
            </Box>
          ))}
          {aggregate && (
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                colorScheme="gray"
                size="sm"
                leftIcon={<Icon as={MdSettings} />}
              >
                Agg
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuOptionGroup
                  title="Interval"
                  type="radio"
                  value={String(aggregationInterval)}
                  onChange={(value) => setAggregationInterval(Number(value))}
                >
                  <MenuItemOption value="1">Daily</MenuItemOption>
                  <MenuItemOption value="7">Weekly</MenuItemOption>
                  <MenuItemOption value="30">Monthly</MenuItemOption>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup
                  title="Aggregator"
                  type="radio"
                  value={aggregator}
                  onChange={(value) => setAggregator(value as Aggregator)}
                >
                  <MenuItemOption value="sum">Sum</MenuItemOption>
                  <MenuItemOption value="avg">Average</MenuItemOption>
                  <MenuItemOption value="min">Minimum</MenuItemOption>
                  <MenuItemOption value="max">Maximum</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          )}
        </HStack>
      )}
      <Box position="relative">
        <ReactEChartsCore
          option={option}
          lazyUpdate={true}
          notMerge={true}
          style={{
            height: height + 'px',
          }}
          onChartReady={onChartReady}
        />
        {loading && noData && (
          <ChartOverlay>
            <Spinner color="purple.500" />
          </ChartOverlay>
        )}
        {error && (
          <ChartOverlay>
            <Text bg="red.50" color="red.600" p="4" rounded="md" fontSize="sm">
              {error}
            </Text>
          </ChartOverlay>
        )}
      </Box>
    </Box>
  );
}
