import {
  Box,
  BoxProps,
  Center,
  chakra,
  HStack,
  Spacer,
  Spinner,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import ReactEChartsCore, { EChartsInstance } from 'echarts-for-react';
import React, { useMemo, useState } from 'react';

import { shortenNumber } from '~/utils/formatTokenAmount';

export interface ChartLine {
  name: string;
  color: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
}

interface HistoricalChartProps extends BoxProps {
  lines: ChartLine[];
  loading?: boolean;
  error?: string;
  formatValue?: (value: number) => string;
  showLegend?: boolean;
  onChartReady?: (chart: EChartsInstance) => void;
  isAreaChart?: boolean;
  height?: number;
  durations?: number[]; // In days
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

export default function HistoricalChart({
  lines,
  loading = false,
  error,
  formatValue = (value: number) => String(value),
  showLegend = false,
  onChartReady,
  isAreaChart,
  height = 360,
  durations,
  defaultDuration,
  showCurrentStats = false,
  currentStats = [],

  ...boxProps
}: HistoricalChartProps): JSX.Element {
  const legendWidth = useBreakpointValue({ base: undefined, md: 100 });
  const [duration, setDuration] = useState(defaultDuration); // In Days

  const series = useMemo(() => {
    return lines.map((line) => {
      let data: [Date, number][] = [];
      if (Array.isArray(durations) && typeof duration === 'number') {
        const lineData = line.data.sort(
          (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
        );

        const startTs =
          lineData.length > 0
            ? lineData[lineData.length - 1].timestamp.valueOf()
            : 0;

        const endTs = startTs > 0 ? startTs - duration * 24 * 3600 * 1000 : 0;
        data = lineData
          .filter((dp) => dp.timestamp.valueOf() > endTs)
          .map(({ timestamp, value }) => [timestamp, value]);
      } else {
        data = line.data.map(({ timestamp, value }) => [timestamp, value]);
      }

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
        // Sort data for perfect connecting animation when changing duration
        data: data.sort((a, b) => b[0].valueOf() - a[0].valueOf()),
      };
    });
  }, [duration, durations, isAreaChart, lines]);

  const option = useMemo(() => {
    return {
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
        formatter: (
          params: Array<{
            seriesName: string;
            marker: string;
            data: [number, number];
          }>,
        ) => {
          if (!Array.isArray(params) || params.length === 0) {
            return;
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
            const value = param.data[1];

            legend += `
              <div style="display: flex; margin-bottom: 2px;">
                <div>${param.marker}</div>
                <div style="flex: 1">${series}</div>
                <strong style="margin-left: 16px">${formatValue(value)}</strong>
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
          hideOverlap: true,
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
          formatter: function (value: number | string) {
            return shortenNumber(Number(value), 2);
          },
        },
      },
      series,
    };
  }, [formatValue, series, showLegend, legendWidth]);

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
