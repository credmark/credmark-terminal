import { Box, Center, Text } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import React from 'react';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
]);

interface PieChartsProps<T> {
  dataset?: T[];
  loading?: boolean;
  title?: string;
  isFullScreen?: boolean;
  height?: number;
}

const PieCharts = <T,>({
  isFullScreen,
  loading,
  dataset,
  height = 224,
  title,
}: PieChartsProps<T>) => {
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: dataset,
      },
    ],
  };

  if (loading) {
    return (
      <Center position="absolute" top="0" left="0" right="0" bottom="0">
        <Spinner color="purple.500" />
      </Center>
    );
  }
  return (
    <Box>
      {title && (
        <Text
          paddingBottom="20px"
          size="14px"
          fontWeight="700"
          textAlign="center"
        >
          {title}
        </Text>
      )}
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        lazyUpdate={true}
        notMerge={true}
        style={{
          height: isFullScreen ? '100%' : height + 'px',
        }}
        theme={'theme_name'}
      />
    </Box>
  );
};
export default PieCharts;
