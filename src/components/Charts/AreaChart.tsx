import { Box, HStack, Text } from '@chakra-ui/layout';
import { Img } from '@chakra-ui/react';
import * as echarts from 'echarts';
import ReactEChartsCore from 'echarts-for-react';
import React from 'react';

type ChartData = Array<{
  timestamp: string;
  value: number;
}>;

function dummyData(): ChartData {
  let base = +new Date(1968, 9, 3);
  const oneDay = 24 * 3600 * 1000;
  const date: string[] = [];
  const data: number[] = [Math.random() * 300];
  let min: number = data[0];
  for (let i = 1; i < 20000; i++) {
    const now = new Date((base += oneDay));
    const time = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join(
      '/',
    );
    const value = Math.round((Math.random() - 0.5) * 20 + data[i - 1]);
    date.push(time);
    data.push(value);
    if (value < min) {
      min = value;
    }
  }

  const offset = min < 0 ? 0 - min : 0;

  const chartData: ChartData = [];
  for (let i = 0; i < 20000; i++) {
    chartData.push({
      timestamp: date[i],
      value: data[i] + offset,
    });
  }

  return chartData;
}

interface AreaChartProps {
  data?: ChartData;
  title: string;
  titleImg?: string;
  yLabel: string;
  xLabel: string;

  height?: number;
  padding?: number;
}

export default function AreaChart({
  data = dummyData(),
  title,
  titleImg,
  xLabel,
  yLabel,
  height = 300,
  padding = 40,
}: AreaChartProps) {
  const option = {
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
      renderMode: 'richText',
    },
    title: {
      left: 'center',
    },
    xAxis: {
      type: 'category',
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#DE1B60',
            },
            {
              offset: 0.3,
              color: '#850D63',
            },
            {
              offset: 1,
              color: '#3D0166',
            },
          ]),
        },
        data: data.map(({ timestamp, value }) => [
          // new Date(timestamp).toLocaleDateString(),
          timestamp,
          value,
        ]),
      },
    ],
  };

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
      </Box>
    </Box>
  );
}
