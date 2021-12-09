import { Box, Center, HStack, Text } from '@chakra-ui/layout';
import { Img, Spinner } from '@chakra-ui/react';
import { EChartsOption, graphic as EChartsGraphic } from 'echarts';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo } from 'react';

type ChartData = Array<{
  timestamp: Date;
  value: number;
}>;

interface AreaChartProps {
  data?: ChartData;
  loading?: boolean;
  title: string;
  titleImg?: string;
  yLabel: string;
  xLabel: string;

  height?: number;
  padding?: number;
  gradient: string[];
}

export default function AreaChart({
  data,
  loading,
  title,
  titleImg,
  xLabel,
  yLabel,
  height = 300,
  padding = 40,
  gradient,
}: AreaChartProps) {
  const option: EChartsOption = useMemo(
    () => ({
      grid: {
        top: 40,
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
          const series = params.seriesName;
          const value = params.data[1];
          return `
          <div style="line-height: 1">
            <div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
              ${date}
            </div>
            <div>
              <span style="margin-right: 16px">${series}</span>
              <strong>${value}</strong>
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
        name: xLabel,
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 12,
          color: '#3B0065',
        },
        axisLine: {
          show: false,
        },
        axisPointer: {
          label: {
            show: false,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        name: yLabel,
        nameLocation: 'middle',
        nameRotate: 90,
        nameTextStyle: {
          fontSize: 12,
          color: '#3B0065',
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
          show: false,
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
          name: yLabel,
          smooth: 1,
          sampling: 'max',
          type: 'line',
          symbol: 'none',
          itemStyle: {
            color: '#3b0065',
          },
          lineStyle: {
            width: 0,
          },
          label: {
            fontWeight: 800,
          },
          areaStyle: {
            opacity: 1,
            color: new EChartsGraphic.LinearGradient(
              0,
              0,
              0,
              1,
              gradient.map((color, index) => ({ color, offset: index })),
            ),
          },
          data: loading
            ? []
            : data?.map(({ timestamp, value }) => [
                // new Date(timestamp).toLocaleDateString(),
                timestamp,
                value,
              ]) ?? [],
        },
      ],
    }),
    [data, gradient, loading, xLabel, yLabel],
  );

  return (
    <Box p={padding + 'px'}>
      <Box shadow="md" position="relative" h={height - padding * 2 + 'px'}>
        <HStack
          bg="white"
          position="absolute"
          top="-4"
          left="4"
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
        <Box position="absolute" top="0px" left="0px" bottom="0px" right="0px">
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
    </Box>
  );
}
