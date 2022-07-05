import { Box } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import { EChartsInstance } from 'echarts-for-react';
import dynamic from 'next/dynamic';
import React, { useLayoutEffect, useRef } from 'react';

import { BorderedCard } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
const HistoricalChart = dynamic(
  () => import('~/components/shared/Charts/HistoricalChart'),
  { ssr: false },
);
import { useSingleLineChart, UseSingleLineChartProps } from '~/hooks/useChart';
import useFullscreen from '~/hooks/useFullscreen';

interface AnalyticsChartBoxProps extends UseSingleLineChartProps {
  title: string;
  titleImg: string;

  isArea?: boolean;
  footer?: React.ReactNode;

  actions?: React.ReactNode;
}

export default function AnalyticsChartBox({
  title,
  titleImg,
  isArea = false,
  data,
  name,
  color,
  loading,
  error,
  formatter,
  formatPrefix,
  formatSuffix,
  fractionDigits,
  footer,
  actions,
}: AnalyticsChartBoxProps) {
  const chartRef = useRef<EChartsInstance>();
  const containerRef = useRef(null);

  const [containerWidth] = useSize(containerRef);
  const { isFullScreen, toggleFullScreen } = useFullscreen(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  const chart = useSingleLineChart({
    name,
    color,
    data,
    loading,
    error,
    formatter,
    formatPrefix,
    formatSuffix,
    fractionDigits,
  });

  return (
    <BorderedCard ref={containerRef} display="grid" gridTemplateRows="auto 1fr">
      <ChartHeader
        logo={titleImg}
        title={title}
        downloadCsv={{
          filename: `${title?.replace(/\s/g, '-')}.csv`,
          ...chart.csv,
        }}
        isExpanded={isFullScreen}
        toggleExpand={toggleFullScreen}
      />
      <HistoricalChart
        durations={[30, 60, 90]}
        defaultDuration={60}
        isAreaChart={isArea}
        showCurrentStats
        onChartReady={(chart) => (chartRef.current = chart)}
        isFullScreen={isFullScreen}
        actions={actions}
        {...chart}
      />
      {footer && (
        <Box px="4" py="2">
          {footer}
        </Box>
      )}
    </BorderedCard>
  );
}
