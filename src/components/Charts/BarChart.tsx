import { Box, Center, HStack, Text } from '@chakra-ui/layout';
import { Img, Spinner } from '@chakra-ui/react';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo } from 'react';

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
}

export default function BarChart({
  data,
  loading,
  height = 300,
  padding = 40,
  title,
  titleImg,
  onClick,
}: BarChartProps) {
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
          color: '#F7BED2',
        },
      ],
    }),
    [data, title],
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
