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
  formatValue?: (value: any) => string;
}

export default function LineChart({
  lines,
  formatValue,
}: LineChartProps): JSX.Element {
  const option = {
    legend: {
      show: false,
    },
    grid: {
      top: 32,
      bottom: 48,
      left: 48,
      right: 32,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: (params: any[]) => {
        if (!Array.isArray(params) || params.length === 0) {
          return;
        }
        const date = new Date(params[0].data[0]).toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        });

        let lines = '';

        for (const param of params) {
          const series = param.seriesName;
          const value = param.data[1];

          lines += `
          <div style="display: flex; margin-bottom: 2px;">
            <div>${param.marker}</div>
            <div style="flex: 1">${series}</div>
            <strong style="margin-left: 16px">${
              formatValue ? formatValue(value) : value
            }</strong>
          </div>
          `;
        }

        return `
        <div style="line-height: 1">
          <div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
            ${date}
          </div>
          ${lines}
        </div>`;
      },
    },
    title: {
      left: 'center',
    },
    xAxis: {
      type: 'time',
      minorTick: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisPointer: {
        label: {
          show: false,
        },
      },
      axisTick: {
        show: true,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisPointer: {
        show: false,
        label: {
          show: false,
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
      },
      axisLabel: {
        show: true,
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
        height: '360px',
      }}
    />
  );
}
