import { Box, HStack, Text } from '@chakra-ui/react';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo } from 'react';

import {
  CmkAnalyticsDataPoint,
  StakedCmkAnalyticsDataPoint,
} from '~/types/analytics';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface PieChartProps {
  cmkData: CmkAnalyticsDataPoint;
  xcmkData: StakedCmkAnalyticsDataPoint;
}

export default function CmkSupplyDistribution({
  cmkData,
  xcmkData,
}: PieChartProps): JSX.Element {
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
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
          data: [
            {
              value:
                1e8 -
                (Number(cmkData.supply_distribution.community_treasury) +
                  Number(cmkData.supply_distribution.dao_treasury) +
                  Number(cmkData.supply_distribution.investor) +
                  Number(cmkData.supply_distribution.team_allocated) +
                  Number(cmkData.supply_distribution.team_unallocated) +
                  Number(cmkData.supply_distribution.vesting_unallocated)),
              itemStyle: { color: '#DE1A60' },
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
              itemStyle: { color: '#08538C' },
              name: 'Locked',
            },
          ],
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
          data: [
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
              itemStyle: { color: '#F2005F' },
              name: 'Public Circulating Supply',
            },
            {
              value: xcmkData.cmk_balance,
              itemStyle: { color: '#FF007C' },
              name: 'CMK Staked',
            },
            {
              value: cmkData.supply_distribution.community_treasury,
              itemStyle: { color: '#420069' },
              name: 'Community Rewards',
            },
            {
              value: cmkData.supply_distribution.dao_treasury,
              itemStyle: { color: '#5D0096' },
              name: 'DAO Treasury',
            },
            {
              value: cmkData.supply_distribution.investor,
              itemStyle: { color: '#005999' },
              name: 'Investors',
            },
            {
              value: cmkData.supply_distribution.team_allocated,
              itemStyle: { color: '#006bb8' },
              name: 'Team & Founders',
            },
            {
              value: cmkData.supply_distribution.team_unallocated,
              itemStyle: { color: '#007dd6' },
              name: 'Team Unallocated',
            },
            {
              value: cmkData.supply_distribution.vesting_unallocated,
              itemStyle: { color: '#008ff5' },
              name: 'Vesting Unallocated',
            },
          ],
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
  }, [
    cmkData.supply_distribution.community_treasury,
    cmkData.supply_distribution.dao_treasury,
    cmkData.supply_distribution.investor,
    cmkData.supply_distribution.team_allocated,
    cmkData.supply_distribution.team_unallocated,
    cmkData.supply_distribution.vesting_unallocated,
    xcmkData.cmk_balance,
  ]);

  return (
    <Box>
      <HStack mx="8" justify="space-between">
        <HStack
          bg="white"
          shadow="lg"
          py="1"
          px="4"
          rounded="md"
          border="1px"
          borderColor="gray.100"
        >
          <Text
            fontFamily="Credmark Regular"
            fontSize="lg"
            pt="1"
            color="purple.500"
            textAlign="center"
          >
            CMK Supply
            <br />
            Distribution
          </Text>
        </HStack>
        <Text
          textAlign="center"
          fontSize="lg"
          bgGradient="linear(135deg, #08538C, #3B0065)"
          bgClip="text"
          px="4"
          rounded="md"
          lineHeight="1.1"
        >
          TOTAL SUPPLY
          <br />{' '}
          <Text as="span" fontWeight="bold">
            {shortenNumber(Number(cmkData.total_supply), 0)} CMK
          </Text>
        </Text>
      </HStack>
      <Box position="relative">
        <ReactEChartsCore
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{
            height: '360px',
          }}
        />
      </Box>
    </Box>
  );
}
