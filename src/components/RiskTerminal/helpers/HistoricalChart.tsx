import { Box, Center, Spinner, useBreakpointValue } from '@chakra-ui/react';
import ReactEChartsCore, { EChartsInstance } from 'echarts-for-react';
import React, { useMemo } from 'react';

export interface Line {
  name: string;
  color: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
}

interface HistoricalChartProps {
  lines: Line[];
  loading?: boolean;
  formatValue?: (value: number) => string;
  showLegend?: boolean;
  onChartReady?: (chart: EChartsInstance) => void;
  isAreaChart?: boolean;
}

export default function HistoricalChart({
  lines,
  loading = false,
  formatValue,
  showLegend = false,
  onChartReady,
  isAreaChart,
}: HistoricalChartProps): JSX.Element {
  const legendWidth = useBreakpointValue({ base: undefined, md: 100 });

  const series = useMemo(() => {
    return lines.map((line) => {
      return {
        name: line.name,
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        showSymbol: false,
        areaStyle: isAreaChart
          ? {
              opacity: 0.325,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: line.color,
                  },
                  {
                    offset: 1,
                    color: 'white',
                  },
                ],
              },
            }
          : undefined,
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
      };
    });
  }, [isAreaChart, lines]);

  const option = useMemo(() => {
    return {
      legend: {
        show: showLegend,
        width: legendWidth ? series.length * legendWidth : undefined,
      },
      grid: {
        top: showLegend ? 64 : 0,
        bottom: 48,
        left: 48,
        right: 32,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (
          params: Array<{
            seriesName: string;
            marker: string;
            data: [number, number];
          }>,
        ) => {
          if (!Array.isArray(params) || params.length === 0) {
            return;
          }

          const date = new Date(params[0].data[0]).toLocaleDateString(
            undefined,
            {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            },
          );

          let legend = '';

          for (const param of params) {
            const series = param.seriesName;
            const value = param.data[1];

            legend += `
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
              ${legend}
            </div>`;
        },
      },
      title: {
        left: 'center',
      },
      xAxis: {
        type: 'time',
        axisLine: {
          show: true,
        },
        axisPointer: {
          label: {
            show: false,
          },
          lineStyle: {
            color: '#E53E3E',
          },
        },
        axisTick: {
          show: true,
          hideOverlap: true,
        },
        minorTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          hideOverlap: true,
        },
      },
      yAxis: {
        type: 'value',
        min: function (value: { min: number }) {
          return value.min * 0.75;
        },
        max: function (value: { max: number }) {
          return value.max * 1.25;
        },
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
          showMinLabel: false,
          showMaxLabel: false,
          formatter: function (value: number | string) {
            const num = Number(value);
            const fixedFigs = 2;
            if (num >= 1e9) {
              return `${Number((num / 1e9).toFixed(fixedFigs))}B`;
            } else if (num >= 1e6) {
              return `${Number((num / 1e6).toFixed(fixedFigs))}M`;
            } else if (num >= 1e3) {
              return `${Number((num / 1e3).toFixed(fixedFigs))}K`;
            } else if (num > 10) {
              return Number(num.toFixed(fixedFigs));
            } else {
              return Number(num.toFixed(fixedFigs));
            }
          },
        },
      },
      series,
    };
  }, [formatValue, series, showLegend, legendWidth]);

  return (
    <Box position="relative">
      <ReactEChartsCore
        option={option}
        lazyUpdate={true}
        notMerge={true}
        style={{
          height: '360px',
        }}
        onChartReady={onChartReady}
      />
      {loading && (
        <Center position="absolute" top="0" left="0" right="0" bottom="0">
          <Spinner color="purple.500" />
        </Center>
      )}
    </Box>
  );
}
