import { Box, Center, Grid, HStack, Spacer } from '@chakra-ui/layout';
import { chakra, Img, Spinner, Text } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import ReactEChartsCore, { EChartsInstance } from 'echarts-for-react';
import React, { useLayoutEffect, useRef } from 'react';

import { BorderedCard } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import { useDeepCompareMemo } from '~/hooks/useDeepCompare';
import useFullscreen from '~/hooks/useFullscreen';
import {
  CmkAnalyticsDataPoint,
  StakedCmkAnalyticsDataPoint,
} from '~/types/analytics';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface PieChartProps {
  cmkData?: CmkAnalyticsDataPoint;
  xcmkData?: StakedCmkAnalyticsDataPoint;
  titleImg: string;
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
  titleImg,
  loading,
}: PieChartProps): JSX.Element {
  const dataToShow = useDeepCompareMemo(() => {
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
        itemStyle: { color: '#DB1976' },
        name: 'Public Circulating Supply',
      },
      {
        value: xcmkData.cmk_balance,
        itemStyle: { color: '#BC1565' },
        name: 'CMK Staked',
      },
      {
        value: cmkData.supply_distribution.community_treasury,
        itemStyle: { color: '#420069' },
        name: 'Community Rewards',
      },
      {
        value: cmkData.supply_distribution.dao_treasury,
        itemStyle: { color: '#590099' },
        name: 'DAO Treasury',
      },
      {
        value: cmkData.supply_distribution.investor,
        itemStyle: { color: '#00996B' },
        name: 'Investors',
      },
      {
        value: cmkData.supply_distribution.team_allocated,
        itemStyle: { color: '#00AD7A' },
        name: 'Team & Founders',
      },
      {
        value: cmkData.supply_distribution.team_unallocated,
        itemStyle: { color: '#00BD84' },
        name: 'Team Unallocated',
      },
      {
        value: cmkData.supply_distribution.vesting_unallocated,
        itemStyle: { color: '#00D696' },
        name: 'Vesting Unallocated',
      },
    ];
  }, [cmkData, xcmkData]);

  const option = useDeepCompareMemo(() => {
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
            fontSize: 10,
            fontWeight: 900,
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
                  itemStyle: { color: '#DB1976' },
                  name: 'Public',
                },
                {
                  value:
                    Number(cmkData.supply_distribution.community_treasury) +
                    Number(cmkData.supply_distribution.dao_treasury),
                  itemStyle: { color: '#3B0065' },
                  name: 'Treasury',
                },
                {
                  value:
                    Number(cmkData.supply_distribution.investor) +
                    Number(cmkData.supply_distribution.team_allocated) +
                    Number(cmkData.supply_distribution.team_unallocated) +
                    Number(cmkData.supply_distribution.vesting_unallocated),
                  itemStyle: { color: '#00BD84' },
                  name: 'Locked',
                },
              ]
            : [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'pie',
          radius: ['55%', '70%'],
          data: dataToShow,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }, [cmkData, dataToShow]);

  const containerRef = useRef(null);
  const chartRef = useRef<EChartsInstance>();

  const [containerWidth] = useSize(containerRef);
  const { isFullScreen, toggleFullScreen } = useFullscreen(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  const generateCsvFormat = () => {
    if (dataToShow && dataToShow.length > 0) {
      const header = dataToShow.map((item) => item.name);
      const values = dataToShow.map((item) => item.value).toString();
      return { header, values };
    }

    return {
      header: [],
      values: '',
    };
  };

  const showCurrentStats = true;
  const currentStats = [
    {
      label: 'Total Supply',
      value: cmkData
        ? `${shortenNumber(Number(cmkData.total_supply), 0)} CMK`
        : '-',
    },
  ];

  const height = 360;
  const noData = !dataToShow;

  return (
    <BorderedCard ref={containerRef} display="grid" gridTemplateRows="auto 1fr">
      <ChartHeader
        title="CMK Supply Distribution"
        logo={
          <Img alt="CMK Supply Distribution" src={titleImg} height="20px" />
        }
        downloadFileName={`${generateCsvFormat().header}.csv`}
        downloadFileHeaders={generateCsvFormat().header}
        downloadData={generateCsvFormat().values}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
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
    </BorderedCard>
  );
}
