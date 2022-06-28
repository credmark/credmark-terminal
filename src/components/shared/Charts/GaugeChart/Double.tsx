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
  datasetA?: {
    value: number;
    category: string;
    color: string;
    name: string;
  };
  datasetB?: {
    value: number;
    category: string;
    color: string;
    name: string;
  };
  loading?: boolean;
  error?: string;
}

const sharedProperties = {
  type: 'gauge',
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

const DoubleGaugeChart = ({
  datasetA,
  datasetB,
  loading,
  error,
}: GaugeChart) => {
  const baseValue = useMemo(
    () =>
      Math.ceil(Math.max(datasetA?.value || 0, datasetB?.value || 0) / 100) *
      100,
    [datasetA, datasetB],
  );

  const optionA: EChartsOption = useMemo(
    () => ({
      series: [
        {
          ...sharedProperties,
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: baseValue,
          itemStyle: {
            color: datasetA?.color || '#00D696',
            borderRadius: 4,
          },

          detail: {
            backgroundColor: 'transparent',
            borderColor: 'none',
            borderWidth: 2,
            width: '100%',
            height: '100%',
            lineHeight: 30,
            borderRadius: 0,
            offsetCenter: [0, '-15%'],
            style: {
              transform: 'rotate(90deg)',
            },
            valueAnimation: true,
            formatter: function (value: number) {
              if (datasetA)
                return (
                  `{unit|${datasetA.name}}\n{value|` + value.toFixed(0) + '%}'
                );
              return '';
            },
            align: 'center',
            rich: {
              borderColor: 'none',
              value: {
                fontSize: 32,
                color: datasetA?.color || '#00D696',
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
              value: datasetA?.value || 0,
            },
          ],
        },
      ],
    }),
    [datasetA, baseValue],
  );
  const optionB: EChartsOption = useMemo(
    () => ({
      series: [
        {
          ...sharedProperties,
          startAngle: 0,
          endAngle: 180,
          min: 0,
          max: baseValue,
          itemStyle: {
            color: datasetB?.color || '#FF7154',
          },

          detail: {
            backgroundColor: 'transparent',
            borderColor: 'none',
            borderWidth: 2,
            width: '350px',
            height: '100%',
            lineHeight: 30,
            borderRadius: 0,
            offsetCenter: [0, '62%'],
            style: {
              transform: 'rotate(90deg)',
            },
            valueAnimation: true,
            formatter: function (value: number) {
              const data = datasetB;
              if (data)
                return `{unit|${data.name}}\n{value|` + value.toFixed(0) + '%}';
              return '';
            },
            align: 'center',
            rich: {
              borderColor: 'none',
              value: {
                fontSize: 32,
                color: datasetB?.color || '#FF7154',
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
              value: datasetB?.value || 0,
            },
          ],
        },
      ],
    }),
    [datasetB, baseValue],
  );

  if (loading && !datasetA && !datasetB) {
    return (
      <ChartOverlay>
        <Spinner color="purple.500" />
      </ChartOverlay>
    );
  }

  if (error) {
    return (
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
    );
  }
  return (
    <>
      <Box>
        <ReactEChartsCore option={optionA} notMerge={true} lazyUpdate={true} />
      </Box>
      <Box mt="-180px">
        <ReactEChartsCore option={optionB} notMerge={true} lazyUpdate={true} />
      </Box>
    </>
  );
};

export default DoubleGaugeChart;
