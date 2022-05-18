import { Box, Center, Flex, Text, Grid } from '@chakra-ui/layout';
import { Spinner, Icon, Link, Img } from '@chakra-ui/react';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo, useState } from 'react';
import { MdArrowForward } from 'react-icons/md';

import ChartHeader from '../ChartHeader';

type ChartData = Array<{
  timestamp: Date;
  value: number;
}>;

type Duration = number | 'ALL';

interface ChartInfoProps {
  volume?: string;
  platform: string;
  link?: string;
  app: 'uniswap_v3' | 'sushiswap';
}

interface AreaChartProps {
  data?: ChartData;
  loading?: boolean;
  title?: string;
  titleImg?: string;
  yLabel: string;
  formatValue?: (value: number) => string;
  durations?: Duration[];
  defaultDuration?: Duration;
  height?: number;
  headerSummary?: string;
  lineColor?: string;
  headerAmount?: string;
  minHeight?: number;
  padding?: number;
  gradient: string[];
  line?: boolean;
  summarySpaced?: boolean;
  info?: ChartInfoProps;
  chartSidebar?: React.ReactNode;
}

export default function AreaChart({
  data: _data,
  loading,
  title,
  info,
  titleImg,
  headerAmount,
  lineColor,
  headerSummary,
  yLabel,
  chartSidebar = null,
  formatValue,
  durations = [1, 7, 30, 'ALL'],
  defaultDuration = 30,
  gradient,
  line = false,
}: AreaChartProps) {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const data = useMemo(() => {
    return _data?.map((dp) => ({
      timestamp: dp.timestamp,
      value: isNaN(dp.value) ? 0 : dp.value,
    }));
  }, [_data]);

  const [duration, setDuration] = useState<number | 'ALL'>(defaultDuration); // In Days

  const dataByDuration = useMemo(() => {
    if (loading || !data || data.length === 0) {
      return [];
    }

    if (duration === 'ALL') {
      return data.map((dp) => [dp.timestamp, dp.value]).reverse();
    }

    const startTs = Date.now();
    const endTs = startTs - duration * 24 * 3600 * 1000;

    return data
      .filter((dp) => dp.timestamp.valueOf() > endTs)
      .map((dp) => [dp.timestamp, dp.value])
      .reverse();
  }, [data, duration, loading]);

  const option: EChartsOption = useMemo(
    () => ({
      grid: {
        top: 72,
        bottom: 40,
        left: 40,
        right: 40,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: ([params]: any) => {
          const date = new Date(params.data[0]).toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });
          const value = params.data[1];
          return `
          <div style="line-height: 1">
            <div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
              ${date}
            </div>
            <div>
              <span style="margin-right: 16px">${yLabel}</span>
              <strong>${formatValue ? formatValue(value) : value}</strong>
            </div>
          </div>
          `;
        },
      },
      title: {
        left: 'center',
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
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
        },
        axisLabel: {
          show: true,
          hideOverlap: true,
        },
      },
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          dimension: 0,
          min: 0,
          max: (data?.length ?? 0) - 1,
        },
      ],
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: function (value) {
          return value.min * 0.75;
        },
        max: function (value) {
          return value.max * 1.25;
        },
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
          show: false,
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
              return num.toFixed(fixedFigs);
            }
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          type: 'slider',
          show: false,
          start: 0,
          end: 10,
        },
      ],
      series: [
        {
          type: 'line',
          symbol: 'circle',
          symbolSize: 10,
          showSymbol: false,
          areaStyle: !line
            ? {
                opacity: 0.325,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: gradient.map((color, index) => {
                    return {
                      color,
                      offset: index,
                    };
                  }),
                },
              }
            : undefined,
          label: {
            fontWeight: 800,
          },
          lineStyle: {
            color: lineColor || '#3B0065',
          },
          itemStyle: {
            color: 'blue',
          },
          data: dataByDuration,
        },
      ],
    }),
    [
      data?.length,
      dataByDuration,
      lineColor,
      formatValue,
      gradient,
      line,
      yLabel,
    ],
  );

  const pageId = title
    ? title.replace(/\s/g, '-')
    : `cmk-analytics-${Math.random()}`;

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document?.getElementById(pageId)?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document?.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const generateCsvFormat = () => {
    const formattedCsvTitle = `${duration}d-${title?.replace(/\s/g, '-')}`;

    if (dataByDuration) {
      const header = [title || 'Credmark Analytics', 'Amount'];
      const values = dataByDuration
        ?.map((o) => Object.values(o).join(','))
        .join('\n');
      return { header, values, formattedCsvTitle };
    }
    return {
      header: [],
      values: '',
      formattedCsvTitle: 'credmark-token-analytics',
    };
  };

  return (
    <Box
      id={pageId}
      backgroundColor="#fff"
      borderColor="gray.100"
      shadow="md"
      rounded="base"
      position="relative"
      boxSizing="border-box"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        position="absolute"
        width="100%"
        zIndex={10}
        top={10}
        left={1}
      >
        {(headerAmount || headerSummary) && (
          <Text
            fontSize="sm"
            pt="1"
            color="#1A1A1A"
            paddingLeft="2"
            paddingBottom="2"
          >
            {headerSummary} <strong>{headerAmount}</strong>
          </Text>
        )}
        <Flex>
          {durations.map((days) => (
            <Box
              key={days}
              p="2"
              mx="2"
              fontSize="sm"
              fontWeight="bold"
              color={duration === days ? '#1A1A1A' : 'gray.300'}
              cursor="pointer"
              onClick={() => setDuration(days as 'ALL')}
              _hover={
                duration === days
                  ? {}
                  : {
                      color: '#1A1A1A',
                    }
              }
            >
              {days === 'ALL' ? 'ALL' : `${days}D`}
            </Box>
          ))}
        </Flex>
      </Flex>

      <Box
        shadow="md"
        position="relative"
        display="grid"
        gridTemplateRows="auto 1fr"
        height="100%"
        width="100%"
        boxSizing="border-box"
      >
        <ChartHeader
          title={title}
          logo={<Img src={titleImg} height="20px" />}
          downloadFileName={`${generateCsvFormat().formattedCsvTitle.toLocaleLowerCase()}.csv`}
          downloadFileHeaders={generateCsvFormat().header}
          downloadData={generateCsvFormat().values}
          isFullScreen={isFullScreen}
          toggleFullScreen={toggleFullScreen}
        />
        {loading ? (
          <Center position="absolute" top="0" left="0" right="0" bottom="0">
            <Spinner color="purple.500" />
          </Center>
        ) : (
          <Grid
            position="relative"
            gridTemplateColumns={chartSidebar ? `max-content 1fr` : '1fr'}
          >
            {chartSidebar || <></>}
            <Box
              id="chartwrapper"
              position="relative"
              height={'100%'}
              width={'100%'}
              overflow="hidden"
              padding={`10px 0px ${info ? '30px' : '10px'} 0px `}
            >
              <ReactEChartsCore
                option={option}
                notMerge={true}
                lazyUpdate={true}
                style={{
                  width: '100%',
                  margin: '0',
                  height: isFullScreen ? '100%' : '320px',
                }}
              />
            </Box>
          </Grid>
        )}
      </Box>

      {info && (
        <Link
          isExternal
          display="flex"
          alignItems="center"
          fontSize="xs"
          color="purple.500"
          gap="1"
          position="absolute"
          bottom={2}
          left={2}
          href={info.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on {info.platform}
          <Icon cursor="pointer" as={MdArrowForward} />
        </Link>
      )}
    </Box>
  );
}
