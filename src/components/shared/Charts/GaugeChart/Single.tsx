import { Box, Center, chakra, Spinner, Text } from '@chakra-ui/react';
import ReactEChartsCore, { EChartsOption } from 'echarts-for-react';
import React, { useMemo } from 'react';

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

interface GaugeChart {
  dataset?: {
    value: number;
    category: string;
    color: string;
    name: string;
  };
  loading?: boolean;
  error?: string;
  gaugeType?: 'top' | 'bottom';
}

const sharedProperties = {
  type: 'gauge',
  // radius property increases or reduces the gauge size
  //   radius: '120%',
  grid: {
    left: '10%',
    right: '10%',
    top: 0,
    bottom: 0,
  },
  splitNumber: 1,
  axisLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    show: false,
  },
  splitLine: {
    show: false,
  },
  pointer: {
    icon: 'triangle',
    length: '15%',
    width: 15,
    showAbove: true,
    offsetCenter: [0, '-70%'],
    itemStyle: {
      color: '#666666',
    },
  },
  progress: {
    show: true,
    roundCap: false,
    width: 18,
  },
  title: {
    show: false,
  },
};

const SingleGaugeChart = ({
  dataset,
  error,
  loading,
  gaugeType = 'top',
}: GaugeChart) => {
  const gaugeIsTop = gaugeType === 'top';

  const baseValue = useMemo(
    () => Math.ceil((dataset?.value || 0) / 100) * 100,
    [dataset],
  );

  const option: EChartsOption = useMemo(
    () => ({
      series: [
        {
          ...sharedProperties,
          center: ['50%', gaugeIsTop ? '60%' : '30%'],
          startAngle: gaugeIsTop ? 180 : 0,
          endAngle: gaugeIsTop ? 0 : 180,
          min: 0,
          max: baseValue,
          itemStyle: {
            color: dataset?.color || '#FF7154',
          },

          detail: {
            backgroundColor: 'transparent',
            borderColor: 'none',
            borderWidth: 2,
            width: '350px',
            height: '100%',
            lineHeight: 30,
            borderRadius: 0,
            offsetCenter: [0, gaugeIsTop ? '-15%' : '62%'],
            valueAnimation: true,
            formatter: function (value: number) {
              const data = dataset;
              if (data)
                return `{unit|${data.name}}\n{value|` + value.toFixed(0) + '%}';
              return '';
            },
            align: 'center',
            rich: {
              borderColor: 'none',
              value: {
                fontSize: 32,
                color: dataset?.color || '#FF7154',
                fontWeight: 'bold',
              },
              unit: {
                fontSize: 16,
                color: '#000000',
              },
            },
          },
          data: [
            {
              value: dataset?.value || 0,
            },
          ],
        },
      ],
    }),
    [dataset, baseValue, gaugeIsTop],
  );
  return (
    <Box>
      {loading && !dataset ? (
        <ChartOverlay>
          <Spinner color="purple.500" />
        </ChartOverlay>
      ) : error ? (
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
      ) : (
        <Box>
          <ReactEChartsCore option={option} notMerge={true} lazyUpdate={true} />
        </Box>
      )}
    </Box>
  );
};

export default SingleGaugeChart;
