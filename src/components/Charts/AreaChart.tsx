import { Box, Center, Flex, HStack, Text } from '@chakra-ui/layout';
import { Img, Spinner } from '@chakra-ui/react';
import { EChartsOption, graphic as EChartsGraphic } from 'echarts';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo, useState } from 'react';

type ChartData = Array<{
  timestamp: Date;
  value: number;
}>;

type Duration = number | 'ALL';

interface AreaChartProps {
  data?: ChartData;
  loading?: boolean;
  title?: string;
  titleImg?: string;
  yLabel: string;
  formatValue?: (value: any) => string;
  durations?: Duration[];
  defaultDuration?: Duration;

  height?: number;
  padding?: number;
  gradient: string[];
  line?: boolean;
}

export default function AreaChart({
  data,
  loading,
  title,
  titleImg,
  yLabel,
  formatValue,
  durations = [1, 7, 30, 'ALL'],
  defaultDuration = 30,
  height = 300,
  padding = 40,
  gradient,
  line = false,
}: AreaChartProps) {
  const [duration, setDuration] = useState<number | 'ALL'>(defaultDuration); // In Days

  const dataByDuration = useMemo(() => {
    if (loading || !data || data.length === 0) {
      return [];
    }

    if (duration === 'ALL') {
      return data.map((dp) => [dp.timestamp, dp.value]).reverse();
    }

    const startTs = Date.now();
    const endTs = startTs - duration * 24 * 3600 * 1000;

    return data
      .filter((dp) => dp.timestamp.valueOf() > endTs)
      .map((dp) => [dp.timestamp, dp.value])
      .reverse();
  }, [data, duration, loading]);

  const currentValue = useMemo(() => {
    if (data && data.length > 0) {
      const sorted = data.sort(
        (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
      );
      return sorted[sorted.length - 1].value;
    }
  }, [data]);

  const option: EChartsOption = useMemo(
    () => ({
      grid: {
        top: 72,
        bottom: 40,
        left: 40,
        right: 40,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: ([params]: any) => {
          const date = new Date(params.data[0]).toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
          const value = params.data[1];
          return `
          <div style="line-height: 1">
            <div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
              ${date}
            </div>
            <div>
              <span style="margin-right: 16px">${yLabel}</span>
              <strong>${formatValue ? formatValue(value) : value}</strong>
            </div>
          </div>
          `;
        },
      },
      title: {
        left: 'center',
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          show: false,
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
        axisLabel: {
          show: true,
          hideOverlap: true,
        },
      },
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          dimension: 0,
          min: 0,
          max: (data?.length ?? 0) - 1,
        },
      ],
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: function (value) {
          return value.min * 0.75;
        },
        max: function (value) {
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
          show: false,
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
              return num.toFixed(fixedFigs);
            }
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          show: false,
          start: 0,
          end: 10,
        },
      ],
      series: [
        {
          smooth: 1,
          sampling: 'max',
          type: 'line',
          symbol: 'circle',
          symbolSize: 10,
          showSymbol: false,
          itemStyle: {
            color: '#E53E3E',
          },
          lineStyle: line
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: gradient.map((color, index) => ({
                    color,
                    offset: index,
                  })),
                  global: false, // default is false
                },
              }
            : {
                width: 0,
              },
          label: {
            fontWeight: 800,
          },
          areaStyle: !line
            ? {
                opacity: 1,
                color: new EChartsGraphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  gradient.map((color, index) => ({ color, offset: index })),
                ),
              }
            : undefined,
          data: dataByDuration,
        },
      ],
    }),
    [data?.length, dataByDuration, formatValue, gradient, line, yLabel],
  );

  const currentPriceHeight = 0;

  return (
    <Box p={padding + 'px'}>
      <Box
        shadow="md"
        position="relative"
        h={height - padding * 2 + currentPriceHeight + 'px'}
      >
        {(title || titleImg) && (
          <Box position="absolute" top="-4" left="4">
            <HStack
              bg="white"
              shadow="lg"
              py="1"
              px="2"
              rounded="md"
              border="1px"
              borderColor="gray.100"
            >
              <Img src={titleImg} h="6" />
              <Text
                fontFamily="Credmark Regular"
                fontSize="lg"
                pt="1"
                color="purple.500"
              >
                {title}
              </Text>
            </HStack>
            {currentValue && (
              <Box textAlign="center" pt="2" pr="2" color="purple.500">
                <Text as="span" fontSize="xs">
                  {yLabel}
                </Text>{' '}
                <Text as="span" fontWeight="bold">
                  {formatValue ? formatValue(currentValue) : currentValue}
                </Text>
              </Box>
            )}
          </Box>
        )}
        <Box
          position="absolute"
          top={currentPriceHeight + 'px'}
          left="0px"
          bottom="0px"
          right="0px"
        >
          <ReactEChartsCore
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{
              height: height + 'px',
              margin: padding * -1 + 'px',
            }}
          />
        </Box>
        {loading && (
          <Center position="absolute" top="0" left="0" right="0" bottom="0">
            <Spinner color="purple.500" />
          </Center>
        )}
      </Box>
      <Flex align="center" mt="8">
        {durations.map((days) => (
          <Box
            key={days}
            p="2"
            mx="2"
            fontSize="sm"
            fontWeight="bold"
            color={duration === days ? 'purple.500' : 'gray.300'}
            cursor="pointer"
            onClick={() => setDuration(days as 'ALL')}
            _hover={
              duration === days
                ? {}
                : {
                    color: 'purple.500',
                  }
            }
          >
            {days === 'ALL' ? 'ALL' : `${days}D`}
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
