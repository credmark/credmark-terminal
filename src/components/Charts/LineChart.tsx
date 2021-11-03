import ReactEChartsCore from 'echarts-for-react';
import React from 'react';

export interface Line {
  name: string;
  color: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
}

interface LineChartProps {
  lines: Line[];
}

export default function LineChart({ lines }: LineChartProps): JSX.Element {
  const option = {
    legend: {
      show: false,
    },
    grid: {
      top: 0,
      bottom: 0,
      left: 16,
      right: 16,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      renderMode: 'richText',
    },
    title: {
      left: 'center',
    },
    xAxis: {
      type: 'category',
      minorTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisPointer: {
        label: {
          show: false,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisPointer: {
        label: {
          show: false,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    series: lines.map((line) => ({
      name: line.name,
      type: 'line',
      symbol: 'none',
      label: {
        fontWeight: 800,
      },
      lineStyle: {
        color: line.color,
      },
      itemStyle: {
        color: line.color,
      },
      data: line.data.map(({ timestamp, value }) => [timestamp, value]),
    })),
  };

  return (
    <ReactEChartsCore
      option={option}
      notMerge={true}
      lazyUpdate={true}
      style={{
        height: '500px',
      }}
    />
  );
}
