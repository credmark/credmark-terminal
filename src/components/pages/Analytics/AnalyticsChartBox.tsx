import { HStack } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import { EChartsInstance } from 'echarts-for-react';
import React, { useLayoutEffect, useRef } from 'react';

import { Card } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import Stat from '~/components/shared/Stat';
import { useLineChart, UseLineChartProps } from '~/hooks/useChart';

interface AnalyticsChart extends UseLineChartProps {
  isArea?: boolean;
}

interface AnalyticsChartBoxProps {
  header: { logo?: string; title: string };
  primaryChart: AnalyticsChart;
  secondaryCharts?: [AnalyticsChart, AnalyticsChart] | [];

  actions?: React.ReactNode;

  onExpand: () => void;
  isExpanded: boolean;
}

export default function AnalyticsChartBox({
  header,
  primaryChart: primaryChartOptions,
  secondaryCharts: secondaryChartsOptions = [],
  actions,
  onExpand,
  isExpanded,
}: AnalyticsChartBoxProps) {
  const chartRef = useRef<EChartsInstance>();
  const containerRef = useRef(null);

  const [containerWidth] = useSize(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  const chart = useLineChart(primaryChartOptions);
  const secCharts = [
    useLineChart(secondaryChartsOptions[0] ?? {}),
    useLineChart(secondaryChartsOptions[1] ?? {}),
  ];

  return (
    <Card ref={containerRef}>
      <ChartHeader
        logo={header.logo}
        title={header.title}
        downloadCsv={{
          filename: `${header.title?.replace(/\s/g, '-')}.csv`,
          ...chart.csv,
        }}
        isExpanded={isExpanded}
        toggleExpand={onExpand}
      />

      {secondaryChartsOptions.length === 2 && (
        <HStack spacing="4" my="2" px={isExpanded ? 0 : 2}>
          <HStack flex="1" alignItems="center" spacing="1">
            {!isExpanded && <Stat {...secCharts[0].currentStats[0]} />}
            <HistoricalChart
              height={isExpanded ? 200 : 40}
              flex="1"
              durations={[30, 60, 90]}
              defaultDuration={90}
              isAreaChart={secondaryChartsOptions[0].isArea}
              showCurrentStats
              minimal={!isExpanded}
              {...secCharts[0]}
            />
          </HStack>

          <HStack flex="1" alignItems="center" spacing="1">
            {!isExpanded && <Stat {...secCharts[1].currentStats[0]} />}
            <HistoricalChart
              height={isExpanded ? 200 : 40}
              flex="1"
              durations={[30, 60, 90]}
              defaultDuration={90}
              isAreaChart={secondaryChartsOptions[1].isArea}
              showCurrentStats
              minimal={!isExpanded}
              {...secCharts[1]}
            />
          </HStack>
        </HStack>
      )}

      <HistoricalChart
        durations={[30, 60, 90]}
        defaultDuration={90}
        isAreaChart={primaryChartOptions.isArea}
        showCurrentStats
        highlightCurrentStats
        onChartReady={(chart) => (chartRef.current = chart)}
        actions={actions}
        {...chart}
      />
    </Card>
  );
}
