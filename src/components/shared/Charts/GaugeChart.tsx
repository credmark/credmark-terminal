import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import ReactEChartsCore, { EChartsOption } from 'echarts-for-react';
import React, { useMemo } from 'react';

import ChartHeader from './ChartHeader';

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
  title?: string;
  seriesName?: string;
  titleImg?: string;
  onClick?: (category: string) => void;
  chartHeaderLabelBackgroundColor?: string;
  chartHeaderLabelName?: string;
  gaugeType?: 'double' | 'top' | 'bottom';
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

const GaugeChart = ({
  datasetA,
  datasetB,
  seriesName = 'Health summary',
  titleImg,
  title,
  chartHeaderLabelBackgroundColor,
  chartHeaderLabelName,
  gaugeType,
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
            color: (datasetB || datasetA)?.color || '#FF7154',
          },

          detail: {
            backgroundColor: 'transparent',
            borderColor: 'none',
            borderWidth: 2,
            width: '100%',
            height: '100%',
            lineHeight: 30,
            borderRadius: 0,
            marginTtop: '-30px',
            offsetCenter: [0, '62%'],
            style: {
              transform: 'rotate(90deg)',
            },
            valueAnimation: true,
            formatter: function (value: number) {
              const data = datasetB || datasetA;
              if (data)
                return `{unit|${data.name}}\n{value|` + value.toFixed(0) + '%}';
              return '';
            },
            align: 'center',
            rich: {
              borderColor: 'none',
              value: {
                fontSize: 32,
                color: (datasetB || datasetA)?.color || '#FF7154',
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
              value: (datasetB || datasetA)?.value || 0,
            },
          ],
        },
      ],
    }),
    [datasetB, datasetA, baseValue],
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
          data:
            datasetA && datasetB
              ? [{ value: datasetA.value }, { value: datasetB.value }]
              : datasetA
              ? [{ value: datasetA.value }]
              : datasetB
              ? [{ value: datasetB.value }]
              : [],

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
          {gaugeType === 'double' ? (
            <>
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
            </>
          ) : gaugeType === 'top' ? (
            <Box>
              <ReactEChartsCore
                option={optionA}
                notMerge={true}
                lazyUpdate={true}
              />
            </Box>
          ) : gaugeType === 'bottom' ? (
            <Box>
              <ReactEChartsCore
                option={optionB}
                notMerge={true}
                lazyUpdate={true}
              />
            </Box>
          ) : (
            <></>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default GaugeChart;
