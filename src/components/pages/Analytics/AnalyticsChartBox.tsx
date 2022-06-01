import { Box } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import { EChartsInstance } from 'echarts-for-react';
import React, { useLayoutEffect, useRef } from 'react';

import { BorderedCard } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import { useSingleLineChart, UseSingleLineChartProps } from '~/hooks/useChart';
import useFullscreen from '~/hooks/useFullscreen';

interface AnalyticsChartBoxProps extends UseSingleLineChartProps {
  title: string;
  titleImg: string;

  isArea?: boolean;
  footer?: React.ReactNode;
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
  fractionDigits,
  footer,
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
    fractionDigits,
  });

  return (
    <BorderedCard ref={containerRef} display="grid" gridTemplateRows="auto 1fr">
      <ChartHeader
        logo={titleImg}
        title={title}
        downloadFileName={`${title?.replace(/\s/g, '-')}.csv`}
        downloadFileHeaders={chart.csv.headers}
        downloadData={chart.csv.data}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
      />
      <HistoricalChart
        durations={[30, 60, 90]}
        defaultDuration={60}
        isAreaChart={isArea}
        showCurrentStats
        onChartReady={(chart) => (chartRef.current = chart)}
        isFullScreen={isFullScreen}
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
