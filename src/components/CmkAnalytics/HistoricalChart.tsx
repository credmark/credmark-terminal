import {
  Box,
  Center,
  Flex,
  Spinner,
  useBreakpointValue,
  Text,
  HStack,
} from '@chakra-ui/react';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo, useState } from 'react';

export interface Line {
  name: string;
  color?: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
}

interface HistoricalChartProps {
  title?: string;
  line: Line;
  loading: boolean;
  formatValue?: (value: any) => string;
  showLegend?: boolean;
}

export default function HistoricalChart({
  title,
  line,
  loading,
  formatValue,
  showLegend = false,
}: HistoricalChartProps): JSX.Element {
  const [duration, setDuration] = useState(30); // In Days
  const legendWidth = useBreakpointValue({ base: undefined, md: 100 });

  const series = useMemo(() => {
    return (line ? [line] : []).map((line) => {
      const startTs =
        line.data.length > 0
          ? line.data[line.data.length - 1].timestamp.valueOf()
          : 0;
      const endTs = startTs > 0 ? startTs - duration * 24 * 3600 * 1000 : 0;

      return {
        name: line.name,
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        showSymbol: false,
        label: {
          fontWeight: 800,
        },
        lineStyle: {
          color: line.color,
        },
        itemStyle: {
          color: line.color,
        },
        data: line.data
          .filter((dp) => dp.timestamp.valueOf() > endTs)
          .map(({ timestamp, value }) => [timestamp, value]),
      };
    });
  }, [line, duration]);

  const currentData = useMemo(() => {
    if (!line?.data?.length) {
      return undefined;
    }

    const data = [...line.data].sort(
      (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
    );

    return data[data.length - 1];
  }, [line]);

  const option = useMemo(() => {
    return {
      legend: {
        show: showLegend,
        width: legendWidth ? series.length * legendWidth : undefined,
      },
      grid: {
        top: showLegend ? 96 : 32,
        bottom: 48,
        left: 48,
        right: 32,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (params: any[]) => {
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
                  <strong style="margin-left: 16px">${
                    formatValue ? formatValue(value) : value
                  }</strong>
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
        boundaryGap: false,
        min: function (value: any) {
          return value.min * 0.75;
        },
        max: function (value: any) {
          return value.max * 1.25;
        },
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
            const num = Number(value);
            const fixedFigs = 2;
            if (num >= 1e9) {
              return `${Number((num / 1e9).toFixed(fixedFigs))}B`;
            } else if (num >= 1e6) {
              return `${Number((num / 1e6).toFixed(fixedFigs))}M`;
            } else if (num >= 1e3) {
              return `${Number((num / 1e3).toFixed(fixedFigs))}K`;
            } else if (num > 10) {
              return Number(num.toFixed(fixedFigs));
            } else {
              return Number(num.toFixed(fixedFigs));
            }
          },
        },
      },
      series,
    };
  }, [formatValue, series, showLegend, legendWidth]);

  return (
    <Box>
      <HStack mx="8" justify="space-between">
        {title && (
          <Text
            textAlign="center"
            fontSize="xl"
            bg="purple.500"
            color="white"
            px="4"
            rounded="md"
          >
            {title}
          </Text>
        )}
        {currentData && (
          <Text
            textAlign="center"
            fontSize="2xl"
            borderColor="purple.500"
            border="1px"
            color="purple.500"
            px="4"
            rounded="md"
          >
            {formatValue ? formatValue(currentData.value) : currentData.value}
          </Text>
        )}
      </HStack>

      <Box position="relative">
        <ReactEChartsCore
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{
            height: '360px',
          }}
        />
        {!line && (
          <Center position="absolute" top="0" left="0" right="0" bottom="0">
            <Spinner color="purple.500" />
          </Center>
        )}
      </Box>
      <Flex pl="20" align="center">
        {[30, 60, 90].map((days) => (
          <Box
            key={days}
            p="2"
            mx="2"
            fontWeight="bold"
            color={duration === days ? 'gray.900' : 'gray.300'}
            cursor="pointer"
            borderBottom={duration === days ? '2px' : '0'}
            borderColor="gray.700"
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
        {!!line && loading && <Spinner color="purple.500" />}
      </Flex>
    </Box>
  );
}
