import { Box, Center, HStack, Text } from '@chakra-ui/layout';
import { Img, Spinner, useColorMode } from '@chakra-ui/react';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart as EChartsBarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useMemo } from 'react';

import { darkTheme } from '~/theme/echarts';

type ChartData = Array<{
  category: string;
  value: number;
}>;

interface BarChartProps {
  data?: ChartData;
  loading?: boolean;
  title?: string;
  titleImg?: string;
  height?: number;
  padding?: number;
  onClick?: (category: string) => void;
  tooltipFormatter: (category: string, value: number) => string;
}

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  EChartsBarChart,
  CanvasRenderer,
]);

export default function BarChart({
  data,
  loading,
  height = 300,
  padding = 40,
  title,
  titleImg,
  onClick,
  tooltipFormatter,
}: BarChartProps) {
  const { colorMode } = useColorMode();

  const option: EChartsOption = useMemo(
    () => ({
      grid: {
        top: 16,
        bottom: 48,
        left: 16,
        right: 16,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          if (!Array.isArray(params) || params.length === 0) {
            return '';
          }

          return tooltipFormatter(params[0].name, params[0].value as number);
        },
      },
      legend: {},
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: data?.map((datum) => datum.category),
        axisLabel: {
          show: false,
        },
        inverse: true,
      },
      series: [
        {
          realtimeSort: true,
          name: title,
          label: {
            show: true,
            rotate: 0,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideLeft',
            distance: 15,
            formatter: '{b} {c}',
            color: 'black',
          },
          type: 'bar',
          data: data?.map((datum) => datum.value),
          color: colorMode === 'dark' ? '#0CA277' : '#08FEB4',
        },
      ],
    }),
    [colorMode, data, title, tooltipFormatter],
  );

  const currentPriceHeight = 0;

  return (
    <Box p={padding + 'px'}>
      <Box
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
              <Text fontSize="lg" pt="1" color="purple.500">
                {title}
              </Text>
            </HStack>
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
            theme={colorMode === 'dark' ? darkTheme : undefined}
            echarts={echarts}
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{
              height: height + 'px',
              margin: padding * -1 + 'px',
            }}
            onChartReady={(chartInstance) => {
              chartInstance.on(
                'click',
                function (params: {
                  componentType: string;
                  componentSubType: string;
                  name: string;
                }) {
                  if (
                    params.componentType === 'series' &&
                    params.componentSubType === 'bar' &&
                    onClick
                  ) {
                    onClick(params.name);
                  }
                },
              );
            }}
          />
        </Box>
        {loading && (!data || data.length === 0) && (
          <Center position="absolute" top="0" left="0" right="0" bottom="0">
            <Spinner color="purple.500" />
          </Center>
        )}
      </Box>
    </Box>
  );
}
