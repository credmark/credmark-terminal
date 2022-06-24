import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import ReactEChartsCore, { EChartsOption } from 'echarts-for-react';
import React, { useMemo } from 'react';

import ChartHeader from './ChartHeader';

interface GaugeChart {
  datasetA: {
    value: number;
    category: string;
    color: string;
    name: string;
  };
  datasetB: {
    value: number;
    category: string;
    color: string;
    name: string;
  };
  loading?: boolean;
  title?: string;
  seriesName?: string;
  titleImg?: string;
  onClick?: (category: string) => void;
  chartHeaderLabelBackgroundColor?: string;
  chartHeaderLabelName?: string;
}

const sharedProperties = {
  type: 'gauge',
  splitNumber: 1,
  axisLine: {
    show: true,
    borderColor: 'blue',
    lineStyle: {
      width: 19,
    },
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
    show: false,
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

const GaugeChart = ({
  datasetA,
  datasetB,
  seriesName = 'Health summary',
  titleImg,
  title,
  chartHeaderLabelBackgroundColor,
  chartHeaderLabelName,
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
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            borderRadius: 4,
          },

          detail: {
            backgroundColor: 'transparent',
            borderColor: 'none',
            borderWidth: 2,
            width: '100%',
            height: '100%',
            lineHeight: 40,
            borderRadius: 0,
            offsetCenter: [0, '-20%'],
            style: {
              transform: 'rotate(90deg)',
            },
            valueAnimation: true,
            formatter: function (value: number) {
              return (
                `{unit|${datasetA.name}}\n{value|` + value.toFixed(0) + '%}'
              );
            },
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
                padding: [0, 0, -20, 10],
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
            shadowColor: 'rgba(0,138,255,0.45)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            borderRadius: 4,
          },

          detail: {
            backgroundColor: 'transparent',
            borderColor: 'none',
            borderWidth: 2,
            width: '100%',
            height: '100%',
            lineHeight: 40,
            borderRadius: 0,
            marginTtop: '-30px',
            offsetCenter: [0, '50%'],
            style: {
              transform: 'rotate(90deg)',
            },
            valueAnimation: true,
            formatter: function (value: number) {
              return (
                `{unit|${datasetB.name}}\n{value|` + value.toFixed(0) + '%}'
              );
            },
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
                padding: [0, 0, -20, 10],
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
  return (
    <Box
      height="400px"
      maxWidth="382px"
      width="100%"
      shadow="md"
      background="white"
    >
      <ChartHeader
        logo={titleImg}
        title={title}
        downloadCsv={{
          filename: `${title?.replace(/\s/g, '-')}.csv`,
          data: [{ value: datasetA.value }, { value: datasetB.value }],
          headers: [seriesName],
        }}
        noShadow={true}
      />
      <Box pl="10px" pr="10px">
        <Flex width="max-content" height="42px" alignItems="center">
          <Text
            backgroundImage={chartHeaderLabelBackgroundColor}
            backgroundSize="cover"
            backgroundRepeat="no-repeat"
            borderRadius="16px"
            fontSize="xs"
            color="white"
            pl="10px"
            pr="10px"
          >
            {chartHeaderLabelName}
          </Text>
        </Flex>

        <Grid
          gridTemplateRows="repeat(2, 200px)"
          gridTemplateColumns="1fr"
          overflow="hidden"
        >
          <Box>
            <ReactEChartsCore
              option={optionA}
              notMerge={true}
              lazyUpdate={true}
            />
          </Box>
          <Box mt="-180px">
            <ReactEChartsCore
              option={optionB}
              notMerge={true}
              lazyUpdate={true}
            />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default GaugeChart;
