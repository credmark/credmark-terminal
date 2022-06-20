import { Box, Center, HStack, Text } from '@chakra-ui/layout';
import { Img, Spinner } from '@chakra-ui/react';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react';
import { CallbackDataParams } from 'echarts/types/src/util/types.d';
import React, { useMemo } from 'react';

interface BarChartProps<T> {
  dataset?: T[];
  loading?: boolean;
  xAxisKey?: keyof T;
  yAxisKey?: keyof T;
  title?: string;
  titleImg?: string;
  height?: number;
  padding?: number;
  onClick?: (category: string) => void;
  tooltipFormatter: (data: T | CallbackDataParams, isTitle?: boolean) => string;
}

export default function BarChart<T>({
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
}: BarChartProps<T>) {
  const option: EChartsOption = useMemo(
    () =>
      ({
        legend: {},
        tooltip: {
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
        dataset: {
          source: dataset,
        },
        grid: {
          containLabel: true,
          top: 0,
          bottom: 0,
          left: 10,
          right: 50,
          height: 'auto',
        },
        xAxis: { name: '' },
        yAxis: { type: yAxisKey, axisLabel: { show: false }, inverse: true },
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
              formatter: (params) => tooltipFormatter(params, true),
              color: 'black',
            },
            type: 'bar',
            encode: {
              x: xAxisKey,
              y: yAxisKey,
            },
            color: '#00D696',
          },
        ],
      } as EChartsOption),
    [title, dataset, xAxisKey, yAxisKey, tooltipFormatter],
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
