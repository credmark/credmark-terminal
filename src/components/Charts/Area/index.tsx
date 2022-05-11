import { Box, Center, Flex, HStack, Text } from '@chakra-ui/layout';
import { Img, Spinner, Container, IconButton } from '@chakra-ui/react';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

import { CmkDownloadIcon } from '~/components/Icons';
import CmkArrowRight from '~/components/Icons/CmkArrowRight';
import CmkFullScreenIcon from '~/components/Icons/CmkFullScreenIcon';

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
  minHeight = 400,
  formatValue,
  durations = [1, 7, 30, 'ALL'],
  defaultDuration = 30,
  height = 300,
  summarySpaced = false,
  padding = 40,
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
          show: false,
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
                    console.log('color', color);
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

  const currentPriceHeight = 0;

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
    <Container
      minWidth="320px"
      width="100%"
      padding={0}
      border="1px solid #DEDEDE"
      shadow=" rgba(224, 227, 234, 0.6) 0px 0px 10px"
      id={pageId}
      backgroundColor="#fff"
      position="relative"
      minHeight={minHeight}
    >
      {(headerAmount || headerSummary) && (
        <Box position="absolute" top={10} left={1}>
          <Text
            fontSize="sm"
            pt="1"
            color="purple.500"
            paddingLeft="2"
            paddingBottom="2"
          >
            {headerSummary} <strong>{headerAmount}</strong>
          </Text>
        </Box>
      )}

      <Box
        shadow="md"
        position="relative"
        display="grid"
        gridTemplateRows="auto 1fr"
        minHeight={isFullScreen ? '70%' : 340}
        h={
          isFullScreen
            ? '90%'
            : (summarySpaced ? height + 20 : height) -
              padding * 2 +
              currentPriceHeight +
              'px'
        }
      >
        <Box
          borderBottom="1px solid #DEDEDE"
          display="grid"
          gridTemplateColumns="1fr max-content"
          gap="5"
          paddingLeft="3"
          alignItems="center"
        >
          <HStack bg="transparent">
            <Img src={titleImg} h="4" />
            <Text fontSize="md" color="purple.500">
              {title}
            </Text>
          </HStack>

          <Box
            display="flex"
            gap="1"
            justifyContent="center"
            alignItems="center"
            zIndex={99}
          >
            {data ? (
              <CSVLink
                filename={`${generateCsvFormat().formattedCsvTitle.toLocaleLowerCase()}.csv`}
                headers={generateCsvFormat().header}
                data={generateCsvFormat().values}
                style={{ display: 'flex' }}
              >
                <CmkDownloadIcon fontSize="15" fill="#999999" />
              </CSVLink>
            ) : (
              <> </>
            )}
            <IconButton
              aria-label="Fullscreen"
              cursor="pointer"
              backgroundColor="transparent"
              icon={<CmkFullScreenIcon fontSize="15" fill="#999999" />}
              onClick={toggleFullScreen}
            />
          </Box>
        </Box>
        <Box
          position="absolute"
          marginTop="40px"
          top="0"
          left="45px"
          bottom="50px"
          right="10px"
        >
          <ReactEChartsCore
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{
              height: isFullScreen ? '100%' : height + 'px',
              margin: padding * -1 + 'px',
            }}
          />
        </Box>

        {loading && (
          <Center position="absolute" top="0" left="0" right="0" bottom="0">
            <Spinner color="purple.500" />
          </Center>
        )}
      </Box>
      <Flex align="center" mt="8">
        {durations.map((days) => (
          <Box
            key={days}
            p="2"
            mx="2"
            fontSize="sm"
            fontWeight="bold"
            color={duration === days ? 'purple.500' : 'gray.300'}
            cursor="pointer"
            onClick={() => setDuration(days as 'ALL')}
            _hover={
              duration === days
                ? {}
                : {
                    color: 'purple.500',
                  }
            }
          >
            {days === 'ALL' ? 'ALL' : `${days}D`}
          </Box>
        ))}
      </Flex>
      {info && (
        <Text
          fontSize="xs"
          pt="1"
          color="purple.500"
          paddingLeft="2"
          paddingBottom="2"
          position="absolute"
          bottom={1}
        >
          <a href={info.link} target="_blank" rel="noopener noreferrer">
            View on {info.platform}
          </a>
          <CmkArrowRight marginLeft="2" fontSize="10" />
        </Text>
      )}
    </Container>
  );
}