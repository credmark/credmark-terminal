import useSize from '@react-hook/size';
import { EChartsInstance } from 'echarts-for-react';
import React, { useLayoutEffect, useRef } from 'react';

import { Card } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import { useLineChart } from '~/hooks/useChart';

interface LenderChartBoxProps {
  label: string;
  tooltip: React.ReactNode;
  isAreaChart?: boolean;
  chartData: ReturnType<typeof useLineChart>;
  onExpand: () => void;
  isExpanded: boolean;
}

export default function LenderChartBox({
  label,
  tooltip,
  isAreaChart,
  chartData,
  onExpand,
  isExpanded,
}: LenderChartBoxProps) {
  const chartRef = useRef<EChartsInstance>();
  const containerRef = useRef(null);

  const [containerWidth] = useSize(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  return (
    <Card ref={containerRef}>
      <ChartHeader
        title={label}
        toggleExpand={onExpand}
        isExpanded={isExpanded}
        downloadCsv={{
          filename: `${label.replaceAll(' ', '_')}[Credmark].csv`,
          ...chartData.csv,
        }}
        tooltip={{ status: 'info', content: tooltip }}
      />

      <HistoricalChart
        onChartReady={(chart) => (chartRef.current = chart)}
        isAreaChart={isAreaChart}
        showCurrentStats
        highlightCurrentStats
        durations={[30, 60, 90]}
        defaultDuration={90}
        {...chartData}
      />
    </Card>
  );
}
