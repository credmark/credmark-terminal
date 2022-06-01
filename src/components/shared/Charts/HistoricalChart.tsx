import {
  Box,
  BoxProps,
  Button,
  Center,
  chakra,
  Grid,
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

import { Aggregator, ChartLine } from '~/types/chart';
import { aggregateData, filterDataByDuration } from '~/utils/chart';
import { shortenNumber } from '~/utils/formatTokenAmount';

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
  defaultAggregator?: Aggregator;
  defaultDuration?: number;
  showCurrentStats?: boolean;
  currentStats?: Array<{ label: React.ReactNode; value: string }>;

  isFullScreen?: boolean;
}

const ChartOverlay = chakra(Center, {
  baseStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pl: 10,
    pr: 8,
    pb: 16,
  },
});

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

  isFullScreen = false,
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
              fontWeight: 'bold',
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        min: function (value: { min: number }) {
          if (value.min < 0) return value.min * 1.25;
          return value.min * 0.75;
        },
        max: function (value: { max: number }) {
          if (value.max < 0) return value.max * 0.75;
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
    <Grid
      gridTemplateRows={`${
        Array.isArray(durations) || showCurrentStats ? 'max-content ' : ''
      }${isFullScreen ? '1fr' : height + 'px'}`}
      overflow="hidden"
      {...boxProps}
    >
      {(Array.isArray(durations) || showCurrentStats) && (
        <HStack align="center" p="2">
          {showCurrentStats &&
            currentStats.map(({ label, value }, index) => (
              <Box key={index} textAlign="left" px="2">
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
            height: isFullScreen ? '100%' : height + 'px',
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
            <Text
              as="pre"
              bg="red.50"
              color="red.600"
              p="4"
              rounded="md"
              fontSize="xs"
              w="100%"
              whiteSpace="break-spaces"
            >
              {error}
            </Text>
          </ChartOverlay>
        )}
      </Box>
    </Grid>
  );
}
