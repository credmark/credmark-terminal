import { Box, Center } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { BarChart as BarChartComponent } from 'echarts/charts';
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
  BarChartComponent,
  CanvasRenderer,
]);

interface PieChartsProps<T> {
  dataset?: T[];
  loading?: boolean;
  isFullScreen?: boolean;
  height?: number;
}

const PieCharts = <T,>({
  isFullScreen,
  loading,
  dataset,
  height = 224,
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
        data: dataset || [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
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
