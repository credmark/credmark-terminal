import { Box, Center, HStack, Text } from '@chakra-ui/layout';
import { Img, Spinner, useColorMode } from '@chakra-ui/react';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { CallbackDataParams } from 'echarts/types/src/util/types.d';
import React, { useMemo } from 'react';

import { darkTheme } from '~/theme/echarts';

interface BarChartProps<T> {
  dataset?: T[] | T;
  loading?: boolean;
  xAxisKey?: string;
  yAxisKey?: string;
  title?: string;
  titleImg?: string;
  height?: number;
  grouped?: boolean;
  showLegend?: boolean;
  showYaxisLabel?: boolean;
  showXaxisLabel?: boolean;
  padding?: number;
  onClick?: (category: string) => void;
  tooltipFormatter: (data: T | CallbackDataParams, isTitle?: boolean) => string;
}

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
]);

export default function App<T>({
  dataset,
  loading,
  height = 300,
  padding = 40,
  title,
  titleImg,
  xAxisKey,
  yAxisKey,
  onClick,
  tooltipFormatter,
  grouped = false,
  showLegend = false,
  showXaxisLabel = false,
  showYaxisLabel = false,
}: BarChartProps<T>) {
  const { colorMode } = useColorMode();

  const option: EChartsOption = useMemo(
    () =>
      ({
        legend: {
          show: showLegend,
          icon: 'circle',
          left: 'left',
          padding: [0, 0, 0, 20],
        },
        tooltip: grouped
          ? {}
          : {
              trigger: 'axis',
              formatter: (params) => {
                if (
                  !Array.isArray(params) ||
                  params.length === 0 ||
                  !params[0].data
                ) {
                  return '';
                }
                return tooltipFormatter(params[0].data as T);
              },
            },
        dimensions: [yAxisKey, xAxisKey],
        dataset: grouped
          ? dataset
          : {
              source: dataset,
            },
        grid: {
          containLabel: true,
          top: 40,
          bottom: 0,
          left: 0,
          right: 50,
          height: 'auto',
          width: '100%',
          align: 'left',
        },

        xAxis: {
          type: xAxisKey,
          name: '',
          axisLabel: { show: showXaxisLabel },
        },
        yAxis: {
          type: yAxisKey,
          axisLabel: { show: showYaxisLabel },
          inverse: !grouped,
        },
        series: grouped
          ? [
              {
                type: 'bar',
                color: '#00D696',
                barGap: 0,
                barWidth: '100%',
                barMaxWidth: '15%',
              },
              {
                type: 'bar',
                color: '#00BFCA',
                barGap: 0,
                barWidth: '100%',
                barMaxWidth: '15%',
              },
              {
                type: 'bar',
                color: '#8342AF',
                barGap: 0,
                barWidth: '100%',
                barMaxWidth: '15%',
              },
            ]
          : [
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
                  formatter: (params) => tooltipFormatter(params, true),
                  color: colorMode === 'dark' ? 'white' : 'black',
                },
                type: 'bar',
                encode: {
                  x: xAxisKey,
                  y: yAxisKey,
                },
                color: colorMode === 'dark' ? '#0CA277' : '#08FEB4',
              },
            ],
      } as EChartsOption),
    [
      showLegend,
      grouped,
      yAxisKey,
      xAxisKey,
      dataset,
      showXaxisLabel,
      showYaxisLabel,
      title,
      colorMode,
      tooltipFormatter,
    ],
  );

  const currentPriceHeight = 0;

  return (
    <Box p={padding + 'px'} marginBottom="20px">
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
              <Img src={titleImg} alt={title || 'Credmark'} h="6" />
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
        {loading && (
          <Center position="absolute" top="0" left="0" right="0" bottom="0">
            <Spinner color="purple.500" />
          </Center>
        )}
      </Box>
    </Box>
  );
}
