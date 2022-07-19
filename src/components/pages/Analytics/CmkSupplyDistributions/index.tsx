import { Box, Center, Grid, HStack, Spacer } from '@chakra-ui/layout';
import { chakra, Spinner, Text, useColorMode } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import ReactEChartsCore, { EChartsInstance } from 'echarts-for-react';
import React, { useLayoutEffect, useMemo, useRef } from 'react';

import { Card } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import { useDeepCompareMemoNoCheck } from '~/hooks/useDeepCompare';
import useFullscreen from '~/hooks/useFullscreen';
import { darkTheme } from '~/theme/echarts';
import {
  CmkAnalyticsDataPoint,
  StakedCmkAnalyticsDataPoint,
} from '~/types/analytics';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface PieChartProps {
  cmkData?: CmkAnalyticsDataPoint;
  xcmkData?: StakedCmkAnalyticsDataPoint;
  loading: boolean;
}

const ChartOverlay = chakra(Center, {
  baseStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pl: 10,
    pr: 8,
    pb: 16,
  },
});

export default function CmkSupplyDistributions({
  cmkData,
  xcmkData,
  loading,
}: PieChartProps): JSX.Element {
  const { colorMode } = useColorMode();

  const dataToShow = useDeepCompareMemoNoCheck(() => {
    if (!cmkData || !xcmkData) return undefined;

    return [
      {
        value:
          1e8 -
          (Number(cmkData.supply_distribution.community_treasury) +
            Number(cmkData.supply_distribution.dao_treasury) +
            Number(cmkData.supply_distribution.investor) +
            Number(cmkData.supply_distribution.team_allocated) +
            Number(cmkData.supply_distribution.team_unallocated) +
            Number(cmkData.supply_distribution.vesting_unallocated) +
            Number(xcmkData.cmk_balance)),
        itemStyle: { color: '#31B1F1' },
        name: 'Public Circulating Supply',
      },
      {
        value: xcmkData.cmk_balance,
        itemStyle: { color: '#2C94C4' },
        name: 'CMK Staked',
      },
      {
        value: cmkData.supply_distribution.community_treasury,
        itemStyle: { color: '#9A66BE' },
        name: 'Community Rewards',
      },
      {
        value: cmkData.supply_distribution.dao_treasury,
        itemStyle: { color: '#80579D' },
        name: 'DAO Treasury',
      },
      {
        value: cmkData.supply_distribution.investor,
        itemStyle: { color: '#33DEAA' },
        name: 'Investors',
      },
      {
        value: cmkData.supply_distribution.team_allocated,
        itemStyle: { color: '#40CDA1' },
        name: 'Team & Founders',
      },
      {
        value: cmkData.supply_distribution.team_unallocated,
        itemStyle: { color: '#3DBA93' },
        name: 'Team Unallocated',
      },
      {
        value: cmkData.supply_distribution.vesting_unallocated,
        itemStyle: { color: '#39A584' },
        name: 'Vesting Unallocated',
      },
    ];
  }, [cmkData, xcmkData]);

  const option = useDeepCompareMemoNoCheck(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: {
          marker: string;
          name: string;
          value: number;
        }) => {
          return `
                <div style="display: flex; margin-bottom: 2px;">
                  <div>${params.marker}</div>
                  <div style="flex: 1">${params.name}</div>
                  <strong style="margin-left: 16px">${shortenNumber(
                    params.value,
                    1,
                  )} CMK</strong>
                </div>
                `;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['0%', '50%'],
          label: {
            position: 'inner',
            fontSize: 12,
            color: 'white',
          },
          labelLine: {
            show: false,
          },
          data: cmkData
            ? [
                {
                  value:
                    1e8 -
                    (Number(cmkData.supply_distribution.community_treasury) +
                      Number(cmkData.supply_distribution.dao_treasury) +
                      Number(cmkData.supply_distribution.investor) +
                      Number(cmkData.supply_distribution.team_allocated) +
                      Number(cmkData.supply_distribution.team_unallocated) +
                      Number(cmkData.supply_distribution.vesting_unallocated)),
                  itemStyle: { color: '#1BA9EF' },
                  name: 'Public',
                },
                {
                  value:
                    Number(cmkData.supply_distribution.community_treasury) +
                    Number(cmkData.supply_distribution.dao_treasury),
                  itemStyle: { color: '#8F55B6' },
                  name: 'Treasury',
                },
                {
                  value:
                    Number(cmkData.supply_distribution.investor) +
                    Number(cmkData.supply_distribution.team_allocated) +
                    Number(cmkData.supply_distribution.team_unallocated) +
                    Number(cmkData.supply_distribution.vesting_unallocated),
                  itemStyle: { color: '#1BDAA0' },
                  name: 'Locked',
                },
              ]
            : [],
        },
        {
          type: 'pie',
          radius: ['55%', '70%'],
          label: {
            // position: 'inner',
            fontSize: 12,
            color: colorMode === 'dark' ? 'white' : undefined,
          },
          data: dataToShow,
        },
      ],
    };
  }, [cmkData, colorMode, dataToShow]);

  const containerRef = useRef(null);
  const chartRef = useRef<EChartsInstance>();

  const [containerWidth] = useSize(containerRef);
  const { isFullScreen, toggleFullScreen } = useFullscreen(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  const csv = useMemo(() => {
    if (dataToShow && dataToShow.length > 0) {
      const header = dataToShow.map((item) => item.name);
      const values = dataToShow.map((item) => item.value).toString();
      return { header, values };
    }

    return {
      header: [],
      values: '',
    };
  }, [dataToShow]);

  const showCurrentStats = false;
  const currentStats = [
    {
      label: 'Total Supply',
      value: cmkData
        ? `${shortenNumber(Number(cmkData.total_supply), 0)} CMK`
        : '-',
    },
  ];

  const height = 420;
  const noData = !dataToShow;

  return (
    <Card ref={containerRef}>
      <ChartHeader
        title="CMK Supply Distribution"
        downloadCsv={{
          filename: `${csv.header}.csv`,
          headers: csv.header,
          data: csv.values,
        }}
        isExpanded={isFullScreen}
        toggleExpand={toggleFullScreen}
      />
      <Grid
        gridTemplateRows={`${showCurrentStats ? 'max-content ' : ''}${
          isFullScreen ? '1fr' : height + 'px'
        }`}
        overflow="hidden"
      >
        {showCurrentStats && (
          <HStack align="center" p="2">
            {showCurrentStats &&
              currentStats.map(({ label, value }, index) => (
                <Box key={index} textAlign="left" px="2">
                  <Text fontSize="sm">{label}</Text>
                  <Text fontSize="3xl" fontWeight="medium">
                    {value}
                  </Text>
                </Box>
              ))}
            <Spacer />
            {loading && !noData && <Spinner color="purple.500" />}
          </HStack>
        )}
        <Box position="relative">
          <ReactEChartsCore
            theme={colorMode === 'dark' ? darkTheme : undefined}
            option={option}
            lazyUpdate={true}
            notMerge={true}
            style={{
              height: isFullScreen ? '100%' : height + 'px',
            }}
            onChartReady={(chart) => (chartRef.current = chart)}
          />
          {loading && noData && (
            <ChartOverlay>
              <Spinner color="purple.500" />
            </ChartOverlay>
          )}
        </Box>
      </Grid>
    </Card>
  );
}
